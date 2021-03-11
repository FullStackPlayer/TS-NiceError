import { assertEquals } from "https://deno.land/std@0.89.0/testing/asserts.ts"
import { NiceError } from '../src/NiceError_Deno.ts'

Deno.test('测试生成一个空的 NiceError', () => {
    let emptyNE = new NiceError()
    // console.log(emptyNE.stack)
    assertEquals(emptyNE.name,'NiceError')
    assertEquals(emptyNE.message,'Empty')
});

Deno.test('测试多层嵌套 NiceError', () => {
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
    assertEquals(ne2.name,'AppError')
    assertEquals(ne2.message,'A inner NiceError was caught!')
    assertEquals(ne2.fullMessage(),'[AppError]: A inner NiceError was caught! <= [NiceError]: A normal error was caught! <= [Error]: This is a normal error')
    assertEquals(ne2.fullInfo().foo,'foo')
});

Deno.test('测试最内层非 Error 原型链的多层嵌套 NiceError', () => {
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
        assertEquals(ne1.message,'An object was thrown')
        assertEquals(ne1.fullMessage(),'[NiceError]: An object was thrown <= [Throw]: type = object, content = {"foo":"bar"}')
    }
});
