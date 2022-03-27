/* eslint-disable camelcase */
// const consola = require('consola')
// const gtfs_utils = require('./gtfs_utils')

export class Event {
  constructor (closer_tram, distant_tram) {
    this.closer_tram = closer_tram
    this.distant_tram = distant_tram
    this.desired_outcome = get_desired_outcome(closer_tram, distant_tram)
    this.real_outcome = 'undecided'
    this.induced_delay = 0
  }

  // assumes that trams_at_joining_stop are sorted by time
  evaluate (trams_at_joining_stop) {
    const index_of_closer = get_tram_index(this.closer_tram, trams_at_joining_stop.from_closer) // FIXME this is WIP and doesn't work yet
    const index_of_distant = get_tram_index(this.distant_tram, trams_at_joining_stop.from_distant)
    if (index_of_closer === -1 && index_of_distant === -1) {
      // neither of the trams has yet arrived
      this.real_outcome = 'undecided'
    } else if (index_of_distant === -1) {
      // the closer tram arrived first
      this.real_outcome = 'closer_first'
    } else if (index_of_closer === -1) {
      // the distant tram arrived first
      this.real_outcome = 'distant_first'
    } else if (index_of_closer < index_of_distant) {
      // both are at joining stop, closer arrived first
      this.real_outcome = 'closer_first'
    } else {
      // both are at joining stop, distant arrived first
      this.real_outcome = 'distant_first'
    }
    this.induced_delay = get_induced_delay(this.closer_tram, this.distant_tram, this.desired_outcome, this.real_outcome)
  }
}

/* eslint-disable camelcase */
export class Tram {
  constructor (trip_id, route_name, last_stop, next_stop, departure_time, next_stop_scheduled_arrival, state_position) {
    this.trip_id = trip_id
    this.last_stop = last_stop
    this.next_stop = next_stop
    this.next_stop_scheduled_arrival = next_stop_scheduled_arrival
    this.departure_time = departure_time
    this.state_position = state_position
    this.route_name = route_name
  }

  static from_trip_position (trip_position) {
    const trip_id = trip_position.properties.trip.gtfs.trip_id
    const last_stop = trip_position.properties.last_position.last_stop.id
    const next_stop = trip_position.properties.last_position.next_stop.id
    const next_stop_scheduled_arrival = new Date(trip_position.properties.last_position.next_stop.arrival_time)
    const departure_time = trip_position.properties.last_position.origin_timestamp
    const departure_datetime = new Date(departure_time)
    const state_position = trip_position.properties.last_position.state_position
    const route_name = trip_position.properties.trip.gtfs.route_short_name
    return new Tram(trip_id, route_name, last_stop, next_stop, departure_datetime, next_stop_scheduled_arrival, state_position)
  }
}

export function get_desired_outcome (closer_tram, distant_tram) {
  if (closer_tram.next_stop_scheduled_arrival.getTime() < distant_tram.next_stop_scheduled_arrival.getTime()) {
    return 'closer_first'
  } else {
    return 'distant_first'
  }
}

// TODO get shared stops en route, check how much delay will there be for
// function get_summed_delay_at_stops (first_tram, second_tram) {
//   return 0
// }

export function should_show_symbol (departure_time, min_time_diff, max_time_diff) {
  const timestamp_s = Date.now() / 1000
  const departure_time_s = departure_time.getTime() / 1000
  return (departure_time_s - min_time_diff <= timestamp_s && timestamp_s <= departure_time_s + min_time_diff)
}

// calculate the delay on an incorrect outcome that could have been prevented had the trams followed the advice of the system
// we calculate the lower bound of the induced delay, that is, we only assume the tram can go to the joining stop just after
// the tram that got there first.
export function get_induced_delay (closer_tram, distant_tram, desired_outcome, real_outcome) {
  if (desired_outcome === real_outcome) {
    return 0
  }
  if (real_outcome === 'closer_first') {
    // TODO add proper calculation
    return 0
  } else {
    // TODO add proper calculation
    return 0
  }
}

export function get_tram_index (tram, tram_list) {
  return tram_list.findIndex(({ trip_id }) => trip_id === tram.trip_id)
}

export function sort_trams_by_dep_time (tram_list) {
  tram_list.sort((a, b) => a.departure_time.getTime() - b.departure_time.getTime())
  return tram_list
}

export function is_tram_at_stop (stop_id, tram) {
  return tram.last_stop === stop_id && tram.state_position === 'at_stop'
}
