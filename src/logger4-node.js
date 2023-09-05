"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger4Node = void 0;
const logger_1 = require("./logger");
class Logger4Node {
    static setLogLevel(logSeverity) {
        (0, logger_1.setLogLevel)(logSeverity);
    }
    static setLogPattern(pattern) {
        (0, logger_1.setLogPattern)(pattern);
    }
    static setLogSeverityPattern(level, pattern) {
        (0, logger_1.setLogSeverityPattern)(level, pattern);
    }
    constructor(applicationName) {
        this._applicationName = applicationName;
    }
    setOnlyStringLogging(stringOnly) {
        this.stringOnly = stringOnly;
    }
    instance(name, { stringOnly = this.stringOnly } = {}) {
        return new logger_1.Logger(`${this._applicationName}:${name}`, stringOnly);
    }
}
exports.Logger4Node = Logger4Node;
Logger4Node.setLogLevel(process.env.DEBUG_LEVEL);
Logger4Node.setLogPattern(process.env.DEBUG);
Object.keys(logger_1.LogLevel)
    .forEach((logSeverity) => Logger4Node.setLogSeverityPattern(logSeverity, process.env[`LOG_${logSeverity.toUpperCase()}`]));
//# sourceMappingURL=logger4-node.js.map