"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const debug_1 = __importDefault(require("debug"));
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
        this.log(0 /* VERBOSE */, formatter, args);
    }
    info(formatter, ...args) {
        this.log(1 /* INFO */, formatter, args);
    }
    warn(formatter, ...args) {
        this.log(2 /* WARN */, formatter, args);
    }
    debug(formatter, ...args) {
        this.log(3 /* DEBUG */, formatter, args);
    }
    error(formatter, ...args) {
        this.log(4 /* ERROR */, formatter, args);
    }
    log(logSeverity, formatter, ...args) {
        if (!Logger.isLogEnabled(logSeverity)) {
            return;
        }
        this._debugLogger(formatter, args);
    }
}
exports.Logger = Logger;
Logger.LOG_LEVEL_ENABLED = [
    0 /* VERBOSE */,
    1 /* INFO */,
    2 /* WARN */,
    3 /* DEBUG */,
    4 /* ERROR */,
].filter((logLevel) => Number(process.env.DEBUG_LEVEL || `${3 /* DEBUG */}`) <= logLevel);
//# sourceMappingURL=logger.js.map