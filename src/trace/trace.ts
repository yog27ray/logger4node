import { AsyncLocalStorage } from 'async_hooks';
import http from 'http';
import { v4 as uuid } from 'uuid';

declare interface RequestInfo {
    id: string;
    [key: string]: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestInfo>();

export class Trace {
  static requestHandler(callback?: (req: http.IncomingMessage) => Omit<RequestInfo, 'id'>)
      : (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: any) => void) => void {
    return (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: any) => void) => {
      Trace.startNewRequest(next, (callback ? callback(req) : undefined));
    };
  }

  static startNewRequest(callback?: () => unknown, track: Omit<RequestInfo, 'id'> = {}): void {
    asyncLocalStorage.run({ id: uuid(), ...track,  }, () => callback());
  }

  static getRequestInfo(): RequestInfo {
    return asyncLocalStorage.getStore();
  }
}
