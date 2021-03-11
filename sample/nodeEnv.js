const { NiceError } = require('../dist/NiceError.js')

// a normal js Error
let err = new Error('This is a normal error')

// a NiceError which takes err as it's inner error
let ne1 = new NiceError('A normal error was caught!',{
    name: 'NiceError',
    cause: err,
    info: {
        foo: 'foo'
    }
})

// another NiceError which takes ne1 as it's inner error
let ne2 = new NiceError('An inner NiceError was caught!',{
    name: 'AppError',
    cause: ne1,
    info: {
        bar: 'bar'
    }
})

console.log(ne2.message)

console.log(ne2.fullMessage())

console.log(ne2.fullStack())

console.log(ne2.fullInfo())

err = { foo: 'bar'}
try {
    // just throw an object
    throw err
}
catch(err) {
    // a NiceError which takes the thrown object as inner err
    let ne1 = new NiceError('An object was thrown',{
        name: 'NiceError',
        cause: err
    })

    console.log(ne1.fullMessage())

    console.log(ne1.fullStack())

}