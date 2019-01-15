<template>
  <v-app>
    <app-bar></app-bar>
    <router-view/>
    <navigation></navigation>
  </v-app>
</template>

<script>
import Navigation from './components/Navigation'
import AppBar from './components/AppBar'

export default {
  name: 'App',
  components: { Navigation, AppBar }
}
</script>

<style lang="sass">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  width: 100%
  height: 100%
  position: absolute
  font-size: 20px
</style>
