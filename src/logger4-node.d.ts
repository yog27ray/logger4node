import { Logger, LogSeverity } from './logger';
import { Trace } from './trace';
export declare class Logger4Node {
    static Trace: typeof Trace;
    private readonly _applicationName;
    private stringLogging;
    private jsonLogging;
    static setLogLevel(logSeverity: LogSeverity): void;
    static setLogPattern(pattern: string): void;
    static setLogSeverityPattern(level: LogSeverity, pattern: string): void;
    setStringLogging(stringOnly: boolean): void;
    setJsonLogging(jsonLogging: boolean): void;
    constructor(applicationName: string);
    instance(name: string): Logger;
}
