export declare interface GithubConfig {
    basePath: string;
    commitHash: string;
    org: string;
    repo: string;
}
export declare enum LogSeverity {
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
export declare interface LogPattern {
    negative: Array<string>;
    positive: Array<string>;
}
export declare type LogSeverityPattern = {
    [key in LogSeverity]: LogPattern;
};
export declare function setLogPattern(logPattern: LogPattern, pattern: string): void;
export declare function setLogSeverityPattern(logSeverityPattern: LogSeverityPattern, level: LogSeverity, pattern: string): void;
declare interface LoggerConfig {
    github: GithubConfig;
    logSeverityPattern: LogSeverityPattern;
    logPattern: LogPattern;
    minLogLevelEnabled(): number;
    jsonLogging(): boolean;
}
export declare class Logger {
    private readonly name;
    private readonly config;
    private static errorStack;
    private static jsonTransformArgs;
    private static transformArgs;
    verbose(formatter: unknown, ...args: Array<unknown>): void;
    info(formatter: unknown, ...args: Array<unknown>): void;
    warn(formatter: unknown, ...args: Array<unknown>): void;
    debug(formatter: unknown, ...args: Array<unknown>): void;
    error(formatter: unknown, ...args: Array<unknown>): void;
    fatal(formatter: unknown, ...args: Array<unknown>): void;
    constructor(loggerName: string, config: LoggerConfig);
    log(logSeverity: LogSeverity, extraData: Record<string, unknown>, formatter: unknown, ...args: Array<unknown>): void;
    private generateLogSource;
    private isLogEnabled;
    private generateGithubLink;
}
export {};
