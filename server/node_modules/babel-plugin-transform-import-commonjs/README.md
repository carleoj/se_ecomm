# babel-plugin-transform-import-commonjs

Fork of https://github.com/kiurchv/babel-plugin-transform-system-import-commonjs that compiles `import` instead of `System.import`, now that the `import()` proposal has been accepted.

[Babel](https://babeljs.io/) plugin that transforms ES2015 import into CommonJS require.

https://github.com/tc39/proposal-dynamic-import

## How this works

This plugin transforms
```js
var myModule = "./path/to/myModule";

import(myModule).then(function (module) {
  console.log(module);
});
```
to
```js
var myModule = "./path/to/myModule";

new Promise(function(resolve) {
  resolve(require(myModule));
}.bind(this)).then(function (module) {
  console.log(module);
});
```

## Requirements

You need support for Promise, use polyfill if needed.

## Installation

```sh
$ npm install babel-plugin-transform-import-commonjs
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```js
{
  "plugins": ["transform-import-commonjs"]
}
```

### Via CLI

```sh
$ babel --plugins transform-import-commonjs script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-import-commonjs"]
});
```
