/* eslint-disable camelcase */
// const { importGtfs, openDb, getStoptimes } = require('gtfs')
import { parse } from 'csv-parse'
const fs = require('fs')
// const consola = require('consola')

// const GTFS_CONFIG = {
//   sqlitePath: './gtfs.sqlite',
//   agencies: [
//     { url: 'http://data.pid.cz/PID_GTFS.zip' }
//   ]
// }

// async function load_gtfs () {
//   const config = GTFS_CONFIG
//   importGtfs(config)
//     .then(() => {
//       consola.info('GTFS Import Successful')
//     })
//     .catch((err) => {
//       consola.error(err)
//     })
// }

function get_millis_from_time_string (time_str) {
  const split = time_str.split(':')
  const hours = split[0]
  const minutes = split[1]
  const seconds = split[2]
  return 3600 * 1000 * hours + 60 * 1000 * minutes + 1000 * seconds
}

export class TripUtils {
  constructor (stop_times_filename) {
    const data = fs.readFileSync(stop_times_filename, 'utf8')
    const trips = {}
    // Initialize the parser

    const records = parse(data, {
      columns: true,
      skip_empty_lines: true
    })

    for (const record_id in records) {
      const record = records[record_id]
      const trip_id = record.trip_id
      if (trips[trip_id]) {
        trips[trip_id].push(record)
      } else {
        trips[trip_id] = [record]
      }
    }

    for (const trip_id in trips) {
      // sort the trips by ascending sequence id
      trips[trip_id].sort((a, b) => a.stop_sequence - b.stop_sequence)
    }
    this.trips = trips
  }

  get_common_stops_after (stop_id, trip_id1, trip_id2, dep_date) {
    const tram1_stoptimes = this.trips[trip_id1]
    const tram2_stoptimes = this.trips[trip_id2]

    const tram1_joining_stop_index = tram1_stoptimes.findIndex((stop_time) => {
      return stop_time.stop_id === stop_id
    })

    const tram2_joining_stop_index = tram2_stoptimes.findIndex((stop_time) => {
      return stop_time.stop_id === stop_id
    })

    const result = []
    let i = 0
    while (true) {
      const stop_time1 = tram1_stoptimes[tram1_joining_stop_index + i]
      const stop_time2 = tram2_stoptimes[tram2_joining_stop_index + i]
      if (stop_time1.stop_id === stop_time2.stop_id) {
        // FIXME look out for overnight shenanigans
        const millis1 = get_millis_from_time_string(stop_time1.departure_time)
        const millis2 = get_millis_from_time_string(stop_time2.departure_time)
        const dep_time1 = new Date(dep_date.getTime() + millis1)
        const dep_time2 = new Date(dep_date.getTime() + millis2)
        const result_object = {
          stop_id: stop_time1.stop_id,
          dep_time1,
          dep_time2
        }
        result.push(result_object)
        i += 1
      } else {
        break
      }
    }
    return result
  }
}
