/**
 * NiceError.ts
 */
/**
 * 构造函数所需传入的对象
 */
export interface NEOptions {
    name?: string;
    info?: {
        [key: string]: any;
    };
    cause?: any | null;
    stack?: string;
}
/**
 * NiceError 类
 */
export declare class NiceError {
    name?: string;
    message: string;
    info: {
        [key: string]: any;
    };
    cause: any | null;
    stack: string;
    constructor(msg?: string, opts?: NEOptions);
    /**
     * 返回实例的完整错误提示信息
     * @returns 错误信息字符串
     */
    fullMessage(): string;
    private _getCauseMessage;
    /**
     * 返回完整的错误stack信息
     * @returns stack信息字符串
     */
    fullStack(): string;
    private _getFullStack;
    /**
     * 获得完整的错误细节提示对象
     * @returns 完整错误细节对象
     */
    fullInfo(): {
        [key: string]: string;
    };
    private _getFullInfo;
    /**
     * 从 stack 字符串中移除 NiceError.js 行
     * @param str stack 字符串
     * @returns 替换后的内容
     */
    private _removeSelfFromStack;
    /**
     * 移除当前运行的目录前缀（使得 stack 信息更容易读）
     * @param str 要处理的字符串
     * @returns 处理后的结果
     */
    private _removeCWD;
}
