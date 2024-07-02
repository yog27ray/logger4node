"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerSpy = void 0;
exports.wait = wait;
exports.printLogsInDifferentLevel = printLogsInDifferentLevel;
exports.printLogsWithExtraFields = printLogsWithExtraFields;
exports.printLogsInDifferentType = printLogsInDifferentType;
exports.printFatalLogsInDifferentType = printFatalLogsInDifferentType;
exports.printLogWithMultipleEndCharacters = printLogWithMultipleEndCharacters;
exports.printLogWithBackSlashCharacter = printLogWithBackSlashCharacter;
exports.printLogWithSpecialTabCharacter = printLogWithSpecialTabCharacter;
exports.printLogSingleLine = printLogSingleLine;
exports.printLogWithNewLineAndSlashNCharacter = printLogWithNewLineAndSlashNCharacter;
exports.stringLogsToJSON = stringLogsToJSON;
const node_fs_1 = __importDefault(require("node:fs"));
const tail_1 = require("tail");
const logger_1 = require("../src/logger/logger");
function wait(time = 100) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
    });
}
async function printLogsInDifferentLevel(logger) {
    logger.verbose('verbose log');
    logger.debug('debug log');
    logger.info('info log');
    logger.warn('warn log');
    logger.error('error log');
    await wait(200);
}
async function printLogsWithExtraFields(logger) {
    logger.log(logger_1.LogSeverity.ERROR, { extraField: 'extraValue' }, 'verbose log');
    await wait(100);
}
async function printLogsInDifferentType(logger) {
    logger.error('this is ', 1, true, { key1: 1, value: 2 });
    await wait(100);
}
async function printFatalLogsInDifferentType(logger) {
    logger.fatal('this is ', 1, true, { key1: 1, value: 2 });
    await wait(100);
}
async function printLogWithMultipleEndCharacters(logger) {
    logger.error('this is line1\nline2\nline2', { var: 1, var2: 2 });
    await wait(100);
}
async function printLogWithBackSlashCharacter(logger) {
    logger.error('this is line1 \\"', { var: 1, var2: 2 });
    await wait(100);
}
async function printLogWithSpecialTabCharacter(logger) {
    logger.error('this is line1 \t');
    await wait(100);
}
async function printLogSingleLine(logger) {
    logger.error('this is string');
    await wait();
}
async function printLogWithNewLineAndSlashNCharacter(logger) {
    try {
        throw new class TestError extends Error {
            constructor() {
                super();
                this.message = 'Received an error with invalid JSON from Parse: <html>\r\n<head><title>'
                    + '503 Service Temporarily Unavailable</title></head>\r\n<body>\r\n<center><h1>503 Service'
                    + ' Temporarily Unavailable</h1></center>\r\n<hr><center>nginx</center>\r\n</body>\r\n</html>';
            }
        }();
    }
    catch (error) {
        logger.error(error);
    }
    await wait(100);
}
const spyConsoleLog = [];
const loggerSpy = {
    log(_data) {
        let data = _data;
        const json = JSON.parse(data);
        json.time = spyConsoleLog.length;
        data = JSON.stringify(json);
        console.log(JSON.stringify(json));
        spyConsoleLog.push(data);
    },
    reset() {
        spyConsoleLog.splice(0, spyConsoleLog.length);
    },
};
exports.loggerSpy = loggerSpy;
node_fs_1.default.writeFileSync('./spec/test.logs', '', 'utf-8');
new tail_1.Tail('./spec/test.logs')
    .on('line', (data) => loggerSpy.log(data))
    .on('error', (error) => console.log(error))
    .watch();
function stringLogsToJSON(spy) {
    return new Array(spy.callCount).fill(0).map((zero, index) => {
        const jsonLog = JSON.parse(spy.getCall(index).args.join(' '));
        jsonLog.time = index;
        return jsonLog;
    });
}
//# sourceMappingURL=test-logs.js.map