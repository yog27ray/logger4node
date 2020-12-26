import debug, { Debugger } from 'debug';

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

export class Logger {
    private static LOG_LEVEL_ENABLED: Array<LogSeverity> = [
      LogSeverity.VERBOSE,
      LogSeverity.INFO,
      LogSeverity.WARN,
      LogSeverity.DEBUG,
      LogSeverity.ERROR,
    ].filter((logLevel: LogSeverity) => (LogLevel[process.env.DEBUG_LEVEL] || LogLevel[LogSeverity.DEBUG]) <= LogLevel[logLevel]);

    private readonly _debugLogger: Debugger;

    private static isLogEnabled(logSeverity: LogSeverity): boolean {
      return Logger.LOG_LEVEL_ENABLED.includes(logSeverity);
    }

    get debugLogger(): Debugger {
      return this._debugLogger;
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
      if (!Logger.isLogEnabled(logSeverity)) {
        return;
      }
      this._debugLogger(formatter, ...args, logSeverity);
    }

    constructor(name: string) {
      this._debugLogger = debug(name);
    }
}
