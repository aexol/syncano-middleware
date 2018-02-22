# Syncano middleware

## About

Simple library easing writing of reusable middlewares for socket.

## Installation

```sh
$ npm install https://github.com/aexol/syncano-middleware.git
```

## Usage

socket.yml
```yaml
name: example
description: Description of example
version: 0.0.1
runtime: nodejs_v8
endpoints:
  file: example.js
  response:
    success:
      mimetype: application/json
      exit_code: 200
```

src/example.js
```javascript
import serve, {response} from 'syncano-middleware';

async function run(ctx, syncano) {
    return response.success({message: 'Hello world!'})
}

export default ctx => serve(ctx, run)
```

### Writing new middleware

socket.yml
```yaml
name: example
description: Description of example
version: 0.0.1
runtime: nodejs_v8
endpoints:
  file: example.js
  response:
    success:
      mimetype: application/json
      exit_code: 200
    forbidden:
      mimetype: application/json
      exit_code: 403
```

src/utils.js
```javascript
export async function loggedIn(fn) {
    return (ctx, syncano) => {
        if(!ctx.meta.user) {
            return response.forbidden({message: 'You must be logged in to perform this action.'})
        }
        return fn(ctx, syncano)
    }
}
```

src/example.js
```javascript
import serve, {response} from 'syncano-middleware';
import {loggedIn} from './utils'

async function run(ctx, syncano) {
    return response.success({message: 'Hello world!'})
}

export default ctx => serve(ctx, loggedIn(run))
```

### cleanExit middleware

This library comes with built-in cleanExit middleware which handles exceptions raised by the socket script.

#### Example

socket.yml
```yaml
name: example
description: Description of example
version: 0.0.1
runtime: nodejs_v8
endpoints:
  file: example.js
  response:
    success:
      mimetype: application/json
      exit_code: 200
    serverError:
      mimetype: application/json
      exit_code: 500
```

src/example.js
```javascript
import serve, {response, cleanExit} from 'syncano-middleware';

async function run(ctx, syncano) {
    return response.success({message: 'Hello world!'})
}

export default ctx => serve(ctx, cleanExit(run))
```