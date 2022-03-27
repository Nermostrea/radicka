<template>
  <div class="wrapper">
    <div class="info row">
      <div class="col-half">
        <h1>Řazení tramvají</h1>
        <p>
          Řadička je nástroj pro pomoc s řízením provozu tramvají v kritických
          místech městské infrastruktury. Jedná se na první pohled o světelné
          signalizační zařízení jako u běžné výhybky v Praze. Ale ona je mnohem
          víc než to.
        </p>
        <p>
          Pracuje s aktuálními daty z provozu napojenými na páteřní
          databázi Golemio, kterou provozuje městský podnik Operátor ICT. Řadička
          je tak schopna v reálném čase sledovat provoz a vyhodnotit u vlaků
          přijíždějících ze dvou větví do frekventovaného úseku, který z nich má
          jet první.
        </p>
        <p>
          Po vyhodnocení tuto zprávu předá řidičům, kteří pak mají
          dostatek informací o tom, co se děje. Už dost chaotickému ukazování
          prstů, nejasností a rozhněvaných řidičů i cestujících. Řadička pomáhá
          přesně tam, kde je to třeba: na vytíženém místě dopravní sítě. Pomáhá
          zajistit plynulejší provoz a přehlednou situaci pro naše řidiče. Tento
          web slouží jako ukázka fungování tohoto inovativního nástroje.
        </p>
      </div>
      <div class="col-half">
        <div class="row">
          <v-member v-for="(member, i) in members" :key="i" :member="member" />
        </div>
      </div>
    </div>
    <div class="data row">
      <div class="col-third">
        <div class="row">
          <v-board
            v-for="{ name, id, arrival } in departureBoards"
            :id="id"
            :key="id"
            :tram-data="tramData"
            :name="name"
            :arrival="arrival"
          />
        </div>
      </div>
      <div class="success-rate col-third text-center">
        <h2>Tramvaj, ktera má jet první</h2>
        <div class="counter">
          <div v-if="tramToGoFirst" class="counter__number--success">
            {{ tramToGoFirst }}
          </div>
          <p v-else>
            Čekání na blížící se tramvaje...
          </p>
          <!--          :-->
          <!--          <div class="counter__number&#45;&#45;error">-->
          <!--            {{ errorCount }}-->
          <!--          </div>-->
        </div>
      </div>
      <div class="col-third">
        <div class="row">
          <v-board
            v-for="{ name, id, arrival } in arrivalBoards"
            :id="id"
            :key="id"
            :tram-data="tramData"
            :name="name"
            :arrival="arrival"
          />
        </div>
      </div>
      <!--      <div class="col">-->
      <!--        <h2>Historie průjezdů</h2>-->
      <!--        <div-->
      <!--          v-for="(item, i) in history"-->
      <!--          :key="i"-->
      <!--        >-->
      <!--          {{ item }}-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import VMember from '../components/hp/Member'
import VBoard from '../components/hp/Board'

export default {
  name: 'HomePage',

  components: {
    VMember,
    VBoard
  },

  data () {
    return {
      junctionTrackerState: null,
      members: [
        {
          image: '',
          name: 'Kryštof Petrásek',
          role: 'vedoucí projektu'
        },
        {
          image: '',
          name: 'Kryštof David',
          role: 'designér'
        },
        {
          image: '',
          name: 'František Kmječ',
          role: 'vývojář'
        },
        {
          image: '',
          name: 'Roman Valenta',
          role: 'vývojář'
        },
        {
          image: '',
          name: 'Jaroslav Vyterna',
          role: 'vývojář'
        }
      ],
      departureBoards: [
        {
          name: 'Masarykovo nádraží',
          id: 'U480Z3P'
        },
        {
          name: 'Hlavní nádraží',
          id: 'U142Z1P'
        }
      ],
      arrivalBoards: [
        {
          name: 'Jindřišská',
          arrival: true,
          id: 'U203Z1P'
        }
      ],
      successCount: 20,
      errorCount: 12,
      history: [
        {
          neco: 'neco'
        }
      ]
    }
  },

  computed: {
    tramData () {
      return this.junctionTrackerState?.positions.features ?? []
    },

    tramToGoFirst () {
      if (this.junctionTrackerState?.closer_shown_symbol?.[0] === 'green') {
        return this.junctionTrackerState?.closer_shown_symbol?.[1]
      } else if (this.junctionTrackerState?.distant_shown_symbol?.[0] === 'green') {
        return this.junctionTrackerState?.distant_shown_symbol?.[1]
      }
      return null
    }
  },

  mounted () {
    this.getJunctionTrackerState()
  },

  methods: {
    async getJunctionTrackerState () {
      try {
        const response = await this.$axios.$get('/api/junction-tracker/update')
        this.junctionTrackerState = response.state
      } catch {}

      setTimeout(() => this.getJunctionTrackerState(), 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.info,
.data {
  padding: 30px;
  @media (min-width: 992px) {
    padding: 60px;
  }
}
.data {
  background-color: #ece6e7;
  flex-grow: 1;
}
.success-rate {
  display: flex;
  flex-direction: column;
}
.counter {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;

  &__number {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    color: white;
    font-size: 36px;
    text-align: center;
    line-height: 60px;
    &--success {
      @extend .counter__number;
      background-color: green;
      margin-right: 24px;
    }
    &--error {
      @extend .counter__number;
      background-color: red;
      margin-left: 24px;
    }
  }
}
</style>
