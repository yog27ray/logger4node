import util from 'util';

import { Trace } from '../trace/trace';

export enum LogSeverity {
  DEBUG = 'debug',
  ERROR = 'error',
  FATAL = 'fatal',
  INFO = 'info',
  VERBOSE = 'verbose',
  WARN = 'warn',
}

export declare interface GithubConfig {
  basePath: string;
  commitHash: string;
  org: string;
  repo: string;
}

export const LogLevel: Record<LogSeverity, number> = {
  debug: 2,
  error: 5,
  fatal: 6,
  info: 3,
  verbose: 1,
  warn: 4,
};

export const DisplaySeverityMap: Record<LogSeverity, string> = {
  debug: 'Debug',
  error: 'Error',
  fatal: 'Fatal',
  info: 'Info',
  verbose: 'Verbose',
  warn: 'Warn',
};

const currentFolder = __dirname;

declare interface LoggerConfig {
  disableJsonStringify(): boolean;
  github: GithubConfig;
  jsonLogging(): boolean;
  logPattern: LogPattern;
  logSeverityPattern: LogSeverityPattern;
  minLogLevelEnabled(): number;
}

export declare interface LogPattern { negative: Array<string>; positive: Array<string>; }

export declare type LogSeverityPattern = Record<LogSeverity, LogPattern>;
export class Logger {
  private readonly config: LoggerConfig;

  private readonly name: string;

  constructor(loggerName: string, config: LoggerConfig) {
    this.name = loggerName;
    this.config = config;
  }

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
      if (['bigint', 'boolean', 'function', 'number', 'string'].includes(typeof each)) {
        return each;
      }
      return stringify(each);
    }));
  }

  private static transformArgs(...args: Array<unknown>): Array<unknown> {
    return args.map((each: unknown) => {
      if (['bigint', 'boolean', 'function', 'number', 'string', 'undefined'].includes(typeof each)) {
        return each;
      }
      if (each instanceof Error) {
        return each;
      }
      return stringify(each);
    });
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

  info(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.INFO, undefined, formatter, ...args);
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
        className: this.name,
        extra: extraData || {},
        level: logSeverity,
        message: Logger.jsonTransformArgs(formatter, ...args),
        request: Trace.getRequestInfo(),
        source: this.generateLogSource(),
        stack: Logger.errorStack(formatter, ...args),
        time: new Date().toISOString(),
      };
      console.log(this.config.disableJsonStringify() ? data : stringify(data));
      return;
    }
    console.log(
      `${DisplaySeverityMap[logSeverity]}:`,
      this.name,
      util.format(formatter, ...Logger.transformArgs(...args)));
  }

  verbose(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.VERBOSE, undefined, formatter, ...args);
  }

  warn(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.WARN, undefined, formatter, ...args);
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

  private generateLogSource(): Record<string, string> {
    const { stack } = new Error();
    const logSource = stack.split('\n')
      // .find((line): boolean => !ignoreFolders.some((folder: string): boolean => line.includes(folder))
      //     && line.trim().startsWith('at '));
      .find((line): boolean => !line.includes(currentFolder) && line.trim().startsWith('at '));
    if (!logSource) {
      return {};
    }
    if (logSource.endsWith(')')) {
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
        column,
        fileName,
        github: this.generateGithubLink(`${path}/${fileName}`, line),
        line,
        path,
      };
    }
    const filePathSplit = logSource.split('at ')[1].split('/');
    const [fileName, line, column] = filePathSplit.pop().split(':');
    if (!fileName || !line || !column) {
      return {};
    }
    const path = filePathSplit.join('/');
    return {
      column,
      fileName,
      github: this.generateGithubLink(`${path}/${fileName}`, line),
      line,
      path,
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

function generateMatchAndDoesNotMatchArray(input = ''): [Array<string>, Array<string>] {
  const positive: Array<string> = [];
  const negative: Array<string> = [];
  input.split(',').forEach((key_: string) => {
    let key = key_;
    let operator = '+';
    if (key.startsWith('-')) {
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

function isMatchWithPatterns(patterns: Array<string>, value: string): boolean {
  return patterns.some((pattern: string) => new RegExp(`^${pattern}$`).test(value));
}

function isNotMatchWithPatterns(patterns: Array<string>, value: string): boolean {
  return patterns.every((pattern: string) => !new RegExp(`^${pattern}$`).test(value));
}

function stringify(data: unknown): string {
  return JSON.stringify(data);
}
