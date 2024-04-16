export declare const enum LogSeverity {
    VERBOSE = "verbose",
    INFO = "info",
    WARN = "warn",
    DEBUG = "debug",
    ERROR = "error"
}
export declare const LogLevel: {
    [key in LogSeverity]: number;
};
export declare const DisplaySeverityMap: {
    [key in LogSeverity]: string;
};
export declare function setLogLevel(logSeverity: LogSeverity): void;
export declare function setLogPattern(pattern: string): void;
export declare function setLogSeverityPattern(level: LogSeverity, pattern: string): void;
export declare class Logger {
    private readonly name;
    private readonly stringOnly;
    private readonly jsonLogging;
    private static errorStack;
    private static jsonTransformArgs;
    verbose(formatter: unknown, ...args: Array<unknown>): void;
    info(formatter: unknown, ...args: Array<unknown>): void;
    warn(formatter: unknown, ...args: Array<unknown>): void;
    debug(formatter: unknown, ...args: Array<unknown>): void;
    error(formatter: unknown, ...args: Array<unknown>): void;
    constructor(name: string, stringOnly: boolean, jsonLogging: boolean);
    private isLogEnabled;
    private log;
    private transformArgs;
}
