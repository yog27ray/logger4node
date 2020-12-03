import debug, { Debugger } from 'debug';

export enum LogSeverity {
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

  constructor(name: string) {
    this._debugLogger = debug(name);
  }

  get debugLogger(): Debugger {
    return this._debugLogger;
  }

  verbose(formatter: any, ...args: Array<any>): void {
    this.log(LogSeverity.VERBOSE, formatter, args);
  }

  info(formatter: any, ...args: Array<any>): void {
    this.log(LogSeverity.INFO, formatter, args);
  }

  warn(formatter: any, ...args: Array<any>): void {
    this.log(LogSeverity.WARN, formatter, args);
  }

  debug(formatter: any, ...args: Array<any>): void {
    this.log(LogSeverity.DEBUG, formatter, args);
  }

  error(formatter: any, ...args: Array<any>): void {
    this.log(LogSeverity.ERROR, formatter, args);
  }

  log(logSeverity: LogSeverity, formatter: any, ...args: Array<any>): void {
    if (!this.isLogEnabled(logSeverity)) {
      return;
    }
    this._debugLogger(formatter, args);
  }

  private isLogEnabled(logSeverity: LogSeverity): boolean {
    return Logger.LOG_LEVEL_ENABLED.includes(logSeverity);
  }
}
