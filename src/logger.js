"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.setLogSeverityPattern = exports.setLogPattern = exports.setLogLevel = exports.DisplaySeverityMap = exports.LogLevel = void 0;
const util_1 = __importDefault(require("util"));
const trace_1 = require("./trace");
exports.LogLevel = {
    verbose: 1,
    debug: 2,
    info: 3,
    warn: 4,
    error: 5,
    fatal: 6,
};
exports.DisplaySeverityMap = {
    verbose: 'Verbose',
    info: 'Info',
    warn: 'Warn',
    debug: 'Debug',
    error: 'Error',
    fatal: 'Fatal',
};
const ignoreFolders = [
    `${process.cwd()}/src/logger.ts`,
    `${process.cwd()}/src/logger4-node.ts`,
    `${process.cwd()}/logger4node/src/logger.ts`,
    `${process.cwd()}/logger4node/src/logger4-node.ts`,
];
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
    ["fatal" /* LogSeverity.FATAL */]: { positive: [], negative: [] },
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
class Logger {
    static errorStack(...args) {
        return this.handleJSONSpecialCharacter(args
            .filter((each) => (each instanceof Error))
            .map((each) => each.stack).join('\\n|\\n'));
    }
    static jsonTransformArgs(...args) {
        const message = util_1.default.format(...args.map((each) => {
            if (['string', 'number', 'boolean', 'bigint', 'function', 'undefined'].includes(typeof each)) {
                return each;
            }
            return JSON.stringify(each);
        }));
        return this.handleJSONSpecialCharacter(message);
    }
    static handleJSONSpecialCharacter(message) {
        return message
            .replace(/\\/g, '\\\\')
            .replace(/\t/g, '\\t')
            .replace(/"/g, '\\"')
            .replace(/\r\n/g, '\\r\\n')
            .replace(/\n/g, '\\n');
    }
    static stringifyJSON(json = {}) {
        const jsonString = JSON.stringify(json);
        if (jsonString === '{}') {
            return '';
        }
        return jsonString;
    }
    static generateLogSource() {
        const { stack } = new Error();
        const logSource = stack.split('\n')
            .find((line) => !ignoreFolders.some((folder) => line.includes(folder))
            && line.trim().startsWith('at '));
        if (!logSource) {
            return '';
        }
        if (logSource[logSource.length - 1] === ')') {
            const [caller, filePath] = logSource.split(' (');
            if (!filePath) {
                return '';
            }
            const filePathSplit = filePath.substring(0, filePath.length - 1).split('/');
            const [fileName, line, column] = filePathSplit.pop().split(':');
            if (!fileName || !line || !column) {
                return '';
            }
            return JSON.stringify({
                caller: caller.split('at ')[1],
                fileName,
                path: filePathSplit.join('/'),
                line,
                column,
            });
        }
        const filePathSplit = logSource.split('at ')[1].split('/');
        const [fileName, line, column] = filePathSplit.pop().split(':');
        if (!fileName || !line || !column) {
            return '';
        }
        return JSON.stringify({
            fileName,
            path: filePathSplit.join('/'),
            line,
            column,
        });
    }
    verbose(formatter, ...args) {
        this.log("verbose" /* LogSeverity.VERBOSE */, {}, formatter, ...args);
    }
    info(formatter, ...args) {
        this.log("info" /* LogSeverity.INFO */, {}, formatter, ...args);
    }
    warn(formatter, ...args) {
        this.log("warn" /* LogSeverity.WARN */, {}, formatter, ...args);
    }
    debug(formatter, ...args) {
        this.log("debug" /* LogSeverity.DEBUG */, {}, formatter, ...args);
    }
    error(formatter, ...args) {
        this.log("error" /* LogSeverity.ERROR */, {}, formatter, ...args);
    }
    fatal(formatter, ...args) {
        this.log("fatal" /* LogSeverity.FATAL */, {}, formatter, ...args);
    }
    constructor(loggerName, callbacks) {
        this.name = loggerName;
        this.callbacks = callbacks;
    }
    log(logSeverity, extraData, formatter, ...args) {
        if (!this.isLogEnabled(logSeverity)) {
            return;
        }
        if (this.callbacks.jsonLogging()) {
            const source = Logger.generateLogSource();
            const sessionInfoString = Logger.stringifyJSON(trace_1.Trace.getSessionInfo());
            const extraDataString = Logger.stringifyJSON(extraData);
            console.log(`{"className":"${this.name}","level":"${logSeverity}","message":"${Logger.jsonTransformArgs(formatter, ...args)}","stack":"${Logger.errorStack(formatter, ...args)}"${sessionInfoString ? `, "session": ${sessionInfoString}` : ''}${extraDataString ? `, "extraData": ${extraDataString}` : ''}${source ? `, "source": ${source}` : ''}}`);
            return;
        }
        console.log(`${exports.DisplaySeverityMap[logSeverity]}:`, this.name, util_1.default.format(formatter, ...this.transformArgs(...args)));
    }
    transformArgs(...args) {
        return args.map((each) => {
            if (!this.callbacks.stringLogging()) {
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
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map