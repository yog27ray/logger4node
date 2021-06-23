"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const util_1 = __importDefault(require("util"));
const LogLevel = {
    verbose: 1,
    info: 2,
    warn: 3,
    debug: 4,
    error: 5,
};
const Color = {
    severity: '\x1b[33m',
    application: '\x1b[36m',
    reset: '\x1b[0m',
    verbose: '\x1b[37m',
    info: '\x1b[35m',
    warn: '\x1b[33m',
    debug: '\x1b[34m',
    error: '\x1b[31m', // Red
};
const matches = [];
const doesNotMatches = [];
(process.env.DEBUG || '*').split(',').forEach((key_) => {
    let key = key_;
    let operator = '+';
    if (key[0] === '-') {
        operator = '-';
        key = key.substr(1, key.length);
    }
    key = key.replace(new RegExp('\\*', 'g'), '.*');
    switch (operator) {
        case '-': {
            doesNotMatches.push(key);
            return;
        }
        default: {
            matches.push(key);
        }
    }
});
class Logger {
    constructor(name) {
        this.name = name;
        this.enabled = false;
        this.enabled = Logger.matches(name) && !Logger.doesNotMatches(name);
    }
    static matches(value) {
        return matches.some((pattern) => new RegExp(`^${pattern}$`).test(value));
    }
    static doesNotMatches(value) {
        return doesNotMatches.some((pattern) => new RegExp(`^${pattern}$`).test(value));
    }
    static isLogEnabled(logSeverity) {
        return Logger.LOG_LEVEL_ENABLED.includes(logSeverity);
    }
    verbose(formatter, ...args) {
        this.log("verbose" /* VERBOSE */, formatter, ...args);
    }
    info(formatter, ...args) {
        this.log("info" /* INFO */, formatter, ...args);
    }
    warn(formatter, ...args) {
        this.log("warn" /* WARN */, formatter, ...args);
    }
    debug(formatter, ...args) {
        this.log("debug" /* DEBUG */, formatter, ...args);
    }
    error(formatter, ...args) {
        this.log("error" /* ERROR */, formatter, ...args);
    }
    log(logSeverity, formatter, ...args) {
        if (!Logger.isLogEnabled(logSeverity) || !this.enabled) {
            return;
        }
        console.log(Color.severity, logSeverity, Color.application, this.name, Color[logSeverity], util_1.default.format(formatter, ...args), Color.reset);
    }
}
exports.Logger = Logger;
Logger.LOG_LEVEL_ENABLED = [
    "verbose" /* VERBOSE */,
    "info" /* INFO */,
    "warn" /* WARN */,
    "debug" /* DEBUG */,
    "error" /* ERROR */,
].filter((logLevel) => (LogLevel[process.env.DEBUG_LEVEL] || LogLevel["debug" /* DEBUG */]) <= LogLevel[logLevel]);
//# sourceMappingURL=logger.js.map