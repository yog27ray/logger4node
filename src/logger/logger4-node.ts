import { Trace } from '../trace/trace';
import { GithubConfig, Logger, LogLevel, LogSeverity, setLogLevel, setLogPattern, setLogSeverityPattern } from './logger';

export class Logger4Node {
  static Trace = Trace;

  private readonly _applicationName: string;

  private stringLogging: boolean = false;

  private jsonLogging: boolean = false;

  private readonly github: GithubConfig;

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

  constructor(applicationName: string, option: { github?: GithubConfig; } = {}) {
    this._applicationName = applicationName;
    this.github = option.github ? { ...option.github } : undefined;
  }

  instance(name: string): Logger {
    return new Logger(`${this._applicationName}:${name}`, {
      github: this.github,
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
