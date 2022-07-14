import { Logger, LogSeverity } from './logger';
export declare class Logger4Node {
    private readonly _applicationName;
    static setLogLevel(logSeverity: LogSeverity): void;
    static setLogPattern(pattern: string): void;
    static setLogSeverityPattern(level: LogSeverity, pattern: string): void;
    constructor(applicationName: string);
    instance(name: string): Logger;
}
