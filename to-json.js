#!/usr/bin/env node

const io = require('./io')

const name = 'spacetime-to-json'
const params = {
  open: '[',
  close: ']\n',
  separator: ',\n'
}

io.run(name, params)
