/**
 * NiceError.ts
 */

/**
 * 构造函数所需传入的对象
 */
 export interface NEOptions {
    name? : string,
    info? : { [key : string] : any },
    cause? : any | null,
    stack? : string
}

/**
 * NiceError 类
 */
export class NiceError {
    name? : string = 'NiceError'
    message : string = 'Empty'
    info : { [key : string] : any } = {}
    cause : any | null = null
    stack : string = (new Error).stack || ''

    constructor(msg? : string, opts? : NEOptions) {
        if (msg && msg !== '') this.message = msg
        if (opts && opts as NEOptions) {
            // 友好提示参数有误，但不影响执行
            let keys = Object.keys(opts)
            let badParams : string[] = []
            for (let key of keys) {
                if (['name','info','cause','stack'].indexOf(key) < 0) {
                    badParams.push(key)
                }
            }
            if (badParams.length > 0) {
                console.log('\x1b[33m%s\x1b[0m','Warning!!! You have provided bad parameter(s): [' + badParams.join(',') + '], it will be ignored, but we strongly suggest you to check your code again!')
            }
            if (opts.name) this.name = opts.name
            if (opts.cause) this.cause = opts.cause
            if (opts.info) this.info = opts.info
            // 错误栈信息
            if (opts.stack) this.stack = opts.stack
        }
        // 将默认错误信息替换为完整错误信息链条
        this.stack = this.stack.replace('Error', this.fullMessage())
        // 优化错误堆栈显示路径
        this.stack = this._removeSelfFromStack(this.stack)
        // 缩短代码文件路径为相对目录
        this.stack = this._removeCWD(this.stack)
    }

    /**
     * 返回实例的完整错误提示信息
     * @returns 错误信息字符串
     */
    public fullMessage() : string
    {
        return this._getCauseMessage(this)
    }
    private _getCauseMessage(err: any) : string
    {
        let result : string = ''
        // 如果是 NiceError 或者 Error 实例
        if (err instanceof NiceError || err instanceof Error) result = '[' + err.name + ']: ' + err.message
        // 否则就是第三方错误或者其它对象被 throw 出来了
        else {
            result = '[Throw]: type = ' + typeof err
            let str = JSON.stringify(err)
            // 对象较小的话就打印出来，否则忽略
            if (str.length <= 100) result = result + ', content = ' + str
        }
        // 如果有子错误则继续下潜
        if (err instanceof NiceError && err.cause) result += ' <= ' + this._getCauseMessage(err.cause)
        return result
    }

    /**
     * 返回完整的错误stack信息
     * @returns stack信息字符串
     */
    public fullStack() : string
    {
        // 递归获取
        let fstack = this._getFullStack(this,true)
        // 去除 NiceError 文件所在行
        fstack = this._removeSelfFromStack(fstack)
        // 缩短代码路径
        fstack = this._removeCWD(fstack)
        return fstack
    }
    private _getFullStack(err : any, isFirst? : boolean) : string
    {
        let result : string = ''
        let causedBy : string = ''
        if (isFirst !== true) causedBy = 'Caused by '
        // 如果是 NiceError 实例直接取属性
        if (err instanceof NiceError) result = causedBy + err.stack
        // 如果是 Error 实例则拼装一下
        else if (err instanceof Error && err.stack) result = causedBy + err.stack.replace(err.name,'[' + err.name + ']')
        // 其它类型错误
        else if (err.stack) result = causedBy + err.stack
        // 其它错误
        else {
            // 为对象添加 stack 属性
            err = { throw: err }
            if (typeof (Error as any).captureStackTrace === 'function') {
                (Error as any).captureStackTrace(err)
            }
            let str = JSON.stringify(err.throw)
            let desc = '[Throw]: type = ' + typeof err
            if (str.length <= 100) desc += ', content = ' + str
            let stackInfo = err.stack.replace('Error', desc)
            result = causedBy + stackInfo
        }
        if (err.cause) result += `\r\n` + this._getFullStack(err.cause)
        return result
    }

    /**
     * 获得完整的错误细节提示对象
     * @returns 完整错误细节对象
     */
    public fullInfo() : { [key:string]:string }
    {
        return this._getFullInfo(this)
    }
    private _getFullInfo(ne : NiceError) : { [key:string]:string }
    {
        // 递归获取子错误的信息然后合并
        let result : { [key:string]:string } = {}
        if (ne instanceof NiceError) {
            let keys = Object.keys(ne.info)
            for (let i=0; i<keys.length; i++) {
                let key = keys[i]
                result[key] = ne.info[key]
            }
        }
        // 如果在一个 NE 链条的不同层实例设置了同名 info，内层的会覆盖外层的
        if (ne.cause) {
            let subInfo = this._getFullInfo(ne.cause)
            let keys = Object.keys(subInfo)
            for (let i=0; i<keys.length; i++) {
                let key = keys[i]
                result[key] = subInfo[key]
            }
        }
        return result
    }

    /**
     * 从 stack 字符串中移除 NiceError.js 行
     * @param str stack 字符串
     * @returns 替换后的内容
     */
    private _removeSelfFromStack(str : string) : string
    {
        let regExp = /\s{1,}?at [ \S]*?NiceError[\S]*? \(\S*?\/NiceError.js:\d*:\d*\)[\n\r]{1,}/g
        return str.replace(regExp,`\r\n`).replace(/(\r\n){2,}/g,`\r\n`) // 注意要替换掉多个连续的 \r\n
    }

    /**
     * 移除当前运行的目录前缀（使得 stack 信息更容易读）
     * @param str 要处理的字符串
     * @returns 处理后的结果
     */
    private _removeCWD(str : string) : string
    {
        // 把目标字符串转成 RegExp 所需的字符串，这个转换是很玄妙的，请细心体会：）
        let regStr = Deno.cwd().replace(/\//g,`\\/`)
        let regExp : RegExp = new RegExp(regStr,'g')
        return str.replace(regExp,`.`)
    }
}