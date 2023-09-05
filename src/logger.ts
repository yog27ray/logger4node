import util from 'util';

export const enum LogSeverity {
  VERBOSE = 'verbose',
  INFO = 'info',
  WARN = 'warn',
  DEBUG = 'debug',
  ERROR = 'error',
}

export const LogLevel: { [key in LogSeverity]: number } = {
  verbose: 1,
  info: 2,
  warn: 3,
  debug: 4,
  error: 5,
};

const Color: { [key in LogSeverity]: string; } & { reset: string; application: string; severity: string; } = {
  severity: '\x1b[33m', // yellow
  application: '\x1b[36m', // cyan
  reset: '\x1b[0m', // reset
  verbose: '\x1b[37m', // white
  info: '\x1b[35m', // magenta
  warn: '\x1b[33m', // yellow
  debug: '\x1b[34m', // blue
  error: '\x1b[31m', // Red
};

function generateMatchAndDoesNotMatchArray(input: string = ''): [Array<string>, Array<string>] {
  const positive: Array<string> = [];
  const negative: Array<string> = [];
  input.split(',').forEach((key_: string) => {
    let key = key_;
    let operator = '+';
    if (key[0] === '-') {
      operator = '-';
      key = key.substr(1, key.length);
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

export class Logger {
  private readonly name: string;

  private readonly stringOnly: boolean = false;

  verbose(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.VERBOSE, formatter, ...args);
  }

  info(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.INFO, formatter, ...args);
  }

  warn(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.WARN, formatter, ...args);
  }

  debug(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.DEBUG, formatter, ...args);
  }

  error(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.ERROR, formatter, ...args);
  }

  constructor(name: string, stringOnly: boolean) {
    this.name = name;
    this.stringOnly = stringOnly;
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

  private log(logSeverity: LogSeverity, formatter: unknown, ...args: Array<unknown>): void {
    if (!this.isLogEnabled(logSeverity)) {
      return;
    }
    console.log(
      Color.severity,
      logSeverity,
      Color.application,
      this.name,
      Color[logSeverity],
      util.format(formatter, ...this.transformArgs(...args)),
      Color.reset);
  }

  private transformArgs(...args: Array<unknown>): Array<unknown> {
    return args.map((each: unknown) => {
      if (!this.stringOnly) {
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
}
