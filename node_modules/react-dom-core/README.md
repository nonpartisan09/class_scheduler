# react-dom-core

[![NPM](https://nodei.co/npm/react-dom-core.png)](https://nodei.co/npm/react-dom-core/)

[![NPM version](https://img.shields.io/npm/v/react-dom-core.svg)](https://www.npmjs.com/package/react-dom-core)

Copy of [react-dom@15](https://unpkg.com/react-dom@15/).

## Install

```sh
# with npm
$ npm install react-dom-core --save

# with yarn
$ yarn add react-dom-core
```

## Usage

The following files and directories are copied:

- dist
- lib
- index.js
- server.js
- test-utils.js

This means you can require with CommonJS:

```js
var HTMLDOMPropertyConfig = require('react-dom-core/lib/HTMLDOMPropertyConfig');
```

Or with ES Modules:

```js
import SVGDOMPropertyConfig from 'react-dom-core/lib/SVGDOMPropertyConfig';
```

## License

MIT. See [license](https://github.com/facebook/react/blob/15-stable/LICENSE) from original project.
