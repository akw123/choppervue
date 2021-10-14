<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-flex xs12>
        <v-expansion-panel popout>
          <v-expansion-panel-content>
            <div slot="header" class="expandheader">{{cinema}}</div>
            <v-container grid-list-xl fluid>
              <v-layout row wrap >
                <v-flex 
                   v-for="n in 9"
              :key="n"
                xs12 sm4 xl4>
                  <v-card dark color="deep-purple darken-1" class="white--text">
                      <v-container fluid>
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-img
                          src="https://ngsprodstorage1.blob.core.windows.net/prd/content/images/movie/default/en-sg/Poster-Aquaman-2018-V2.jpg"
                          max-height="100%"
                          contain
                          lazy-src
                        ></v-img>
                      </v-flex>
                      <v-flex xs6>
                        <v-layout row wrap>
                          <v-flex d-flex>
                            <v-card-title primary-title>
                              <div>
                                <div class="headline">Aqua Man</div>
                                <div>2hr 23 mins</div>
                                <div class="customcaption">IMDB Rating</div>
                                <div>
                                  <v-icon dark>star</v-icon>
                                  <v-icon dark>star</v-icon>
                                  <v-icon dark>star</v-icon>
                                  <v-icon dark>star</v-icon>
                                  <v-icon dark>star_border</v-icon>
                                </div>
                              </div>
                            </v-card-title>
                          </v-flex>
                          <v-flex d-flex>
                            <v-divider dark></v-divider>
                          <v-card-actions>
          <v-btn flat color="orange">Share</v-btn>
          <v-btn flat color="orange">Explore</v-btn>
        </v-card-actions>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                      </v-container>
                  </v-card>
                </v-flex>

              </v-layout>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "MovieSection",
  data() {
    return {
      cinema: "Shaw",
      show: false
    };
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