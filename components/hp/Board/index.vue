<template>
  <div class="col">
    <div class="board">
      <div class="board__head">
        <strong class="board__title">{{ name }} - {{ arrival ? 'Příjezdy' : 'Odjezdy' }}</strong>
      </div>
      <div class="board__body">
        <div class="board__th row">
          <div class="col-quarter">
            Linka
          </div>
          <div class="col-quarter">
            {{ arrival ? 'Příjezd' : 'Odjezd' }}
          </div>
          <div class="col-quarter">
            Zpoždění
          </div>
          <div class="col-quarter">
            Stav
          </div>
        </div>
        <v-row v-for="(item, i) in boardData" :key="i" :item="item" arrival />
      </div>
    </div>
  </div>
</template>

<script>
import { uniqBy } from 'lodash'
import VRow from './Row'

export default {
  name: 'StationBoard',

  components: {
    VRow
  },

  props: {
    id: {
      type: String,
      required: true,
      default: ''
    },
    name: {
      type: String,
      required: true,
      default: ''
    },
    arrival: {
      type: Boolean,
      required: false,
      default: false
    },
    tramData: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      jindrisskaId: 'U203Z1P',
      boardData: []
    }
  },

  watch: {
    tramData (value) {
      const trams = value.filter((tram) => {
        const lastStopId = tram.properties.last_position.last_stop.id
        if (this.arrival) {
          return lastStopId === this.id && lastStopId === this.jindrisskaId
        } else {
          return lastStopId === this.id
        }
      })

      this.boardData = uniqBy([...this.boardData, ...trams], 'vehicle_registration_number').slice(0, 3)
    }
  }
}
</script>

<style lang="scss" scoped>
.board {
  background-color: white;
  margin-bottom: 24px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;

  & + .board {
    margin-top: 24px;
  }

  &__head {
    padding: 12px;
  }

  &__body {
    padding: 4px 12px;
  }

  &__th {
    font-size: 14px;
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 4px;
    margin-bottom: 4px;
  }
}
</style>
