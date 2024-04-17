"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.setLogSeverityPattern = exports.setLogPattern = exports.setLogLevel = exports.DisplaySeverityMap = exports.LogLevel = void 0;
const util_1 = __importDefault(require("util"));
exports.LogLevel = {
    verbose: 1,
    info: 2,
    warn: 3,
    debug: 4,
    error: 5,
};
exports.DisplaySeverityMap = {
    verbose: 'Verbose',
    info: 'Info',
    warn: 'Warn',
    debug: 'Debug',
    error: 'Error',
};
function generateMatchAndDoesNotMatchArray(input = '') {
    const positive = [];
    const negative = [];
    input.split(',').forEach((key_) => {
        let key = key_;
        let operator = '+';
        if (key[0] === '-') {
            operator = '-';
            key = key.substring(1, key.length);
        }
        key = key.replace(/\*/g, '.*');
        switch (operator) {
            case '-': {
                negative.push(key);
                return;
            }
            default: {
                positive.push(key);
            }
        }
    });
    return [positive, negative];
}
let positive = [];
let negative = [];
let minLogLevelEnabled = exports.LogLevel.debug;
const LOG_PATTERN = {
    ["verbose" /* LogSeverity.VERBOSE */]: { positive: [], negative: [] },
    ["info" /* LogSeverity.INFO */]: { positive: [], negative: [] },
    ["warn" /* LogSeverity.WARN */]: { positive: [], negative: [] },
    ["debug" /* LogSeverity.DEBUG */]: { positive: [], negative: [] },
    ["error" /* LogSeverity.ERROR */]: { positive: [], negative: [] },
};
function isNotMatchWithPatterns(patterns, value) {
    return patterns.every((pattern) => !new RegExp(`^${pattern}$`).test(value));
}
function isMatchWithPatterns(patterns, value) {
    return patterns.some((pattern) => new RegExp(`^${pattern}$`).test(value));
}
function setLogLevel(logSeverity) {
    minLogLevelEnabled = exports.LogLevel[logSeverity] || exports.LogLevel["debug" /* LogSeverity.DEBUG */];
}
exports.setLogLevel = setLogLevel;
function setLogPattern(pattern) {
    ([positive, negative] = generateMatchAndDoesNotMatchArray(pattern));
}
exports.setLogPattern = setLogPattern;
function setLogSeverityPattern(level, pattern) {
    ([LOG_PATTERN[level].positive, LOG_PATTERN[level].negative] = pattern ? generateMatchAndDoesNotMatchArray(pattern) : [[], []]);
}
exports.setLogSeverityPattern = setLogSeverityPattern;
let stringOnly = false;
let jsonLogging = false;
class Logger {
    static setOnlyStringLogging(vaue) {
        stringOnly = vaue;
    }
    static setJsonLogging(value) {
        jsonLogging = value;
    }
    static errorStack(...args) {
        return args
            .filter((each) => (each instanceof Error))
            .map((each) => each.stack).join('\n|\n');
    }
    static jsonTransformArgs(...args) {
        return util_1.default.format(...args.map((each) => {
            if (['string', 'number', 'boolean', 'bigint', 'function', 'undefined'].includes(typeof each)) {
                return each;
            }
            return JSON.stringify(each);
        }));
    }
    static transformArgs(...args) {
        return args.map((each) => {
            if (!stringOnly) {
                return each;
            }
            if (['string', 'number', 'boolean', 'bigint', 'function', 'undefined'].includes(typeof each)) {
                return each;
            }
            if (each instanceof Error) {
                return each;
            }
            return JSON.stringify(each);
        });
    }
    verbose(formatter, ...args) {
        this.log("verbose" /* LogSeverity.VERBOSE */, formatter, ...args);
    }
    info(formatter, ...args) {
        this.log("info" /* LogSeverity.INFO */, formatter, ...args);
    }
    warn(formatter, ...args) {
        this.log("warn" /* LogSeverity.WARN */, formatter, ...args);
    }
    debug(formatter, ...args) {
        this.log("debug" /* LogSeverity.DEBUG */, formatter, ...args);
    }
    error(formatter, ...args) {
        this.log("error" /* LogSeverity.ERROR */, formatter, ...args);
    }
    constructor(name) {
        this.name = name;
    }
    isLogEnabled(logSeverity) {
        if (!isNotMatchWithPatterns(LOG_PATTERN[logSeverity].negative, this.name)) {
            return false;
        }
        if (isMatchWithPatterns(LOG_PATTERN[logSeverity].positive, this.name)) {
            return true;
        }
        if (exports.LogLevel[logSeverity] < minLogLevelEnabled) {
            return false;
        }
        if (!isNotMatchWithPatterns(negative, this.name)) {
            return false;
        }
        return isMatchWithPatterns(positive, this.name);
    }
    log(logSeverity, formatter, ...args) {
        if (!this.isLogEnabled(logSeverity)) {
            return;
        }
        if (jsonLogging) {
            console.log(`{"className":"${this.name}","level":"${logSeverity}","message":"${Logger.jsonTransformArgs(formatter, ...args)}","stack":"${Logger.errorStack(formatter, ...args)}"}`);
            return;
        }
        console.log(`${exports.DisplaySeverityMap[logSeverity]}:`, this.name, util_1.default.format(formatter, ...Logger.transformArgs(...args)));
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map