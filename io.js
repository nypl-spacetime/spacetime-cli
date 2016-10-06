#!/usr/bin/env node

const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))
const H = require('highland')

module.exports = (name, openClose, mapFunc) => {
  if (process.stdin.isTTY && !argv._[0]) {
    return console.error(`Usage: ${name} [-o file] FILE\n` +
      `-o    output file. if not given, ${name} uses stdout`)
  }

  var stream = ((argv._.length ? fs.createReadStream(argv._[0], 'utf8') : process.stdin))

  var json = H(stream)
    .split('\n')
    .compact()
    .map((line) => mapFunc ? mapFunc(line) : line)
    .compact()
    .intersperse(',')

  H([
    H([openClose.open]),
    json,
    H([openClose.close])
  ]).sequence()
    .pipe(argv.o ? fs.createWriteStream(argv.o, 'utf8') : process.stdout)
}
