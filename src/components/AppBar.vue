<template>
  <v-toolbar v-show="navShow" dark color="primary">
    <v-toolbar-side-icon></v-toolbar-side-icon>

    <v-toolbar-title class="white--text">Title</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>search</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>apps</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>refresh</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>more_vert</v-icon>
    </v-btn>
  </v-toolbar>
</template>
<script>
import Firebase from 'firebase'

export default {
  data () {
    return {
      navShow: false
    }
  },
  methods: {
  },
  mounted: function () {
    this.navShow = Firebase.auth().currentUser
  }
}
</script>
