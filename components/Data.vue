<template>
  <div class="items">
    <div v-for="(item, index) in data" :key="index" class="item">
      <div><strong>Linka {{ getLine(item) }}</strong></div>
      <div><strong>Odjezd</strong> {{ getDepartureTime(item) }} z {{ getDepartsFrom(item) }}</div>
      <div><strong>Stav</strong> {{ getStatePosition(item) }}</div>
      <hr>
      <div v-for="(val, key, i) in item.properties" :key="i">
        <strong>{{ key }}</strong>
        <div v-for="(val2, key2, i2) in val" :key="i2" class="ml-4">
          <strong>{{ key2 }}</strong>: {{ val2 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const masaryckaId = 'U480Z3P'
const hlavakId = 'U142Z1P'
// const jindrisskaId = 'U203Z1P'

export default {
  name: 'DataOverview',

  data () {
    return {
      data: []
    }
  },

  mounted () {
    setInterval(() => {
      this.getTramData()
    }, 1000)
  },

  methods: {
    async getStationData () {
      try {
        this.data = await this.$axios.$get(`${this.$config.apiUrl}/departureboards/?ids=U203Z1P&limit=10`, {
          headers: { 'x-access-token': this.$config.accessToken }
        })
      } catch {}
    },
    async getTramData () {
      try {
        // Get data of 1 tram - `${this.$config.apiUrl}/vehiclepositions/${id}`
        const response = await this.$axios.$get(`${this.$config.apiUrl}/vehiclepositions`, {
          headers: { 'x-access-token': this.$config.accessToken }
        })

        const trams = response.features?.filter((tram) => {
          const tramOne = tram.properties.last_position.last_stop.id === masaryckaId
          const tramTwo = tram.properties.last_position.last_stop.id === hlavakId

          return tramOne || tramTwo
        })

        this.data = trams || this.data
      } catch {}
    },
    getLine (item) {
      return item.properties?.trip?.origin_route_name
    },
    getDepartureTime (item) {
      return item.properties.last_position.last_stop.departure_time
    },
    getDepartsFrom (item) {
      return item.properties.last_position.last_stop.id
    },
    getStatePosition (item) {
      return item.properties.last_position.state_position
    }
  }
}
</script>

<style scoped>
.items {
  display: flex;
  width: 100%;
  font-family: sans-serif;
}
.item {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
}
.ml-4 {
  margin-left: 1rem;
}
strong {
  font-weight: bold;
}
hr {
  margin: 1rem 0;
}
</style>
