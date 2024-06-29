import { Trace } from '../trace/trace';
import {
  GithubConfig,
  Logger,
  LogLevel, LogPattern,
  LogSeverity,
  LogSeverityPattern,
  setLogPattern,
  setLogSeverityPattern,
} from './logger';

export class Logger4Node {
  static Trace = Trace;

  private readonly _applicationName: string;

  private stringLogging: boolean = false;

  private jsonLogging: boolean = false;

  private minLogLevelEnabled: number = LogLevel[LogSeverity.DEBUG];

  private readonly github: GithubConfig;

  private readonly logSeverityPattern: LogSeverityPattern = {
    [LogSeverity.FATAL]: { positive: [], negative: [] },
    [LogSeverity.ERROR]: { positive: [], negative: [] },
    [LogSeverity.WARN]: { positive: [], negative: [] },
    [LogSeverity.INFO]: { positive: [], negative: [] },
    [LogSeverity.DEBUG]: { positive: [], negative: [] },
    [LogSeverity.VERBOSE]: { positive: [], negative: [] },
  };

  private readonly logPattern: LogPattern = { positive: [], negative: [] };

  setLogLevel(logSeverity: LogSeverity = process.env.DEBUG_LEVEL as LogSeverity): void {
    this.minLogLevelEnabled = LogLevel[logSeverity] || LogLevel[LogSeverity.DEBUG];
  }

  setLogPattern(pattern: string = process.env.DEBUG): void {
    setLogPattern(this.logPattern, pattern);
  }

  setLogSeverityPattern(level: LogSeverity, pattern?: string): void {
    setLogSeverityPattern(this.logSeverityPattern, level, pattern || process.env[`LOG_${level.toUpperCase()}`]);
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
    this.setLogLevel(process.env.DEBUG_LEVEL as LogSeverity);
    this.setLogPattern(process.env.DEBUG);
    Object.keys(LogLevel)
      .forEach((logSeverity: LogSeverity) => this.setLogSeverityPattern(
        logSeverity,
        process.env[`LOG_${logSeverity.toUpperCase()}`]));
  }

  instance(name: string): Logger {
    return new Logger(`${this._applicationName}:${name}`, {
      github: this.github,
      logSeverityPattern: this.logSeverityPattern,
      logPattern: this.logPattern,
      minLogLevelEnabled: () => this.minLogLevelEnabled,
      jsonLogging: () => this.jsonLogging,
      stringLogging: () => this.stringLogging,
    });
  }
}
