"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger4Node = void 0;
const trace_1 = require("../trace/trace");
const logger_1 = require("./logger");
class Logger4Node {
    setLogLevel(logSeverity = process.env.DEBUG_LEVEL) {
        this.minLogLevelEnabled = logger_1.LogLevel[logSeverity] || logger_1.LogLevel[logger_1.LogSeverity.DEBUG];
    }
    setLogPattern(pattern = process.env.DEBUG) {
        (0, logger_1.setLogPattern)(this.logPattern, pattern);
    }
    setLogSeverityPattern(level, pattern) {
        (0, logger_1.setLogSeverityPattern)(this.logSeverityPattern, level, pattern || process.env[`LOG_${level.toUpperCase()}`]);
    }
    setStringLogging(stringOnly) {
        this.stringLogging = stringOnly;
    }
    setJsonLogging(jsonLogging) {
        this.jsonLogging = jsonLogging;
    }
    constructor(applicationName, option = {}) {
        this.stringLogging = false;
        this.jsonLogging = false;
        this.minLogLevelEnabled = logger_1.LogLevel[logger_1.LogSeverity.DEBUG];
        this.logSeverityPattern = {
            [logger_1.LogSeverity.FATAL]: { positive: [], negative: [] },
            [logger_1.LogSeverity.ERROR]: { positive: [], negative: [] },
            [logger_1.LogSeverity.WARN]: { positive: [], negative: [] },
            [logger_1.LogSeverity.INFO]: { positive: [], negative: [] },
            [logger_1.LogSeverity.DEBUG]: { positive: [], negative: [] },
            [logger_1.LogSeverity.VERBOSE]: { positive: [], negative: [] },
        };
        this.logPattern = { positive: [], negative: [] };
        this._applicationName = applicationName;
        this.github = option.github ? { ...option.github } : undefined;
        this.setLogLevel(process.env.DEBUG_LEVEL);
        this.setLogPattern(process.env.DEBUG);
        Object.keys(logger_1.LogLevel)
            .forEach((logSeverity) => this.setLogSeverityPattern(logSeverity, process.env[`LOG_${logSeverity.toUpperCase()}`]));
    }
    instance(name) {
        return new logger_1.Logger(`${this._applicationName}:${name}`, {
            github: this.github,
            logSeverityPattern: this.logSeverityPattern,
            logPattern: this.logPattern,
            minLogLevelEnabled: () => this.minLogLevelEnabled,
            jsonLogging: () => this.jsonLogging,
        });
    }
}
exports.Logger4Node = Logger4Node;
Logger4Node.Trace = trace_1.Trace;
//# sourceMappingURL=logger4-node.js.map