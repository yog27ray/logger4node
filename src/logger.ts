import util from 'util';
import { Trace } from './trace';

export const enum LogSeverity {
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

const ignoreFolders = [
  `${process.cwd()}/src/logger.ts`,
  `${process.cwd()}/src/logger4-node.ts`,
  `${process.cwd()}/node_modules/src/logger.ts`,
  `${process.cwd()}/node_modules/src/logger4-node.ts`,
];
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

let positive: Array<string> = [];
let negative: Array<string> = [];
let minLogLevelEnabled = LogLevel.debug;

const LOG_PATTERN: { [key in LogSeverity]: { negative: Array<string>; positive: Array<string>; } } = {
  [LogSeverity.VERBOSE]: { positive: [], negative: [] },
  [LogSeverity.INFO]: { positive: [], negative: [] },
  [LogSeverity.WARN]: { positive: [], negative: [] },
  [LogSeverity.DEBUG]: { positive: [], negative: [] },
  [LogSeverity.ERROR]: { positive: [], negative: [] },
  [LogSeverity.FATAL]: { positive: [], negative: [] },
};

function isNotMatchWithPatterns(patterns: Array<string>, value: string): boolean {
  return patterns.every((pattern: string) => !new RegExp(`^${pattern}$`).test(value));
}

function isMatchWithPatterns(patterns: Array<string>, value: string): boolean {
  return patterns.some((pattern: string) => new RegExp(`^${pattern}$`).test(value));
}

export function setLogLevel(logSeverity: LogSeverity): void {
  minLogLevelEnabled = LogLevel[logSeverity] || LogLevel[LogSeverity.DEBUG];
}

export function setLogPattern(pattern: string): void {
  ([positive, negative] = generateMatchAndDoesNotMatchArray(pattern));
}

export function setLogSeverityPattern(level: LogSeverity, pattern: string): void {
  ([LOG_PATTERN[level].positive, LOG_PATTERN[level].negative] = pattern ? generateMatchAndDoesNotMatchArray(pattern) : [[], []]);
}

declare interface Callback {
  stringLogging(): boolean;
  jsonLogging(): boolean;
}

export class Logger {
  private readonly name: string;

  private readonly callbacks: Callback;

  private static errorStack(...args: Array<unknown>): string {
    return this.handleJSONSpecialCharacter(args
      .filter((each): boolean => (each instanceof Error))
      .map((each: { stack?: string; }): string => each.stack).join('\\n|\\n'));
  }

  private static jsonTransformArgs(...args: Array<unknown>): string {
    const message = util.format(...args.map((each: unknown) => {
      if (['string', 'number', 'boolean', 'bigint', 'function', 'undefined'].includes(typeof each)) {
        return each;
      }
      return JSON.stringify(each);
    }));
    return this.handleJSONSpecialCharacter(message);
  }

  private static handleJSONSpecialCharacter(message: string): string {
    return message
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/"/g, '\\"')
      .replace(/\r\n/g, '\\r\\n')
      .replace(/\n/g, '\\n');
  }

  private static stringifyJSON(json: Record<string, unknown> = {}): string {
    const jsonString = JSON.stringify(json);
    if (jsonString === '{}') {
      return '';
    }
    return jsonString;
  }

  private static generateLogSource(): string {
    const { stack } = new Error();
    const logSource = stack.split('\n')
      .find((line): boolean => !ignoreFolders.some((folder) => line.includes(folder))
        && line.trim().startsWith('at '));
    if (!logSource) {
      return '';
    }
    if (logSource[logSource.length - 1] === ')') {
      const [caller, filePath] = logSource.split(' (');
      if (!filePath) {
        return '';
      }
      const filePathSplit = filePath.substring(0, filePath.length - 1).split('/');
      const [fileName, line, column] = filePathSplit.pop().split(':');
      if (!fileName || !line || !column) {
        return '';
      }
      return JSON.stringify({
        caller: caller.split('at ')[1],
        fileName,
        path: filePathSplit.join('/'),
        line,
        column,
      });
    }
    const filePathSplit = logSource.split('at ')[1].split('/');
    const [fileName, line, column] = filePathSplit.pop().split(':');
    if (!fileName || !line || !column) {
      return '';
    }
    return JSON.stringify({
      fileName,
      path: filePathSplit.join('/'),
      line,
      column,
    });
  }

  verbose(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.VERBOSE, {}, formatter, ...args);
  }

  info(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.INFO, {}, formatter, ...args);
  }

  warn(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.WARN, {}, formatter, ...args);
  }

  debug(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.DEBUG, {}, formatter, ...args);
  }

  error(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.ERROR, {}, formatter, ...args);
  }

  fatal(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.FATAL, {}, formatter, ...args);
  }

  constructor(loggerName: string, callbacks: Callback) {
    this.name = loggerName;
    this.callbacks = callbacks;
  }

  log(
    logSeverity: LogSeverity,
    extraData: Record<string, unknown>,
    formatter: unknown,
    ...args: Array<unknown>): void {
    if (!this.isLogEnabled(logSeverity)) {
      return;
    }
    if (this.callbacks.jsonLogging()) {
      const source = Logger.generateLogSource();
      const sessionInfoString = Logger.stringifyJSON(Trace.getSessionInfo());
      const extraDataString = Logger.stringifyJSON(extraData);
      console.log(`{"className":"${this.name
      }","level":"${logSeverity
      }","message":"${Logger.jsonTransformArgs(formatter, ...args)
      }","stack":"${Logger.errorStack(formatter, ...args)}"${
        sessionInfoString ? `, "session": ${sessionInfoString}` : ''}${
        extraDataString ? `, "extraData": ${extraDataString}` : ''}${
        source ? `, "source": ${source}` : ''}}`);
      return;
    }
    console.log(
      `${DisplaySeverityMap[logSeverity]}:`,
      this.name,
      util.format(formatter, ...this.transformArgs(...args)));
  }

  private transformArgs(...args: Array<unknown>): Array<unknown> {
    return args.map((each: unknown) => {
      if (!this.callbacks.stringLogging()) {
        return each;
      }
      if (['string', 'number', 'boolean', 'bigint', 'function', 'undefined'].includes(typeof each)) {
        return each;
      }
      if (each instanceof Error) {
        return each;
      }
      return JSON.stringify(each);
    });
  }

  private isLogEnabled(logSeverity: LogSeverity): boolean {
    if (!isNotMatchWithPatterns(LOG_PATTERN[logSeverity].negative, this.name)) {
      return false;
    }
    if (isMatchWithPatterns(LOG_PATTERN[logSeverity].positive, this.name)) {
      return true;
    }
    if (LogLevel[logSeverity] < minLogLevelEnabled) {
      return false;
    }
    if (!isNotMatchWithPatterns(negative, this.name)) {
      return false;
    }
    return isMatchWithPatterns(positive, this.name);
  }
}
