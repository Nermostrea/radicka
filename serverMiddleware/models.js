/* eslint-disable camelcase */
const axios = require('axios')
const consola = require('consola')

// const knex = require('knex')({
//   client: 'better-sqlite3',
//   connection: {
//     filename: process.env.DB_NAME
//   }
// })

const utils = require('./utils')

export class JunctionTracker {
  constructor (joining_stop, closer_stop, distant_stop, time_delta) {
    this.joining_stop = joining_stop
    this.closer_stop = closer_stop
    this.distant_stop = distant_stop
    this.min_time_delta = time_delta[0]
    this.max_time_delta = time_delta[1]
    this.state = null
  }

  getTimeDeltaInSeconds (date1, date2) {
    return (date1.getTime() - date2.getTime()) / 1000
  }

  async get_vehicle_positions () {
    try {
      const { data } = await axios.get(`${process.env.GOLEMIO_API_URL}/vehiclepositions`, {
        headers: { 'x-access-token': process.env.GOLEMIO_ACCESS_TOKEN }
      })
      return data
    } catch {
      return { features: [], type: 'FeatureCollection' }
    }
  }

  update_significant_event () {
    const tram1 = this.state.from_closer[0]
    const tram2 = this.state.from_distant[0]

    if (!tram1 || !tram2) {
      this.significant_event = null
    } else if (!this.is_collision(tram1, tram2)) {
      this.significant_event = null
    } else {
      this.significant_event = new utils.Event(tram1, tram2)
    }
  }

  get_trip_type (tram) {
    if (tram.last_stop === this.closer_stop && tram.next_stop === this.joining_stop && tram.state_position === 'on_track') {
      return 'closer_stop'
    } else if (tram.last_stop === this.distant_stop && tram.next_stop === this.joining_stop && tram.state_position === 'on_track') {
      return 'distant_stop'
    } else {
      return 'irrelevant'
    }
  }

  is_collision (closer_tram, distant_tram) {
    const diff = this.getTimeDeltaInSeconds(closer_tram.departure_time, distant_tram.departure_time)
    return this.min_time_delta < diff < this.max_time_delta
  }

  log (event) {
    consola.info(event)
  }

  // eslint-disable-next-line require-await
  async get_saved_delay () {
    // TODO add proper delay calculation
    return 0
  }

  async update () {
    try {
      this.state = await this.get_state_data()

      this.update_significant_event()
      // check there was a response from the API
      if (this.significant_event) {
        this.significant_event.evaluate(this.state)
        if (this.significant_event.real_outcome !== 'undecided') {
          this.log(this.significant_event)
        }
      }
    } catch (error) {
      consola.error(error)
    }
  }

  async get_state_data () {
    const positions = await this.get_vehicle_positions()
    const from_closer = this.get_incoming_from(this.closer_stop, positions)
    const from_distant = this.get_incoming_from(this.distant_stop, positions)
    const closer_shown_symbol = this.get_shown_symbol(this.closer_stop, from_closer, from_distant)
    const distant_shown_symbol = this.get_shown_symbol(this.distant_stop, from_closer, from_distant)
    const trams_at_joining_stop = this.get_trams_at_stop(this.joining_stop, positions)

    return {
      from_closer,
      from_distant,
      closer_shown_symbol,
      distant_shown_symbol,
      trams_at_joining_stop,
      positions
    }
  }

  get_state () {
    return this.state
  }

  get_shown_symbol (stop_id) {
    if (!this.significant_event) {
      return null
    }
    // FIXME remove magic numbers
    if (stop_id === this.closer_stop && utils.should_show_symbol(this.significant_event.closer_tram.departure_time, 30, 45)) {
      if (this.significant_event.desired_outcome === 'closer_first') {
        return ['green', this.significant_event.closer_tram.route_name]
      } else {
        return ['red', this.significant_event.distant_tram.route_name]
      }
    } else if (stop_id === this.distant_stop && utils.should_show_symbol(this.significant_event.distant_tram.departure_time, 45, 60)) {
      if (this.significant_event.desired_outcome === 'closer_first') {
        return ['red', this.significant_event.closer_tram.route_name]
      } else {
        return ['green', this.significant_event.distant_tram.route_name]
      }
    } else {
      consola.error('Invalid stop_id')
      return null
    }
  }

  get_incoming_from (stop_id, positions) {
    if (stop_id !== this.closer_stop && stop_id !== this.distant_stop) {
      consola.error('get_incoming_from - Invalid stop_id')
      return []
    }
    const incoming = []
    const filtered = positions.features.filter((trip_position) => {
      return trip_position.properties.last_position.last_stop.id === stop_id
    })
    for (const trip_position of filtered) {
      // FIXME inefficient - unnecessary creation of objects
      const tram = utils.Tram.from_trip_position(trip_position)
      const trip_type = this.get_trip_type(tram)
      if (trip_type === 'closer_stop' && stop_id === this.closer_stop) {
        incoming.push(tram)
      } else if (trip_type === 'distant_stop' && stop_id === this.distant_stop) {
        incoming.push(tram)
      }
    }
    return utils.sort_trams_by_dep_time(incoming)
  }

  get_trams_at_stop (stop_id, positions) {
    // FIXME inefficient - unnecessary creation of objects
    const filtered = positions.features.filter((trip_position) => {
      return trip_position.properties.last_position.last_stop.id === stop_id && trip_position.properties.last_position.state_position === 'at_stop'
    })
    const trams = filtered.map(utils.Tram.from_trip_position)
    return utils.sort_trams_by_dep_time(trams)
  }
}
