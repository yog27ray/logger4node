/// <reference types="node" />
import http from 'http';
declare interface RequestInfo {
    id: string;
    [key: string]: string;
}
export declare class Trace {
    static requestHandler(callback?: (req: http.IncomingMessage) => Omit<RequestInfo, 'id'>): (req: http.IncomingMessage, res: http.ServerResponse, next: (error?: any) => void) => void;
    static startNewRequest(callback?: () => unknown, track?: Omit<RequestInfo, 'id'>): void;
    static getRequestInfo(): RequestInfo;
}
export {};
