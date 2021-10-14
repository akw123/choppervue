<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>MOVIE</span>
        <span class="font-weight-light">CHOPER</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Alpha RELEASE</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <MovieSection/>
    </v-content>
  </v-app>
</template>

<script>
import MovieSection from './components/MovieSection'

export default {
  name: 'App',
  components: {
    MovieSection
  },
  data () {
    return {
      //
    }
  }
}
</script>
