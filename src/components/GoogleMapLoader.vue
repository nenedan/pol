<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap fill-height>
      <v-flex xs6>
        Gestion de localizaciones
      </v-flex>
      <v-flex xs6>
        <GmapMap
          :center="{lat:28.119383, lng:-15.437131}"
          :zoom="18"
          map-type-id="hybrid"
          style="width: 100%; height: 100%"
        >
        </GmapMap>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
</script>
<style scoped>
</style>
