const fs = require('fs')
const R = require('ramda')
const H = require('highland')
const J = require('jsonpath')
const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    o: 'output',
    f: 'flatten'
  }
})

function jsonPathsFromArgv () {
  if (!argv.flatten) {
    return
  }

  const errorMessage = '--flatten argument must be JSON array of JSON path strings'

  try {
    const jsonPaths = JSON.parse(argv.flatten)

    if (!Array.isArray(jsonPaths)) {
      throw new Error(errorMessage)
    }

    return jsonPaths
  } catch (err) {
    throw new Error(errorMessage)
  }
}

function flatten (jsonPaths, object) {
  const values = jsonPaths.map((path) => J.query(object, path)[0])
  const data = R.zipObj(jsonPaths, values)
  return Object.assign({}, R.omit(['geometry', 'data'], object),
    data, {
    geometry: object.geometry
  })
}

function stringify (object) {
  if (typeof object !== 'string') {
    return JSON.stringify(object)
  }

  return object
}

 function run (name, userParams, mapFunc) {
  const params = Object.assign({}, userParams)

  if (process.stdin.isTTY && !argv._[0]) {
    return console.error(`Usage: ${name} [-f jsonPaths] [-o file] FILE\n` +
      `  -f, --flatten  JSON array of JSON paths, used to flatten nested data field\n` +
      `  -o, --output   Path to output file, if not given, ${name} uses stdout`)
  }

  const jsonPaths = jsonPathsFromArgv()

  const stream = ((argv._.length ? fs.createReadStream(argv._[0], 'utf8') : process.stdin))

  let transform = H.pipeline()

  if (mapFunc) {
    transform = H.pipeline(
      H.map(JSON.parse),
      H.map((object) => jsonPaths ? flatten (jsonPaths, object) : object),
      H.map((object) => mapFunc ? mapFunc(object) : object),
      H.map(stringify)
    )
  } else if (jsonPaths) {
    transform = H.pipeline(
      H.map(JSON.parse),
      H.map(H.curry(flatten, jsonPaths)),
      H.map(stringify)
    )
  }

  const json = H(stream)
    .split('\n')
    .compact()
    .pipe(transform)
    .compact()
    .intersperse(params.separator)
    .compact()

  H([
    params.open ? H([params.open]) : undefined,
    json,
    params.close ? H([params.close]) : undefined
  ]).compact()
    .sequence()
    .pipe(argv.output ? fs.createWriteStream(argv.output, 'utf8') : process.stdout)
}

module.exports = {
  run,
  jsonPathsFromArgv
}
