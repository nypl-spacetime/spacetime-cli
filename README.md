# spacetime-cli

Command line tools for [NYC Space/Time Directory](http://spacetime.nypl.org/) data.

## Installation

    npm install -g nypl-spacetime/spacetime-cli

## Usage

Convert Space/Time NDJSON to JSON:

    spacetime-to-json spacetime.ndjson

Convert Space/Time NDJSON to GeoJSON:

    spacetime-to-geojson spacetime.ndjson

Convert Space/Time NDJSON to CSV:

    spacetime-to-csv spacetime.ndjson

spacetime-cli also works if you pipe data into the tool:

    cat spacetime.ndjson | spacetime-to-json

## Flattening the `data` field

To make the resulting CSV and GeoJSON files easier to use, you can flatten the fields from the Object’s `data` property by supplying a list of [JSON Paths](http://goessner.net/articles/JsonPath/) with the `-f` argument:

For example:

    spacetime-to-csv -f  '["$.data.layerId","$.data.mapId"]' /path/to/dataset.objects.ndjson

If one Object from `/path/to/dataset.objects.ndjson` looks like this:

```json
{
  "id": "130148-1",
  "type": "st:Address",
  "validSince": 1857,
  "validUntil": 1857,
  "name": "41",
  "data": {
    "layerId": 859,
    "mapId": 7206
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
      -73.98505568504325,
      40.751221464984
    ]
  }
}
```

The resulting CSV file will look like this:

```csv
"id","name","type","validSince","validUntil","$.data.layerId","$.data.mapId","geometry"
"130148-1","41","st:Address",1857,1857,859,7206,"{""type"":""Point"",""coordinates"":[-73.98505568504325,40.751221464984]}"
```
