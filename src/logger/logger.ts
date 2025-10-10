import util from 'util';
import { Trace } from '../trace/trace';

export declare interface GithubConfig {
  basePath: string;
  commitHash: string;
  org: string;
  repo: string;
}

export enum LogSeverity {
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export const LogLevel: { [key in LogSeverity]: number } = {
  verbose: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
  fatal: 6,
};

export const DisplaySeverityMap: { [key in LogSeverity]: string } = {
  verbose: 'Verbose',
  info: 'Info',
  warn: 'Warn',
  debug: 'Debug',
  error: 'Error',
  fatal: 'Fatal',
};

const currentFolder = __dirname;

function stringify(data: unknown): string {
  return JSON.stringify(data);
}

function generateMatchAndDoesNotMatchArray(input: string = ''): [Array<string>, Array<string>] {
  const positive: Array<string> = [];
  const negative: Array<string> = [];
  input.split(',').forEach((key_: string) => {
    let key = key_;
    let operator = '+';
    if (key[0] === '-') {
      operator = '-';
      key = key.substring(1, key.length);
    }
    key = key.replace(/\*/g, '.*');
    switch (operator) {
      case '-': {
        negative.push(key);
        return;
      }
      default: {
        positive.push(key);
      }
    }
  });
  return [positive, negative];
}

export declare interface LogPattern { negative: Array<string>; positive: Array<string>; }
export declare type LogSeverityPattern = { [key in LogSeverity]: LogPattern };

function isNotMatchWithPatterns(patterns: Array<string>, value: string): boolean {
  return patterns.every((pattern: string) => !new RegExp(`^${pattern}$`).test(value));
}

function isMatchWithPatterns(patterns: Array<string>, value: string): boolean {
  return patterns.some((pattern: string) => new RegExp(`^${pattern}$`).test(value));
}

export function setLogPattern(logPattern: LogPattern, pattern: string): void {
  logPattern.positive.splice(0, logPattern.positive.length);
  logPattern.negative.splice(0, logPattern.positive.length);
  const [positive, negative] = generateMatchAndDoesNotMatchArray(pattern);
  logPattern.positive.push(...positive);
  logPattern.negative.push(...negative);
}

export function setLogSeverityPattern(logSeverityPattern: LogSeverityPattern, level: LogSeverity, pattern: string): void {
  logSeverityPattern[level].positive.splice(0, logSeverityPattern[level].positive.length);
  logSeverityPattern[level].negative.splice(0, logSeverityPattern[level].positive.length);
  const [positive, negative] = pattern ? generateMatchAndDoesNotMatchArray(pattern) : [[], []];
  logSeverityPattern[level].positive.push(...positive);
  logSeverityPattern[level].negative.push(...negative);
}

declare interface LoggerConfig {
  github: GithubConfig;
  logSeverityPattern: LogSeverityPattern;
  logPattern: LogPattern;
  minLogLevelEnabled(): number;
  jsonLogging(): boolean;
  disableJsonStringify(): boolean;
}

export class Logger {
  private readonly name: string;

  private readonly config: LoggerConfig;

  private static errorStack(...args: Array<unknown>): string {
    const errorStacks = args
      .filter((each): boolean => (each instanceof Error))
      .map((each: { stack?: string; }): string => each.stack);
    if (!errorStacks.length) {
      return '';
    }
    return errorStacks.join('\\n|\\n');
  }

  private static jsonTransformArgs(...args: Array<unknown>): string {
    return util.format(...args.map((each: unknown) => {
      if (['string', 'number', 'boolean', 'bigint', 'function'].includes(typeof each)) {
        return each;
      }
      return stringify(each);
    }));
  }

  private static transformArgs(...args: Array<unknown>): Array<unknown> {
    return args.map((each: unknown) => {
      if (['string', 'number', 'boolean', 'bigint', 'function', 'undefined'].includes(typeof each)) {
        return each;
      }
      if (each instanceof Error) {
        return each;
      }
      return stringify(each);
    });
  }

