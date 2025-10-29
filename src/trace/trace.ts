import { AsyncLocalStorage } from 'async_hooks';
import http from 'http';
import { v4 as uuid } from 'uuid';

declare interface RequestInfo {
    [key: string]: string;
    id: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestInfo>();

export class Trace {
  static getRequestInfo(): RequestInfo {
    return asyncLocalStorage.getStore();
  }

  static requestHandler(callback?: (req: http.IncomingMessage) => Omit<RequestInfo, 'id'>)
      : (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: Error) => void) => void {
    return (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: Error) => void) => {
      Trace.startNewRequest(next, (callback ? callback(req) : undefined));
    };
  }

  static startNewRequest(callback?: () => unknown, track: Omit<RequestInfo, 'id'> = {}): void {
    asyncLocalStorage.run({ id: uuid(), ...track,  }, () => callback());
  }
}
