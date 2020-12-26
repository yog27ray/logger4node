export declare const enum LogSeverity {
    VERBOSE = "verbose",
    INFO = "info",
    WARN = "warn",
    DEBUG = "debug",
    ERROR = "error"
}
export declare class Logger {
    private name;
    private static LOG_LEVEL_ENABLED;
    private enabled;
    static matches(value: string): boolean;
    static doesNotMatches(value: string): boolean;
    private static isLogEnabled;
    verbose(formatter: unknown, ...args: Array<unknown>): void;
    info(formatter: unknown, ...args: Array<unknown>): void;
    warn(formatter: unknown, ...args: Array<unknown>): void;
    debug(formatter: unknown, ...args: Array<unknown>): void;
    error(formatter: unknown, ...args: Array<unknown>): void;
    log(logSeverity: LogSeverity, formatter: unknown, ...args: Array<unknown>): void;
    constructor(name: string);
}
