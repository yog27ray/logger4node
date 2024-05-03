"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger4Node = void 0;
const logger_1 = require("./logger");
const trace_1 = require("./trace");
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
    setStringLogging(stringOnly) {
        this.stringLogging = stringOnly;
    }
    setJsonLogging(jsonLogging) {
        this.jsonLogging = jsonLogging;
    }
    constructor(applicationName) {
        this.stringLogging = false;
        this.jsonLogging = false;
        this._applicationName = applicationName;
    }
    instance(name) {
        return new logger_1.Logger(`${this._applicationName}:${name}`, {
            jsonLogging: () => this.jsonLogging,
            stringLogging: () => this.stringLogging,
        });
    }
}
exports.Logger4Node = Logger4Node;
Logger4Node.Trace = trace_1.Trace;
Logger4Node.setLogLevel(process.env.DEBUG_LEVEL);
Logger4Node.setLogPattern(process.env.DEBUG);
Object.keys(logger_1.LogLevel)
    .forEach((logSeverity) => Logger4Node.setLogSeverityPattern(logSeverity, process.env[`LOG_${logSeverity.toUpperCase()}`]));
//# sourceMappingURL=logger4-node.js.map