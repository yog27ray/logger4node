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
    static setOnlyStringLogging(vaue: boolean): void;
    static setJsonLogging(value: boolean): void;
    private static errorStack;
    private static jsonTransformArgs;
    private static transformArgs;
    verbose(formatter: unknown, ...args: Array<unknown>): void;
    info(formatter: unknown, ...args: Array<unknown>): void;
    warn(formatter: unknown, ...args: Array<unknown>): void;
    debug(formatter: unknown, ...args: Array<unknown>): void;
    error(formatter: unknown, ...args: Array<unknown>): void;
    constructor(name: string);
    private isLogEnabled;
    private log;
}
