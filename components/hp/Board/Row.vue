<template>
  <div class="board__row row">
    <div class="col-quarter">
      {{ lineNumber }} [{{ registrationNumber }}]
    </div>
    <div class="col-quarter">
      {{ time }}
    </div>
    <div class="col-quarter">
      {{ delay }}
    </div>
    <div class="col-quarter">
      {{ statePosition }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BoardRow',

  props: {
    item: {
      type: Object,
      required: true,
      default: () => {}
    },
    arrival: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    lineNumber () {
      return this.item.properties?.trip.origin_route_name
    },
    registrationNumber () {
      return this.item.properties?.trip.vehicle_registration_number
    },
    departureTime () {
      return this.item.properties?.last_position.last_stop.departure_time
    },
    arrivalTime () {
      return this.item.properties?.last_position.last_stop.arrival_time
    },
    delay () {
      return this.item.properties?.last_position.delay.actual
    },
    statePosition () {
      const state = this.item.properties?.last_position.state_position
      return state === 'at_stop' ? 'V zastávce' : 'Na trati'
    },
    time () {
      const time = new Date(this.arrival ? this.arrivalTime : this.departureTime)
      return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
    }
  }
}
</script>

<style lang="scss" scoped>
.board__row + .board__row {
  margin-top: 12px;
}
</style>
