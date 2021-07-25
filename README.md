# Directory parser

## Introduction

> This module contains some intresting features for parse directory nodes from a root path!

## Code Samples

#### demo.js
```
const DirParser = require('./dir-parser');

const root = process.argv[2];
const dirParser = new DirParser(root);

(async function() {
	console.log(await dirParser.getNodes());
	console.log(await dirParser.getNodesPath());
	console.log(await dirParser.getNodesObj());
	console.log(await dirParser.getNodesJSON());
})().catch(error => {
	console.log(error);
});
```
> Sample:
```
npm demo ./node_modules
```





## Installation

> Clone this repository and type:
```
npm install
```