import { Logger } from './logger';

export class Logger4Node {
  private readonly _applicationName: string;

  constructor(applicationName: string) {
    this._applicationName = applicationName;
  }

  instance(name: string): Logger {
    return new Logger(`${this._applicationName}:${name}`);
  }
}
