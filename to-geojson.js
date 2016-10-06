#!/usr/bin/env node

const io = require('./io')
const R = require('ramda')

const name = 'spacetime-to-json'
const geojson = {
  open: '{"type":"FeatureCollection","features":[',
  close: ']}\n'
}

const toFeature = (line) => {
  const obj = JSON.parse(line)

  if (obj.geometry) {
    return JSON.stringify({
      type: 'Feature',
      properties: R.omit(['geometry'], obj),
      geometry: obj.geometry
    })
  } else {
    return null
  }
}

io(name, geojson, toFeature)
