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

To make the resulting JSON, GeoJSON and CSV files easier to use, you can _flatten_ the fields from the Object’s nested `data` property by supplying a list of [JSON Paths](http://goessner.net/articles/JsonPath/) with the `-f/--flatten` argument.

For example:

    spacetime-to-geojson -f '["$.data.mapId", "$.data.address.street", "$.data.address.number"]' /path/to/dataset.objects.ndjson

Or:

    spacetime-to-csv -f '["$.data.mapId", "$.data.address.street", "$.data.address.number"]' /path/to/dataset.objects.ndjson

If one Object from `/path/to/dataset.objects.ndjson` looks like this:

```json
{
  "id": "130148-1",
  "type": "st:Address",
  "validSince": 1857,
  "validUntil": 1857,
  "name": "41 West 37th Street",
  "data": {
    "mapId": 7206,
    "address": {
      "street": "West 37th Street",
      "number": "41"
    }
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
      -73.9850556,
      40.7512214
    ]
  }
}
```

The resulting flat GeoJSON will look like this:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "130148-1",
        "type": "st:Address",
        "validSince": 1857,
        "validUntil": 1857,
        "name": "41 West 37th Street",
        "$.data.mapId": 7206,
        "$.data.address.street": "West 37th Street",
        "$.data.address.number": "41"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -73.9850556,
          40.7512214
        ]
      }
    }
  ]
}
```

And the resulting CSV file will look like this, respectively:

```csv
"id","name","type","validSince","validUntil","$.data.mapId","$.data.address.street","$.data.address.number","geometry"
"130148-1","41 West 37th Street","st:Address",1857,1857,7206,"West 37th Street","41","{""type"":""Point"",""coordinates"":[-73.9850556,40.7512214]}"
```
