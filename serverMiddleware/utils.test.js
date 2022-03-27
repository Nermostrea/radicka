/* eslint-disable camelcase */
// const consola = require('consola')
const utils = require('./utils')

const CLOSER_STOP_ID = 'hlavak'
const DISTANT_STOP_ID = 'masarycka'
const JOINING_STOP_ID = 'jindrisska'

const CLOSER_TRAM_ID = '9'
const DISTANT_TRAM_ID = '24'

function add_seconds (date, seconds) {
  const new_date = new Date(date.getTime())
  new_date.setSeconds(new_date.getSeconds() + seconds)
  return new_date
}

function mock_critical_event (dep_time_diff, closer_dep_to_arr, distant_dep_to_arr) {
  const distant_dep_time = new Date()
  const closer_dep_time = add_seconds(distant_dep_time, dep_time_diff)
  const distant_arr_time = add_seconds(distant_dep_time, distant_dep_to_arr)
  const closer_arr_time = add_seconds(closer_dep_time, closer_dep_to_arr)

  const closer_tram = new utils.Tram(CLOSER_TRAM_ID, CLOSER_STOP_ID, JOINING_STOP_ID, closer_dep_time, closer_arr_time, 'on_track')
  const distant_tram = new utils.Tram(DISTANT_TRAM_ID, DISTANT_STOP_ID, JOINING_STOP_ID, distant_dep_time, distant_arr_time, 'on_track')
  return new utils.Event(closer_tram, distant_tram)
}

describe('Event behaviour', () => {
  test('Desired outcome is closer_first for closer arrival scheduled earlier', () => {
    const event = mock_critical_event(15, 40, 60)
    expect(event.desired_outcome).toBe('closer_first')
  })

  test('Desired outcome is closer_first for distant arrival scheduled earlier', () => {
    const event = mock_critical_event(15, 60, 60)
    expect(event.desired_outcome).toBe('distant_first')
  })

  test('Real outcome is closer_first when closer gets to joining stop first', () => {
    const event = mock_critical_event(15, 40, 60)
    const closer_arrival = add_seconds(new Date(), 40)
    const distant_arrival = add_seconds(closer_arrival, 30)
    const closer_tram = new utils.Tram(CLOSER_TRAM_ID, JOINING_STOP_ID, JOINING_STOP_ID, closer_arrival, closer_arrival, 'at_stop')
    const distant_tram = new utils.Tram(DISTANT_TRAM_ID, JOINING_STOP_ID, JOINING_STOP_ID, distant_arrival, distant_arrival, 'at_stop')
    const sorted = utils.sort_trams_by_dep_time([closer_tram, distant_tram])
    event.evaluate(sorted)
    expect(event.real_outcome).toBe('closer_first')
  })

  test('Real outcome is distant_frist when distant gets to joining stop first', () => {
    const event = mock_critical_event(15, 40, 60)
    const closer_arrival = add_seconds(new Date(), 40)
    const distant_arrival = add_seconds(closer_arrival, -10)
    const closer_tram = new utils.Tram(CLOSER_TRAM_ID, JOINING_STOP_ID, JOINING_STOP_ID, closer_arrival, closer_arrival, 'at_stop')
    const distant_tram = new utils.Tram(DISTANT_TRAM_ID, JOINING_STOP_ID, JOINING_STOP_ID, distant_arrival, distant_arrival, 'at_stop')
    const sorted = utils.sort_trams_by_dep_time([closer_tram, distant_tram])
    event.evaluate(sorted)
    expect(event.real_outcome).toBe('distant_first')
  })
})
