<template>
  <div>
    <br><br>
    <v-calendar
      v-for="m in 12"
      :key="m"
      :from-page="{month: m, year: 2019}"
      :attributes='attrs'
      @dayclick='dayClicked'
    >
    <v-date-picker>
    </v-date-picker>
    <span slot='header' slot-scope='{ monthLabel, yearLabel }'>
      {{ monthLabel }} {{ yearLabel }}
    </span>
    </v-calendar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedDay: null, // Add state to store selected day
      attrs: [
        {
          dot: {
            backgroundColor: '#ff8080'
          },
          dates:
          [ new Date(2019, 0, 1),
            new Date(2019, 0, 2),
            new Date(2019, 0, 3),
            new Date(2019, 0, 4),
            new Date(2019, 0, 5),
            new Date(2019, 0, 7),
            { start: new Date(2019, 1, 1), end: new Date(2019, 1, 15) },
            { start: new Date(2019, 3, 1), end: new Date(2019, 3, 15) },
            { start: new Date(2019, 6, 1), end: new Date(2019, 7, 31) }
          ]
        },
        {
          dot: {
            backgroundColor: '#0069ad'
          },
          dates:
            [ new Date(2019, 0, 1),
              new Date(2019, 0, 2),
              new Date(2019, 0, 3),
              new Date(2019, 0, 4),
              new Date(2019, 0, 5),
              new Date(2019, 0, 7)
            ]
        },
        {
          dot: {
            backgroundColor: '#000000'
          },
          dates: [ new Date(2019, 0, 1), new Date(2019, 0, 2), new Date(2019, 0, 3), new Date(2019, 0, 4), new Date(2019, 0, 5), new Date(2019, 0, 7) ]
        },
        {
          dot: {
            backgroundColor: '#17d650'
          },
          dates: [ new Date(2019, 0, 1), new Date(2019, 0, 2), new Date(2019, 0, 3), new Date(2019, 0, 4), new Date(2019, 0, 5), new Date(2019, 0, 7) ]
        },
        {
          dot: {
            backgroundColor: '#ecf402'
          },
          dates: [ new Date(2019, 0, 1), new Date(2019, 0, 2), new Date(2019, 0, 3), new Date(2019, 0, 4), new Date(2019, 0, 5), new Date(2019, 0, 7) ]
        }
      ]
    }
  },
  methods: {
    dayClicked (day) {
      console.log(day)
      this.selectedDay = day
    }
  }
}
</script>
