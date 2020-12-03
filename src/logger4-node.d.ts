import { Debugger } from 'debug';
export declare const enum LogSeverity {
    VERBOSE = 0,
    INFO = 1,
    WARN = 2,
    DEBUG = 3,
    ERROR = 4
}
export declare class Logger4Node {
    private static _ApplicationName;
    private static LOG_LEVEL_ENABLED;
    private readonly _debugLogger;
    static create(name: string): Logger4Node;
    static setApplicationName(applicationName: string): void;
    private static isLogEnabled;
    get debugLogger(): Debugger;
    verbose(formatter: unknown, ...args: Array<unknown>): void;
    info(formatter: unknown, ...args: Array<unknown>): void;
    warn(formatter: unknown, ...args: Array<unknown>): void;
    debug(formatter: unknown, ...args: Array<unknown>): void;
    error(formatter: unknown, ...args: Array<unknown>): void;
    log(logSeverity: LogSeverity, formatter: unknown, ...args: Array<unknown>): void;
    private constructor();
}
