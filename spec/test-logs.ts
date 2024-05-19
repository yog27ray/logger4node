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
