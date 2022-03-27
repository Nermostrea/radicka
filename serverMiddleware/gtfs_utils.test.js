/* eslint-disable camelcase */
const gtfs_utils = require('./gtfs_utils')

describe('GTFS utils', () => {
  test('get_common_stops_after returns a correct result', () => {
    const trip_utils = new gtfs_utils.TripUtils('./stop_times.txt')
    const correct_ids = ['U203Z1P', 'U1072Z1P', 'U484Z1P', 'U997Z1P', 'U237Z2P', 'U237Z4P', 'U42Z2P', 'U876Z2P']
    const stop_id = 'U203Z1P'
    const trip_id1 = '3_4494_220215'
    const trip_id2 = '24_1863_220215'
    const current_date = new Date()
    current_date.setHours(0, 0, 0, 0)
    const common_stops = trip_utils.get_common_stops_after(stop_id, trip_id1, trip_id2, current_date)
    expect(common_stops.length).toBe(correct_ids.length)
    for (let i = 0; i < common_stops.length; i++) {
      const computed_id = common_stops[i].stop_id
      const correct_id = correct_ids[i]
      expect(computed_id).toBe(correct_id)
    }
  })
})
