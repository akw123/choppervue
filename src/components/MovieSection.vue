<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-flex xs12>
        <v-expansion-panel popout expand>
          <v-expansion-panel-content>
            <div slot="header" class="expandheader">{{cinema}}</div>
            <v-container grid-list-xl fluid>
              <v-layout row wrap>
                <v-flex
                  v-for="(movie,index)  in moviesNowShowing"
                  :key="movie.movieCode"
                  xs12
                  sm4
                  xl4
                  ref="moviecards"
                >
                  <v-hover>
                    <v-card
                      slot-scope="{ hover }"
                      :class="`elevation-${hover ? 12 : 2}`"
                      height="100%"
                      dark
                      color="#424242"
                      class="white--text"
                    >
                      <v-container fluid>
                        <v-layout row wrap>
                          <v-flex xs6>
                            <v-img :src="movie.posterPath" max-height="100%" contain lazy-src></v-img>
                          </v-flex>
                          <v-flex xs6>
                            <v-layout row wrap>
                              <v-flex d-flex xs12>
                                <v-card-title primary-title>
                                  <div>
                                    <div class="headline">{{movie.title}}</div>
                                    <v-spacer></v-spacer>
                                    <div>{{movie.duration}} mins</div>
                                    <div class="customcaption">IMDB Rating</div>
                                    <v-spacer></v-spacer>
                                    <div>
                                      <v-rating
                                        v-model="movie.ratings"
                                        background-color="yellow darken-3"
                                        color="orange"
                                        small
                                        half-increments
                                        dense
                                        readonly
                                      ></v-rating>
                                    </div>
                                  </div>
                                </v-card-title>
                              </v-flex>
                              <v-flex d-flex xs12>
                                <v-card-actions>
                                  <v-btn
                                    :disabled="showLoader"
                                    v-on:click="loader = index"
                                    color="white"
                                    outline
                                  >Chope!</v-btn>
                                </v-card-actions>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card>
                  </v-hover>
                </v-flex>
              </v-layout>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
      <v-dialog v-model="showLoader" persistent width="300">
        <v-card color="black" dark>
          <v-card-text>Please hold on
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <MovieChopeDialog
        :dialog="chopedialog"
        @close="chopedialog = false"
        @updateStatus="RefreshChopedStatus"
        v-if="chopedialog"
        :movieObj="selectedMovie"
        :movieShowTimeData="showtimeData"
      ></MovieChopeDialog>
    </v-layout>
  </v-container>
</template>

<script>
import MovieChopeDialog from "@/components/MovieChopeDialog";
import Api from "@/services/Api";

export default {
  name: "MovieSection",
  components: {
    MovieChopeDialog
  },
  data() {
    return {
      cinema: "Shaw Cineplex",
      show: false,
      rating: 4.5,
      chopedialog: false,
      selectedMovie: null,
      showtimeData: null,
      loader: null,
      showLoader: false,
      movieTitle: "AquaMan",
      moviesNowShowing: [],
      selectedNMovieIndex: 0,
      apiError: []
    };
  },
  methods: {
    RefreshChopedStatus: function() {
      this.$store.dispatch("refreshChopedStatusCard");
      this.chopedialog = false;
    },
    LoadShowTime: function(moviecode) {
      this.url = "/api/movuee/MovieShowTime?movieCode=" + moviecode;
      Api.get(this.url)
        .then(response => {
          this.showtimeData = response.data;
          this.chopedialog = true;
          this.showLoader = false;
        })
        .catch(e => {
          this.apiError.push(e);
        });
    }
  },
  created() {
    Api.get("api/movuee/nowshowing")
      .then(response => {
        this.moviesNowShowing = response.data;
      })
      .catch(e => {
        this.apiError.push(e);
      });
  },
  mounted() {},
  watch: {
    loader: function() {
      if (this.loader != null) {
        this.selectedMovie = this.moviesNowShowing[this.loader];
        this.showLoader = true;
        this.LoadShowTime(this.selectedMovie.movieCode);
      }
      this.loader = null;
    }
  }
};
</script>

<style>
.expandheader {
  font-size: 25px;
}
.customcaption {
  font-size: 8px !important;
  font-weight: bold;
  color: #f5c518;
}
</style>