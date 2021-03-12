const {NiceError} = require('../dist/cjs/NiceError')

test('测试生成一个空的 NiceError', () => {
    let emptyNE = new NiceError()
    // console.log(emptyNE.stack)
    expect(emptyNE.name).toEqual('NiceError')
    expect(emptyNE.message).toEqual('Empty')
});

test('测试多层嵌套 NiceError', () => {
    let err = new Error('This is a normal error')
    let ne1 = new NiceError('A normal error was caught!',{
        name: 'NiceError',
        cause: err,
        info: {
            foo: 'foo'
        }
    })
    let ne2 = new NiceError('A inner NiceError was caught!',{
        name: 'AppError',
        cause: ne1
    })
    // console.log(ne2.message)
    // console.log(ne2.fullMessage())
    // console.log(ne2.stack)
    // console.log(ne2.fullStack())
    expect(ne2.name).toEqual('AppError')
    expect(ne2.message).toEqual('A inner NiceError was caught!')
    expect(ne2.fullMessage()).toEqual('[AppError]: A inner NiceError was caught! <= [NiceError]: A normal error was caught! <= [Error]: This is a normal error')
    expect(ne2.fullInfo().foo).toEqual('foo')
});

test('测试最内层非 Error 原型链的多层嵌套 NiceError', () => {
    let err = { foo: 'bar'}
    try {
        throw err
    }
    catch(err) {
        let ne1 = new NiceError('An object was thrown',{
            name: 'NiceError',
            cause: err
        })
        // console.log(ne1.message)
        // console.log(ne1.fullMessage())
        // console.log(ne1.stack)
        // console.log(ne1.fullStack())
        expect(ne1.message).toEqual('An object was thrown')
        expect(ne1.fullMessage()).toEqual('[NiceError]: An object was thrown <= [Throw]: type = object, content = {"foo":"bar"}')
    }
});
