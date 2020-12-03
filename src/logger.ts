import debug, { Debugger } from 'debug';

export const enum LogSeverity {
  VERBOSE,
  INFO,
  WARN,
  DEBUG,
  ERROR,
}

export class Logger {
  private static LOG_LEVEL_ENABLED: Array<LogSeverity> = [
    LogSeverity.VERBOSE,
    LogSeverity.INFO,
    LogSeverity.WARN,
    LogSeverity.DEBUG,
    LogSeverity.ERROR,
  ].filter((logLevel: LogSeverity) => Number(process.env.DEBUG_LEVEL || `${LogSeverity.DEBUG}`) <= logLevel);

  private readonly _debugLogger: Debugger;

  private static isLogEnabled(logSeverity: LogSeverity): boolean {
    return Logger.LOG_LEVEL_ENABLED.includes(logSeverity);
  }

  constructor(name: string) {
    this._debugLogger = debug(name);
  }

  get debugLogger(): Debugger {
    return this._debugLogger;
  }

  verbose(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.VERBOSE, formatter, args);
  }

  info(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.INFO, formatter, args);
  }

  warn(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.WARN, formatter, args);
  }

  debug(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.DEBUG, formatter, args);
  }

  error(formatter: unknown, ...args: Array<unknown>): void {
    this.log(LogSeverity.ERROR, formatter, args);
  }

  log(logSeverity: LogSeverity, formatter: unknown, ...args: Array<unknown>): void {
    if (!Logger.isLogEnabled(logSeverity)) {
      return;
    }
    this._debugLogger(formatter, args);
  }
}
