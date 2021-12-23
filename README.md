# fsp.NiceError
An extension for TS/JS Error Object, brings you better development experience.

# Features:
- traceable, intuitional error chain
- support extra infomation
- zero dependency
- support both nodejs and deno runtime

# Import to your project

### For Node.js
Install it first:
~~~bash
 # pay attention to the package name 'fsp-nice-error'
npm install fsp-nice-error
 # or
yarn add fsp-nice-error
~~~

Then import it:
~~~js
// CommonJS
const { NiceError } = require('fsp-nice-error')
// ES Module or TypeScript, need bundlers(rollup/webpack/parcel...) support for current nodejs version
import { NiceError } from 'fsp-nice-error'
~~~

### For Deno

#### Option 1
Just copy `src/NiceError.ts` file to your project, and then import it:
~~~ts
import { NiceError } from "path/to/NiceError.ts"
~~~

#### Option 2
Directly import it from remote sources:
~~~ts
// from denopkg
import { NiceError } from "https://denopkg.com/FullStackPlayer/fsp.NiceError@master/mod.ts"
// from deno.land
import { NiceError } from "https://deno.land/x/fsp_nice_error/mod.ts"
~~~

# Usage

#### For better experience
Set static property `execPath` for NiceError will shorten the trace stack info.
~~~js
// nodejs
NiceError.execPath = process.cwd()
// deno
NiceError.execPath = Deno.cwd()
~~~

#### Handling inner error

~~~js
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
/**
output:
------------------------------
An inner NiceError was caught!
------------------------------
*/

console.log(ne2.fullMessage())
/**
output:
------------------------------
[AppError]: An inner NiceError was caught! <= [NiceError]: A normal error was caught! <= [Error]: This is a normal error
------------------------------
*/

console.log(ne2.fullStack())
/**
output:
------------------------------
[AppError]: An inner NiceError was caught! <= [NiceError]: A normal error was caught! <= [Error]: This is a normal error
    at Object.<anonymous> (./sample/nodeEnv.js:16:11)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
    at internal/main/run_main_module.js:17:47
Caused by [NiceError]: A normal error was caught! <= [Error]: This is a normal error
    at Object.<anonymous> (./sample/nodeEnv.js:7:11)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
    at internal/main/run_main_module.js:17:47
Caused by [Error]: This is a normal error
    at Object.<anonymous> (./sample/nodeEnv.js:4:11)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
    at internal/main/run_main_module.js:17:47
*/

console.log(ne2.fullInfo())
/**
output:
------------------------------
{
    foo: 'foo',
    bar: 'bar'
}
------------------------------
*/
~~~

#### Handling unexpected thown object as inner error

~~~js
let err = { foo: 'bar'}
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
    /**
    output:
    ------------------------------
    [NiceError]: An object was thrown <= [Throw]: type = object, content = {"foo":"bar"}
    ------------------------------
    */

    console.log(ne1.fullStack())
    /**
    output:
    ------------------------------
    [NiceError]: An object was thrown <= [Throw]: type = object, content = {"foo":"bar"}
        at Object.<anonymous> (./sample/nodeEnv.js:39:15)
        at Module._compile (internal/modules/cjs/loader.js:1063:30)
        at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
        at Module.load (internal/modules/cjs/loader.js:928:32)
        at Function.Module._load (internal/modules/cjs/loader.js:769:14)
        at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
        at internal/main/run_main_module.js:17:47
    Caused by [Throw]: type = object, content = {"foo":"bar"}
        at Object.<anonymous> (./sample/nodeEnv.js:46:21)
        at Module._compile (internal/modules/cjs/loader.js:1063:30)
        at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
        at Module.load (internal/modules/cjs/loader.js:928:32)
        at Function.Module._load (internal/modules/cjs/loader.js:769:14)
        at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
        at internal/main/run_main_module.js:17:47
    ------------------------------
    */
}
~~~

#### NiceError with chain property

~~~js
try {
    throw new NiceError('NiceError With Chain', {
        chain: ['root','folder']
    })
}
catch(ex) {
    console.log(ex.fullMessage())
    /**
    output:
    ------------------------------
    [NiceError@root/folder]: NiceError With Chain
    ------------------------------
    */
}
~~~

# **API**

### Class NiceError

- Property
    - name - String - error name
    - message - String - error message
    - chain - String[] - error chain array
    - info - Object - context infomation about the error
    - stack - String - stack trace of the error
- Method
    - fullMessage() - String - get all the messages of the error chain path 
    - fullStack() - String - get all the stack infomations of the error chain path
    - fullInfo() - Object - merge all the info objects in this error chain into one big info object


## Enjoy it :-)