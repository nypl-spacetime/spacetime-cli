#!/usr/bin/env node

const io = require('./io')
const R = require('ramda')

const name = 'spacetime-to-geojson'
const params = {
  open: '{"type":"FeatureCollection","features":[',
  close: ']}\n',
  separator: ',\n'
}

function toFeature (object) {
  if (object.geometry) {
    return {
      type: 'Feature',
      properties: R.omit(['geometry'], object),
      geometry: object.geometry
    }
  }
}

io.run(name, params, toFeature)
