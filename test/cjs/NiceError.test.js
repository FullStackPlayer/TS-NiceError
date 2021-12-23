const { NiceError } = require('../../dist/cjs/NiceError')

test('An Empty NiceError', () => {
    let emptyNE = new NiceError()
    expect(emptyNE.name).toEqual('NiceError')
    expect(emptyNE.message).toEqual('Empty')
});

test('A NiceError With Chain Property', () => {
    let emptyNE = new NiceError('NiceError With Chain', {
        chain: ['root','folder']
    })
    expect(emptyNE.name).toEqual('NiceError')
    expect(emptyNE.fullMessage()).toEqual('[NiceError@root/folder]: NiceError With Chain')
});

test('A Nested NiceError', () => {
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
    expect(ne2.name).toEqual('AppError')
    expect(ne2.message).toEqual('A inner NiceError was caught!')
    expect(ne2.fullMessage()).toEqual('[AppError]: A inner NiceError was caught! <= [NiceError]: A normal error was caught! <= [Error]: This is a normal error')
    expect(ne2.fullInfo().foo).toEqual('foo')
});

test('A Nested NiceError With Irregular Inner Throw', () => {
    let err = { foo: 'bar'}
    try {
        throw err
    }
    catch(err) {
        let ne1 = new NiceError('An object was thrown',{
            name: 'NiceError',
            cause: err
        })
        expect(ne1.message).toEqual('An object was thrown')
        expect(ne1.fullMessage()).toEqual('[NiceError]: An object was thrown <= [Throw]: type = object, content = {"foo":"bar"}')
    }
});
