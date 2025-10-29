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

  private disableJsonStringify = false;

  private readonly github: GithubConfig;

  private jsonLogging = false;

  private readonly logPattern: LogPattern = { negative: [], positive: [] };

  private readonly logSeverityPattern: LogSeverityPattern = {
    [LogSeverity.DEBUG]: { negative: [], positive: [] },
    [LogSeverity.ERROR]: { negative: [], positive: [] },
    [LogSeverity.FATAL]: { negative: [], positive: [] },
    [LogSeverity.INFO]: { negative: [], positive: [] },
    [LogSeverity.VERBOSE]: { negative: [], positive: [] },
    [LogSeverity.WARN]: { negative: [], positive: [] },
  };

  private minLogLevelEnabled: number = LogLevel[LogSeverity.DEBUG];

  private stringLogging = false;

  constructor(applicationName: string, option: { github?: GithubConfig; } = {}) {
    this._applicationName = applicationName;
    this.github = option.github ? { ...option.github } : undefined;
    this.setLogLevel(process.env.DEBUG_LEVEL as LogSeverity);
    this.setLogPattern(process.env.DEBUG);
    console.log(`App: ${applicationName}`, 'Default logging details :', process.env.DEBUG_LEVEL, process.env.DEBUG);
    Object.keys(LogLevel)
      .forEach((logSeverity: LogSeverity) => this.setLogSeverityPattern(
        logSeverity,
        process.env[`LOG_${logSeverity.toUpperCase()}`]));
  }

  instance(name: string): Logger {
    return new Logger(`${this._applicationName}:${name}`, {
      disableJsonStringify: () => this.disableJsonStringify,
      github: this.github,
      jsonLogging: () => this.jsonLogging,
      logPattern: this.logPattern,
      logSeverityPattern: this.logSeverityPattern,
      minLogLevelEnabled: () => this.minLogLevelEnabled,
    });
  }

  setDisableJsonStringify(disableJsonStringify: boolean): void {
    this.disableJsonStringify = disableJsonStringify;
  }

  setJsonLogging(jsonLogging: boolean): void {
    this.jsonLogging = jsonLogging;
  }

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
}
