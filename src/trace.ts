import { AsyncLocalStorage } from 'async_hooks';
import http from 'http';
import { v4 as uuid } from 'uuid';

declare interface SessionInfo {
    sessionId: string;
    [key: string]: string;
}

const asyncLocalStorage = new AsyncLocalStorage<SessionInfo>();

export class Trace {
  static requestHandler(callback?: (req: http.IncomingMessage) => Omit<SessionInfo, 'sessionId'>)
      : (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: any) => void) => void {
    return (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: any) => void) => {
      asyncLocalStorage.run({ ...callback(req), sessionId: uuid() }, () => next());
    };
  }

  static getSessionInfo(): SessionInfo {
    return asyncLocalStorage.getStore();
  }
}
