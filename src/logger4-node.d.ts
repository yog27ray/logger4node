import { Logger } from './logger';
export declare class Logger4Node {
    private readonly _applicationName;
    constructor(applicationName: string);
    instance(name: string): Logger;
}
