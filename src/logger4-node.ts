import { Logger, LogLevel, LogSeverity, setLogLevel, setLogPattern, setLogSeverityPattern } from './logger';

export class Logger4Node {
  private readonly _applicationName: string;

  private stringLogging: boolean = false;

  private jsonLogging: boolean = false;

  private jsonLogging: boolean;

  static setLogLevel(logSeverity: LogSeverity): void {
    setLogLevel(logSeverity);
  }

  static setLogPattern(pattern: string): void {
    setLogPattern(pattern);
  }

  static setLogSeverityPattern(level: LogSeverity, pattern: string): void {
    setLogSeverityPattern(level, pattern);
  }

  setStringLogging(stringOnly: boolean): void {
    this.stringLogging = stringOnly;
  }

  setJsonLogging(jsonLogging: boolean): void {
    this.jsonLogging = jsonLogging;
  }

  constructor(applicationName: string) {
    this._applicationName = applicationName;
  }

  instance(name: string): Logger {
    return new Logger(`${this._applicationName}:${name}`, {
      jsonLogging: () => this.jsonLogging,
      stringLogging: () => this.stringLogging,
    });
  }
}

Logger4Node.setLogLevel(process.env.DEBUG_LEVEL as LogSeverity);
Logger4Node.setLogPattern(process.env.DEBUG);
Object.keys(LogLevel)
  .forEach((logSeverity: LogSeverity) => Logger4Node.setLogSeverityPattern(
    logSeverity,
    process.env[`LOG_${logSeverity.toUpperCase()}`]));
