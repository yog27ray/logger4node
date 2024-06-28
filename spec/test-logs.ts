import fs from 'node:fs';
import { SinonSpy } from 'sinon';
import { Tail } from 'tail';
import { Logger, LogSeverity } from '../src/logger/logger';

export function wait(time: number = 100): Promise<void> {
  return new Promise((resolve: () => void) => {
    setTimeout(() => resolve(), time);
  });
}

export async function printLogsInDifferentLevel(logger: Logger): Promise<void> {
  logger.verbose('verbose log');
  logger.debug('debug log');
  logger.info('info log');
  logger.warn('warn log');
  logger.error('error log');
  await wait(200);
}

export async function printLogsWithExtraFields(logger: Logger): Promise<void> {
  logger.log(LogSeverity.ERROR, { extraField: 'extraValue' }, 'verbose log');
  await wait(100);
}

export async function printLogsInDifferentType(logger: Logger): Promise<void> {
  logger.error('this is ', 1, true, { key1: 1, value: 2 });
  await wait(100);
}

export async function printFatalLogsInDifferentType(logger: Logger): Promise<void> {
  logger.fatal('this is ', 1, true, { key1: 1, value: 2 });
  await wait(100);
}

export async function printLogWithMultipleEndCharacters(logger: Logger): Promise<void> {
  logger.error('this is line1\nline2\nline2', { var: 1, var2: 2 });
  await wait(100);
}

export async function printLogWithBackSlashCharacter(logger: Logger): Promise<void> {
  logger.error('this is line1 \\"', { var: 1, var2: 2 });
  await wait(100);
}

export async function printLogWithSpecialTabCharacter(logger: Logger): Promise<void> {
  logger.error('this is line1 \t');
  await wait(100);
}

export async function printLogSingleLine(logger: Logger): Promise<void> {
  logger.error('this is string');
  await wait();
}

export async function printLogWithNewLineAndSlashNCharacter(logger: Logger): Promise<void> {
  try {
    throw new class TestError extends Error {
      code: 400;

      type: 'ERROR_SERVER_NOT_START';

      constructor() {
        super();
        this.message = 'Received an error with invalid JSON from Parse: <html>\r\n<head><title>'
          + '503 Service Temporarily Unavailable</title></head>\r\n<body>\r\n<center><h1>503 Service'
          + ' Temporarily Unavailable</h1></center>\r\n<hr><center>nginx</center>\r\n</body>\r\n</html>';
      }
    }();
  } catch (error) {
    logger.error(error);
  }
  await wait(100);
}

const spyConsoleLog: Array<string> = [];

function updatePIDAndHostname(_each: Record<string, unknown>): void {
  const each = _each;
  each.pid = 1;
  each.hostname = 'hostname';
}

const loggerSpy = {
  log(_data: string): void {
    let data = _data;
    const json = JSON.parse(data) as Record<string, unknown>;
    json.time = spyConsoleLog.length;
    updatePIDAndHostname(json);
    data = JSON.stringify(json);
    console.log(JSON.stringify(json));
    spyConsoleLog.push(data);
  },
  reset(): void {
    spyConsoleLog.splice(0, spyConsoleLog.length);
  },
};

fs.writeFileSync('./spec/test.logs', '', 'utf-8');
new Tail('./spec/test.logs')
  .on('line', (data: string) => loggerSpy.log(data))
  .on('error', (error: Error) => console.log(error))
  .watch();

export function stringLogsToJSON(spy: SinonSpy): Array<Record<string, unknown>> {
  return new Array(spy.callCount).fill(0).map((zero, index): Record<string, unknown> => {
    const jsonLog = JSON.parse(spy.getCall(index).args.join(' ')) as Record<string, unknown>;
    jsonLog.time = index;
    updatePIDAndHostname(jsonLog);
    return jsonLog;
  });
}

export { loggerSpy };
