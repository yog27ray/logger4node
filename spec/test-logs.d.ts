import { SinonSpy } from 'sinon';
import { Logger } from '../src/logger/logger';
export declare function wait(time?: number): Promise<void>;
export declare function printLogsInDifferentLevel(logger: Logger): Promise<void>;
export declare function printLogsWithExtraFields(logger: Logger): Promise<void>;
export declare function printLogsInDifferentType(logger: Logger): Promise<void>;
export declare function printFatalLogsInDifferentType(logger: Logger): Promise<void>;
export declare function printLogWithMultipleEndCharacters(logger: Logger): Promise<void>;
export declare function printLogWithBackSlashCharacter(logger: Logger): Promise<void>;
export declare function printLogWithSpecialTabCharacter(logger: Logger): Promise<void>;
export declare function printLogSingleLine(logger: Logger): Promise<void>;
export declare function printLogWithNewLineAndSlashNCharacter(logger: Logger): Promise<void>;
declare const loggerSpy: {
    log(_data: string): void;
    reset(): void;
};
export declare function stringLogsToJSON(spy: SinonSpy): Array<Record<string, unknown>>;
export { loggerSpy };
