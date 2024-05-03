/// <reference types="node" />
import http from 'http';
declare interface SessionInfo {
    sessionId: string;
    [key: string]: string;
}
export declare class Trace {
    static requestHandler(callback?: (req: http.IncomingMessage) => Omit<SessionInfo, 'sessionId'>): (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: any) => void) => void;
    static getSessionInfo(): SessionInfo;
}
export {};
