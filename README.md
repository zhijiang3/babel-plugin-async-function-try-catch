# babel-plugin-async-function-try-catch

Add try catch code blocks to async functions

![npm](https://img.shields.io/npm/v/babel-plugin-async-function-try-catch?style=flat-square)
![license badge](https://img.shields.io/github/license/zhijiang3/babel-plugin-async-function-try-catch?style=flat-square)

## Example

**In**

```js
async function foo(){
  await bar();
}
```

**Out**

```js
async function foo() {
  try {
    await bar();
  } catch (error) {}
}
```

**Out with options**

Handle uncaught errors with handleError

```js
import { handleError } from "/src/utils/handleError";

async function foo() {
  try {
    await bar();
  } catch (error) {
    handleError(error);
  }
}
```

## Install

npm: 

```sh
npm install --save-dev babel-plugin-async-function-try-catch
```

yarn: 

```sh
yarn add -D babel-plugin-async-function-try-catch
```

## Usage

**With a configuration file**

Without options:

```json
{
  "plugins": [
    "babel-plugin-async-function-try-catch"
  ]
}
```

With options: 

```json
{
  "plugins": [
    ["babel-plugin-async-function-try-catch", {
      "injectImport": {
        "specifier": "handleError",
        "source": "/src/utils/handleError.js"
      }
    }]
  ]
}
```

**With a CLI**

```sh
babel --plugins babel-plugin-async-function-try-catch script.js
```

**With a Node API**

```js
require("@babel/core").transform("code", {
  plugins: ["babel-plugin-async-function-try-catch"]
});
```

### Options

```ts
interface Options {
  // inject handler function
  injectImport: {
    // identifier of the handler function
    specifier: string;
    // source path of the handler function
    source: string;
    // compare sourcePath and tragetPath, if true,
    // the handler function will be inject by sourcePath
    checkSourceEqual(sourcePath, targetPath): boolean;
  }
}
```

## License

[MIT](LICENSE)
