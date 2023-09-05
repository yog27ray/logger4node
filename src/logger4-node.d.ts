import { Logger, LogSeverity } from './logger';
export declare class Logger4Node {
    private readonly _applicationName;
    private stringOnly;
    static setLogLevel(logSeverity: LogSeverity): void;
    static setLogPattern(pattern: string): void;
    static setLogSeverityPattern(level: LogSeverity, pattern: string): void;
    constructor(applicationName: string);
    setOnlyStringLogging(stringOnly: boolean): void;
    instance(name: string, { stringOnly }?: {
        stringOnly?: boolean;
    }): Logger;
}
