export declare const enum LogSeverity {
    VERBOSE = "verbose",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal"
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
declare interface Callback {
    stringLogging(): boolean;
    jsonLogging(): boolean;
}
export declare class Logger {
    private readonly name;
    private readonly callbacks;
    private static errorStack;
    private static jsonTransformArgs;
    private static handleJSONSpecialCharacter;
    private static stringifyJSON;
    private static generateLogSource;
    verbose(formatter: unknown, ...args: Array<unknown>): void;
    info(formatter: unknown, ...args: Array<unknown>): void;
    warn(formatter: unknown, ...args: Array<unknown>): void;
    debug(formatter: unknown, ...args: Array<unknown>): void;
    error(formatter: unknown, ...args: Array<unknown>): void;
    fatal(formatter: unknown, ...args: Array<unknown>): void;
    constructor(loggerName: string, callbacks: Callback);
    log(logSeverity: LogSeverity, extraData: Record<string, unknown>, formatter: unknown, ...args: Array<unknown>): void;
    private transformArgs;
    private isLogEnabled;
}
export {};
