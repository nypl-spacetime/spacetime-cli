#!/usr/bin/env node

const io = require('./io')
const json2csv = require('json2csv')


const name = 'spacetime-to-csv'
const separator = ';'

let jsonPaths
try {
  jsonPaths = io.jsonPathsFromArgv()
} catch (err) {
  jsonPaths = []
}

const columns = [
  'id',
  'name',
  'type',
  'validSince',
  'validUntil',
  ...jsonPaths,
  'geometry'
]

const csvHeader = json2csv({
  data: [],
  fields: columns,
  hasCSVColumnTitle: true
})

const params = {
  open: csvHeader + '\n'
}

function toLine (object) {
  const line = json2csv({
    data: [object],
    fields: columns,
    hasCSVColumnTitle: false
  })

  return line + '\n'
}

io.run(name, params, toLine)

