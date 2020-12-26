import util from 'util';

export const enum LogSeverity {
  VERBOSE = 'verbose',
  INFO = 'info',
  WARN = 'warn',
  DEBUG = 'debug',
  ERROR = 'error',
}

const LogLevel: { [key in LogSeverity]: number } = {
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

const matches: Array<string> = [];
const doesNotMatches: Array<string> = [];
(process.env.DEBUG || '*').split(',').forEach((key_: string) => {
  let key = key_;
  let operator = '+';
  if (key[0] === '-') {
    operator = '-';
    key = key.substr(1, key.length);
  }
  key = key.replace(new RegExp('\\*', 'g'), '.*');
  switch (operator) {
    case '-': {
      doesNotMatches.push(key);
      return;
    }
    default: {
      matches.push(key);
    }
  }
});

console.log('!!', matches);
console.log('!!a', doesNotMatches);
export class Logger {
  private static LOG_LEVEL_ENABLED: Array<LogSeverity> = [
    LogSeverity.VERBOSE,
    LogSeverity.INFO,
    LogSeverity.WARN,
    LogSeverity.DEBUG,
    LogSeverity.ERROR,
  ].filter((logLevel: LogSeverity) => (LogLevel[process.env.DEBUG_LEVEL] || LogLevel[LogSeverity.DEBUG]) <= LogLevel[logLevel]);

  private enabled: boolean = false;

  static matches(value: string): boolean {
    return matches.every((pattern: string) => new RegExp(`^${pattern}$`).test(value));
  }

  static doesNotMatches(value: string): boolean {
    return doesNotMatches.some((pattern: string) => new RegExp(`^${pattern}$`).test(value));
  }

  private static isLogEnabled(logSeverity: LogSeverity): boolean {
    return Logger.LOG_LEVEL_ENABLED.includes(logSeverity);
  }

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

  log(logSeverity: LogSeverity, formatter: unknown, ...args: Array<unknown>): void {
    if (!Logger.isLogEnabled(logSeverity) || !this.enabled) {
      return;
    }
    console.log(
      Color.severity, logSeverity,
      Color.application, this.name,
      Color[logSeverity], util.format(formatter, ...args),
      Color.reset);
  }

  constructor(private name: string) {
    this.enabled = Logger.matches(name) && !Logger.doesNotMatches(name);
  }
}
