"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const debug_1 = __importDefault(require("debug"));
const LogLevel = {
    verbose: 1,
    info: 2,
    warn: 3,
    debug: 4,
    error: 5,
};
class Logger {
    constructor(name) {
        this._debugLogger = debug_1.default(name);
    }
    static isLogEnabled(logSeverity) {
        return Logger.LOG_LEVEL_ENABLED.includes(logSeverity);
    }
    get debugLogger() {
        return this._debugLogger;
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
        if (!Logger.isLogEnabled(logSeverity)) {
            return;
        }
        this._debugLogger(logSeverity, formatter, ...args);
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