#!/bin/bash

set -ex

npx rollup src/editor.js -f iife -o dist/cm6.bundle.js -p @rollup/plugin-node-resolve --output.name cm6