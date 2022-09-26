"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NiceError = void 0;
var NiceError = (function () {
    function NiceError(msg, opts) {
        this.name = 'NiceError';
        this.message = 'Empty';
        this.chain = [];
        this.info = {};
        this.cause = null;
        this.stack = (new Error).stack || '';
        if (msg && msg !== '')
            this.message = msg;
        if (opts && opts) {
            var keys = Object.keys(opts);
            var badParams = [];
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (Object.keys(this).indexOf(key) < 0) {
                    badParams.push(key);
                }
            }
            if (badParams.length > 0) {
                console.log('\x1b[33m%s\x1b[0m', 'Warning!!! You have provided bad parameter(s): [' + badParams.join(',') + '], it will be ignored, but we strongly suggest you to check your code again!');
            }
            if (opts.name)
                this.name = opts.name;
            if (opts.chain)
                this.chain = opts.chain;
            if (opts.cause)
                this.cause = opts.cause;
            if (opts.info)
                this.info = opts.info;
            if (opts.stack)
                this.stack = opts.stack;
        }
        this.stack = this.stack.replace('Error', this.fullMessage());
        this.stack = this._removeSelfFromStack(this.stack);
        this.stack = this._removeCWD(this.stack);
    }
    NiceError.prototype.fullMessage = function () {
        return this._getCauseMessage(this);
    };
    NiceError.prototype._getCauseMessage = function (err) {
        var result = '';
        if (err instanceof Error)
            result = "[" + err.name + "]: " + err.message;
        else if (err instanceof NiceError) {
            result = "[" + err.name + (err.chain.length > 0 ? '@' + err.chain.join('/') : '') + "]: " + err.message;
            if (err.cause)
                result += ' <= ' + this._getCauseMessage(err.cause);
        }
        else {
            result = '[Throw]: type = ' + typeof err;
            var str = JSON.stringify(err);
            if (str.length <= 100)
                result = result + ', content = ' + str;
            else
                result = result + ', content = ' + str.substring(0, 99) + '...';
        }
        return result;
    };
    NiceError.prototype.fullStack = function () {
        var fstack = this._getFullStack(this, true);
        fstack = this._removeSelfFromStack(fstack);
        fstack = this._removeCWD(fstack);
        return fstack;
    };
    NiceError.prototype._getFullStack = function (err, isFirst) {
        var result = '';
        var causedBy = '';
        if (isFirst !== true)
            causedBy = 'Caused by ';
        if (err instanceof NiceError) {
            result = causedBy + err.stack;
            if (err.cause)
                result += "\r\n" + this._getFullStack(err.cause);
        }
        else if (err instanceof Error && err.stack) {
            result = causedBy + err.stack.replace(err.name, '[' + err.name + ']');
        }
        return result;
    };
    NiceError.prototype.fullInfo = function () {
        return this._getFullInfo(this);
    };
    NiceError.prototype._getFullInfo = function (ne) {
        var result = {};
        if (ne instanceof NiceError) {
            var keys = Object.keys(ne.info);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                result[key] = ne.info[key];
            }
            if (ne.cause && ne.cause instanceof NiceError) {
                var subInfo = this._getFullInfo(ne.cause);
                var keys_2 = Object.keys(subInfo);
                for (var i = 0; i < keys_2.length; i++) {
                    var key = keys_2[i];
                    result[key] = subInfo[key];
                }
            }
        }
        return result;
    };
    NiceError.prototype._removeSelfFromStack = function (str) {
        var jsRegExp = /\s{1,}?at [ \S]*?NiceError[\S]*? \(\S*?\/NiceError.js:\d*:\d*\)[\n\r]{1,}/g;
        var tsRegExp = /\s{1,}?at [ \S]*?NiceError[\S]*? \(\S*?\/NiceError.ts:\d*:\d*\)[\n\r]{1,}/g;
        return str.replace(jsRegExp, "\r\n").replace(tsRegExp, "\r\n").replace(/(\r\n){2,}/g, "\r\n").replace(/file:\/\//g, "");
    };
    NiceError.prototype._removeCWD = function (str) {
        if (NiceError.execPath !== '') {
            var regStr = NiceError.execPath.replace(/\//g, "\\/");
            var regExp = new RegExp(regStr, 'g');
            return str.replace(regExp, ".");
        }
        return str;
    };
    NiceError.execPath = '';
    return NiceError;
}());
exports.NiceError = NiceError;
exports.default = NiceError;
