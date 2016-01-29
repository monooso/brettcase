# Brettcase #

[![Build Status](https://travis-ci.org/monooso/brettcase.svg?branch=master)](https://travis-ci.org/monooso/brettcase)

A node.js helper library for accessing Brett Terpstra's [Titlecase API][api]. Just a bit of fun.

[api]: http://brettterpstra.com/titlecase/test

## Getting Started ##
Brettcase is available as an npm package. Install the latest version with:

```
npm install brettcase
```

## Usage ##
Brettcase exposes a single function, which converts a given string to title case using Brett Terpstra's [Titlecase API][api].

The Brettcase function returns a promise. Here's an example of how to use it.

```js
var brettcase = require('brettcase');
brettcase('of mice and men').then(console.log);  // Logs out "Of Mice and Men"
```
