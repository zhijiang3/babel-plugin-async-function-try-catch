# babel-plugin-async-function-try-catch

> add try catch code blocks to async functions

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

> handle uncaught errors with handleError

```js
async function foo() {
  try {
    await bar();
  } catch (error) {
    handleError(error);
  }
}
```

### Installation

npm: 

```sh
npm install --save-dev babel-plugin-async-function-try-catch
```

or yarn: 

```sh
yarn add -D babel-plugin-async-function-try-catch
```

### Usage

#### With a configuration file

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

### Via CLI

```sh
babel --plugins babel-plugin-async-function-try-catch script.js
```

### Via Node API

```js
require("@babel/core").transform("code", {
  plugins: ["babel-plugin-async-function-try-catch"]
});
```
