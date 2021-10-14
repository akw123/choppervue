<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>CHOPE</span>
        <span class="font-weight-light">MOVIE</span>
        <sup class="font-weight-bold caption">Live</sup>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat>
          <v-icon @click="logout" v-if="userName">power_settings_new</v-icon>
        </v-btn>

        <v-btn v-if="userName.length > 0" flat>
          <span class="mr-2">{{userName}}</span>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
    <v-footer dark height="auto">
      <v-layout justify-center row wrap>
        <v-flex py-3 text-xs-center white--text xs12>
          &copy;2019 —
          <strong>ChopeMovie.com</strong>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  data() {
    return {};
  },
  methods: {
    logout: function() {
      this.$store.dispatch("removeUser");
      this.$router.push("/login");
    }
  },
  mounted() {
    this.$store.dispatch("setUser");
  },
  computed: mapState(["userName"])
};
</script>
