<template>
  <v-dialog v-model="showWelcome" persistent max-width="600">
    <v-card>
      <v-card-title class="headline teal darken-2 justify-center" primary-title>
        Welcome to ChopeMovie
        <sup class="font-weight-bold caption">Beta</sup>
      </v-card-title>

      <v-card-text>You have been invited exclusively by KW to participate this beta launch of ChopeMovie, an app designed to Chope Movie Seats!</v-card-text>
      <v-card-text>
        However it may sound, this app is programmed in a way to be fair to the cinemas, with ironclad
        "RulesOfChoping" and fail-safe architecture. It is not an essential app, but an app nonetheless will be helpful when the time comes.
      </v-card-text>
      <v-card-text>Should you choose to proceed, please cite the following in your heart:</v-card-text>
      <v-card-text>
        <blockquote class="blockquote">
          <v-icon>format_quote</v-icon>I Solemly swear that I am not up to no good
        </blockquote>
        <blockquote class="blockquote">
          <v-icon>format_quote</v-icon>To not chope just to watch movie in peace
        </blockquote>
        <blockquote class="blockquote">
          <v-icon>format_quote</v-icon>To report any issue I faced
        </blockquote>
        <blockquote class="blockquote">
          <v-icon>format_quote</v-icon>To abide the Rules of Choping
        </blockquote>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="teal" flat @click="showWelcome = false">I Accept</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
import { mapState } from "vuex";

export default {
  name: "WelcomeDialog",
  data() {
    return {};
  },
  watch: {},
  computed: {
    showWelcome: {
      get() {
        return this.IsNew;
      },
      set(value) {
        if (!value) {
          this.$store.dispatch("setIsNew", false);
          this.$emit("isAccepted");
        }
      }
    },
    ...mapState(["IsNew"])
  },
  methods: {},
  created() {}
};
</script>

<style>
</style>