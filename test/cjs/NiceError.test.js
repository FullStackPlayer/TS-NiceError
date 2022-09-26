// deno-lint-ignore-file no-unreachable
const assert = require('assert')
const { NiceError } = require('../../dist/cjs/NiceError')

describe('NiceError',function(){
    it('An Empty NiceError', function(){
        const emptyNE = new NiceError()
        assert.equal(emptyNE.name,'NiceError')
        assert.equal(emptyNE.message,'Empty')
    })
    it('A NiceError With Chain Property', function(){
        const emptyNE = new NiceError('NiceError With Chain', {
            chain: ['root','folder']
        })
        assert.equal(emptyNE.name,'NiceError')
        assert.equal(emptyNE.fullMessage(),'[NiceError@root/folder]: NiceError With Chain')
    })
    it('A Nested NiceError', function(){
        const err = new Error('This is a normal error')
        const ne1 = new NiceError('A normal error was caught!',{
            name: 'NiceError',
            cause: err,
            info: {
                foo: 'foo'
            }
        })
        const ne2 = new NiceError('A inner NiceError was caught!',{
            name: 'AppError',
            cause: ne1
        })
        assert.equal(ne2.name,'AppError')
        assert.equal(ne2.message,'A inner NiceError was caught!')
        assert.equal(ne2.fullMessage(),'[AppError]: A inner NiceError was caught! <= [NiceError]: A normal error was caught! <= [Error]: This is a normal error')
        assert.equal(ne2.fullInfo().foo,'foo')
    })
    it('A Nested NiceError With Irregular Inner Throw', function() {
        const err = { foo: 'bar'}
        try {
            throw err
        }
        catch(err) {
            const ne1 = new NiceError('An object was thrown',{
                name: 'NiceError',
                cause: err
            })
            assert.equal(ne1.message,'An object was thrown')
            assert.equal(ne1.fullMessage(),'[NiceError]: An object was thrown <= [Throw]: type = object, content = {"foo":"bar"}')
        }    
    })
})
