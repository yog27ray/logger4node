"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.setLogSeverityPattern = exports.setLogPattern = exports.DisplaySeverityMap = exports.LogLevel = exports.LogSeverity = void 0;
const util_1 = __importDefault(require("util"));
const trace_1 = require("../trace/trace");
var LogSeverity;
(function (LogSeverity) {
    LogSeverity["VERBOSE"] = "verbose";
    LogSeverity["DEBUG"] = "debug";
    LogSeverity["INFO"] = "info";
    LogSeverity["WARN"] = "warn";
    LogSeverity["ERROR"] = "error";
    LogSeverity["FATAL"] = "fatal";
})(LogSeverity || (exports.LogSeverity = LogSeverity = {}));
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
const currentFolder = __dirname;
function stringify(data) {
    return JSON.stringify(data);
}
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
function isNotMatchWithPatterns(patterns, value) {
    return patterns.every((pattern) => !new RegExp(`^${pattern}$`).test(value));
}
function isMatchWithPatterns(patterns, value) {
    return patterns.some((pattern) => new RegExp(`^${pattern}$`).test(value));
}
function setLogPattern(logPattern, pattern) {
    logPattern.positive.splice(0, logPattern.positive.length);
    logPattern.negative.splice(0, logPattern.positive.length);
    const [positive, negative] = generateMatchAndDoesNotMatchArray(pattern);
    logPattern.positive.push(...positive);
    logPattern.negative.push(...negative);
}
exports.setLogPattern = setLogPattern;
function setLogSeverityPattern(logSeverityPattern, level, pattern) {
    logSeverityPattern[level].positive.splice(0, logSeverityPattern[level].positive.length);
    logSeverityPattern[level].negative.splice(0, logSeverityPattern[level].positive.length);
    const [positive, negative] = pattern ? generateMatchAndDoesNotMatchArray(pattern) : [[], []];
    logSeverityPattern[level].positive.push(...positive);
    logSeverityPattern[level].negative.push(...negative);
}
exports.setLogSeverityPattern = setLogSeverityPattern;
class Logger {
    static errorStack(...args) {
        const errorStacks = args
            .filter((each) => (each instanceof Error))
            .map((each) => each.stack);
        if (!errorStacks.length) {
            return '';
        }
        return errorStacks.join('\\n|\\n');
    }
    static jsonTransformArgs(...args) {
        return util_1.default.format(...args.map((each) => {
            if (['string', 'number', 'boolean', 'bigint', 'function'].includes(typeof each)) {
                return each;
            }
            return stringify(each);
        }));
    }
    static transformArgs(...args) {
        return args.map((each) => {
            if (['string', 'number', 'boolean', 'bigint', 'function', 'undefined'].includes(typeof each)) {
                return each;
            }
            if (each instanceof Error) {
                return each;
            }
            return stringify(each);
        });
    }
    verbose(formatter, ...args) {
        this.log(LogSeverity.VERBOSE, undefined, formatter, ...args);
    }
    info(formatter, ...args) {
        this.log(LogSeverity.INFO, undefined, formatter, ...args);
    }
    warn(formatter, ...args) {
        this.log(LogSeverity.WARN, undefined, formatter, ...args);
    }
    debug(formatter, ...args) {
        this.log(LogSeverity.DEBUG, undefined, formatter, ...args);
    }
    error(formatter, ...args) {
        this.log(LogSeverity.ERROR, undefined, formatter, ...args);
    }
    fatal(formatter, ...args) {
        this.log(LogSeverity.FATAL, undefined, formatter, ...args);
    }
    constructor(loggerName, config) {
        this.name = loggerName;
        this.config = config;
    }
    log(logSeverity, extraData, formatter, ...args) {
        if (!this.isLogEnabled(logSeverity)) {
            return;
        }
        if (this.config.jsonLogging()) {
            console.log(stringify({
                level: logSeverity,
                time: new Date().toISOString(),
                className: this.name,
                source: this.generateLogSource(),
                message: Logger.jsonTransformArgs(formatter, ...args),
                request: trace_1.Trace.getRequestInfo(),
                extra: extraData || {},
                stack: Logger.errorStack(formatter, ...args),
            }));
            return;
        }
        console.log(`${exports.DisplaySeverityMap[logSeverity]}:`, this.name, util_1.default.format(formatter, ...Logger.transformArgs(...args)));
    }
    generateLogSource() {
        const { stack } = new Error();
        const logSource = stack.split('\n')
            // .find((line): boolean => !ignoreFolders.some((folder: string): boolean => line.includes(folder))
            //     && line.trim().startsWith('at '));
            .find((line) => !line.includes(currentFolder) && line.trim().startsWith('at '));
        if (!logSource) {
            return {};
        }
        if (logSource[logSource.length - 1] === ')') {
            const [caller, filePath] = logSource.split(' (');
            if (!filePath) {
                return {};
            }
            const filePathSplit = filePath.substring(0, filePath.length - 1).split('/');
            const [fileName, line, column] = filePathSplit.pop().split(':');
            if (!fileName || !line || !column) {
                return {};
            }
            const path = filePathSplit.join('/');
            return {
                caller: caller.split('at ')[1],
                fileName,
                path,
                line,
                column,
                github: this.generateGithubLink(`${path}/${fileName}`, line),
            };
        }
        const filePathSplit = logSource.split('at ')[1].split('/');
        const [fileName, line, column] = filePathSplit.pop().split(':');
        if (!fileName || !line || !column) {
            return {};
        }
        const path = filePathSplit.join('/');
        return {
            fileName,
            path,
            line,
            column,
            github: this.generateGithubLink(`${path}/${fileName}`, line),
        };
    }
    isLogEnabled(logSeverity) {
        if (!isNotMatchWithPatterns(this.config.logSeverityPattern[logSeverity].negative, this.name)) {
            return false;
        }
        if (isMatchWithPatterns(this.config.logSeverityPattern[logSeverity].positive, this.name)) {
            return true;
        }
        if (exports.LogLevel[logSeverity] < this.config.minLogLevelEnabled()) {
            return false;
        }
        if (!isNotMatchWithPatterns(this.config.logPattern.negative, this.name)) {
            return false;
        }
        return isMatchWithPatterns(this.config.logPattern.positive, this.name);
    }
    generateGithubLink(file, line) {
        if (!this.config.github) {
            return undefined;
        }
        const githubFilePath = file.split(this.config.github.basePath)[1];
        if (githubFilePath.includes('node_modules')) {
            return undefined;
        }
        return `https://github.com/${this.config.github.org}/${this.config.github.repo}/blob/${this.config.github.commitHash}${githubFilePath}#L${line}`;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map