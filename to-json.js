#!/usr/bin/env node

const io = require('./io')

const name = 'spacetime-to-json'
const array = {
  open: '[',
  close: ']\n'
}

io(name, array)
