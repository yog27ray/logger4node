import { Trace } from '../trace/trace';
import { GithubConfig, Logger, LogSeverity } from './logger';
export declare class Logger4Node {
    static Trace: typeof Trace;
    private readonly _applicationName;
    private stringLogging;
    private jsonLogging;
    private minLogLevelEnabled;
    private readonly github;
    private readonly logSeverityPattern;
    private readonly logPattern;
    setLogLevel(logSeverity?: LogSeverity): void;
    setLogPattern(pattern?: string): void;
    setLogSeverityPattern(level: LogSeverity, pattern?: string): void;
    setStringLogging(stringOnly: boolean): void;
    setJsonLogging(jsonLogging: boolean): void;
    constructor(applicationName: string, option?: {
        github?: GithubConfig;
    });
    instance(name: string): Logger;
}
