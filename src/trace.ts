import { v4 as uuid } from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';
import http from 'http';

declare type SessionInfo = {
    sessionId: string;
    [key: string]: string;
}

const asyncLocalStorage = new AsyncLocalStorage<SessionInfo>();

export class Trace {
  static requestHandler(callback?: () => Omit<SessionInfo, 'sessionId'>)
      : (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: any) => void) => void {
    return (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: any) => void) => {
      asyncLocalStorage.run({ ...callback(), sessionId: uuid() }, () => next());
    };
  }

  static getSessionInfo(): SessionInfo {
    return asyncLocalStorage.getStore();
  }
}
