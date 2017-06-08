#!/bin/bash
## please help with webpack build
webpack -p
mkdir -p dist
cp bundle.js dist/bundle.js
cp index.html dist/index.html