  verbose(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.VERBOSE, undefined, formatter, ...args);
  }

  info(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.INFO, undefined, formatter, ...args);
  }

  warn(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.WARN, undefined, formatter, ...args);
  }

  debug(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.DEBUG, undefined, formatter, ...args);
  }

  error(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.ERROR, undefined, formatter, ...args);
  }

  fatal(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.FATAL, undefined, formatter, ...args);
  }

  constructor(loggerName: string, config: LoggerConfig) {
    this.name = loggerName;
    this.config = config;
  }

  log(
    logSeverity: LogSeverity,
    extraData: Record<string, unknown>,
    formatter: unknown,
    ...args: Array<unknown>): void {
    if (!this.isLogEnabled(logSeverity)) {
      return;
    }
    if (this.config.jsonLogging()) {
      const data = {
        level: logSeverity,
        time: new Date().toISOString(),
        className: this.name,
        source: this.generateLogSource(),
        message: Logger.jsonTransformArgs(formatter, ...args),
        request: Trace.getRequestInfo(),
        extra: extraData || {},
        stack: Logger.errorStack(formatter, ...args),
      };
      console.log(this.config.disableJsonStringify() ? data : stringify(data));
      return;
    }
    console.log(
      `${DisplaySeverityMap[logSeverity]}:`,
      this.name,
      util.format(formatter, ...Logger.transformArgs(...args)));
  }

  private generateLogSource(): Record<string, string> {
    const { stack } = new Error();
    const logSource = stack.split('\n')
      // .find((line): boolean => !ignoreFolders.some((folder: string): boolean => line.includes(folder))
      //     && line.trim().startsWith('at '));
      .find((line): boolean => !line.includes(currentFolder) && line.trim().startsWith('at '));
    if (!logSource) {
      return {};
    }
    if (logSource[logSource.length - 1] === ')') {
      const [caller, filePath] = logSource.split(' (');
      if (!filePath) {
        return {};
      }
      const filePathSplit = filePath.substring(0, filePath.length - 1).split('/');
      const [fileName, line, column] = filePathSplit.pop().split(':');
      if (!fileName || !line || !column) {
        return {};
      }
      const path = filePathSplit.join('/');
      return {
        caller: caller.split('at ')[1],
        fileName,
        path,
        line,
        column,
        github: this.generateGithubLink(`${path}/${fileName}`, line),
      };
    }
    const filePathSplit = logSource.split('at ')[1].split('/');
    const [fileName, line, column] = filePathSplit.pop().split(':');
    if (!fileName || !line || !column) {
      return {};
    }
    const path = filePathSplit.join('/');
    return {
      fileName,
      path,
      line,
      column,
      github: this.generateGithubLink(`${path}/${fileName}`, line),
    };
  }

  private isLogEnabled(logSeverity: LogSeverity): boolean {
    if (!isNotMatchWithPatterns(this.config.logSeverityPattern[logSeverity].negative, this.name)) {
      return false;
    }
    if (isMatchWithPatterns(this.config.logSeverityPattern[logSeverity].positive, this.name)) {
      return true;
    }
    if (LogLevel[logSeverity] < this.config.minLogLevelEnabled()) {
      return false;
    }
    if (!isNotMatchWithPatterns(this.config.logPattern.negative, this.name)) {
      return false;
    }
    return isMatchWithPatterns(this.config.logPattern.positive, this.name);
  }

  private generateGithubLink(file: string, line: string): string {
    if (!this.config.github) {
      return undefined;
    }
    const githubFilePath = file.split(this.config.github.basePath)[1];
    if (githubFilePath.includes('node_modules')) {
      return undefined;
    }
    return `https://github.com/${this.config.github.org}/${this.config.github.repo
    }/blob/${this.config.github.commitHash}${githubFilePath}#L${line}`;
  }
}
