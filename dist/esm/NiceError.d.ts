export interface NEOptions {
    name?: string;
    chain?: string[];
    info?: {
        [key: string]: unknown;
    };
    cause?: Error | NiceError | null;
    stack?: string;
}
export declare class NiceError {
    name?: string;
    message: string;
    chain: string[];
    info: {
        [key: string]: unknown;
    };
    cause: Error | NiceError | null;
    stack: string;
    static execPath: string;
    constructor(msg?: string, opts?: NEOptions);
    fullMessage(): string;
    private _getCauseMessage;
    fullStack(): string;
    private _getFullStack;
    fullInfo(): Record<string, unknown>;
    private _getFullInfo;
    private _removeSelfFromStack;
    private _removeCWD;
}
export default NiceError;
