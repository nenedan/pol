<template>
  <div v-show="navShow">
    <v-icon class="menu-icon"
      @click.stop="drawer = !drawer"
    >
      menu
    </v-icon>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/86.jpg">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>John Leider</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile v-for="item of items"
          :key="item.title"
          @click="routeTo(item.path)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="logout()">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Salir</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Firebase from 'firebase'

export default {
  data () {
    return {
      drawer: null,
      items: [
        { icon: 'dashboard', path: 'home', title: 'Inicio' },
        { icon: 'face', path: 'agents', title: 'Agentes' },
        { icon: 'security', path: 'ranges', title: 'Rangos' },
        { icon: 'maps', path: 'maps', title: 'Maps' },
        { icon: 'event', path: 'calendar', title: 'Calendario' }
      ],
      navShow: false
    }
  },
  methods: {
    logout: function () {
      Firebase.auth().signOut().then(() => {
        location.reload(true)
      })
    },
    routeTo: function (path) {
      this.$router.replace(path)
      this.drawer = false
    }
  },
  mounted: function () {
    this.navShow = Firebase.auth().currentUser
  }
}
</script>

<style scoped>
.menu-icon{
  position: absolute;
  top: 25px;
  left: 25px
}
</style>
