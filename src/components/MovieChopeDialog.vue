<template>
  <v-dialog v-model="show" scrollable fullscreen lazy transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark color="dark">
        <v-btn icon dark @click="show = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>{{selectedMovie.title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn :disabled="!chopeFormValid" dark flat @click="submitChope">CHOPE!</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-container>
          <v-layout row wrap color="grey darken-4">
            <v-flex xs12 sm4>
              <v-card color="grey darken-4" height="100%">
                <v-container>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-img :src="movieObj.posterPath" contain lazy-src aspect-ratio="1.5"></v-img>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex xs12 sm8>
              <v-card color="grey darken-4" height="100%" class="white--text">
                <v-container>
                  <v-layout row wrap class="pa-2">
                    <v-flex d-flex xs3>
                      <v-card-text class="text-xs-center">Synopsis</v-card-text>
                    </v-flex>
                    <v-flex d-flex xs9>
                      <v-card-text class="text-xs-left">{{selectedMovie.synopsis}}</v-card-text>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex d-flex xs3>
                      <v-card-text class="text-xs-center">Main Cast</v-card-text>
                    </v-flex>
                    <v-flex d-flex xs9>
                      <v-card-text class="text-xs-left">{{selectedMovie.casts}}</v-card-text>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
          <v-form ref="chopeForm" v-model="chopeFormValid">
            <v-card class="elevation-6">
              <v-divider></v-divider>
              <v-subheader>CHOOSE YOUR SEATS</v-subheader>

              <v-container fluid>
                <v-layout row wrap align-center>
                  <v-flex xs4 sm2 offset-sm2>
                    <v-subheader>Cinemas</v-subheader>
                  </v-flex>
                  <v-flex xs8>
                    <v-select
                      single-line
                      menu-props="auto"
                      :items="showLocations"
                      ref="Cinema"
                      label="Select"
                      prepend-icon="movie"
                      item-text="display"
                      item-value="value"
                      v-model="selectedLocation"
                      @change="LoadPerformanceInfo"
                      :rules="[rules.required]"
                      :disabled="isFormDisabled"
                    ></v-select>
                  </v-flex>
                </v-layout>
                <v-layout row wrap align-center>
                  <v-flex xs4 sm2 offset-sm2>
                    <v-subheader>Show Date</v-subheader>
                  </v-flex>
                  <v-flex xs8>
                    <v-select
                      attach
                      :items="showTimes"
                      menu-props="auto"
                      label="Select"
                      prepend-icon="access_time"
                      single-line
                      @change="LoadPerformanceInfo"
                      v-model="selectedDate"
                      :rules="[rules.required]"
                      :disabled="isFormDisabled"
                    ></v-select>
                  </v-flex>
                </v-layout>

                <v-layout row wrap align-center>
                  <v-flex xs4 sm2 offset-sm2>
                    <v-subheader>Show Time</v-subheader>
                  </v-flex>
                  <v-flex xs8>
                    <v-select
                      :loading="isSelectShowTimeLoading"
                      :items="moviePerformance"
                      ref="ShowTime"
                      :menu-props="{ auto: true, overflowY: true }"
                      label="Select"
                      prepend-icon="access_time"
                      single-line
                      item-value="performance_code"
                      @change="LoadSeats"
                      :rules="[rules.required]"
                      v-model="selectedPerformanceCode"
                      :disabled="isFormDisabled"
                    >
                      <template
                        slot="selection"
                        slot-scope="data"
                      >{{ data.item.performance_display_time }} [{{ data.item.movie_format_name }}] - [{{data.item.location_venue_name}}]</template>
                      <template
                        slot="item"
                        slot-scope="data"
                      >{{ data.item.performance_display_time }} [{{ data.item.movie_format_name }}] - [{{data.item.location_venue_name}}]</template>
                    </v-select>
                  </v-flex>
                </v-layout>

                <v-layout row wrap align-center>
                  <v-flex xs4 sm2 offset-sm2>
                    <v-subheader>Seats No</v-subheader>
                  </v-flex>
                  <v-flex xs8>
                    <v-select
                      attach
                      :items="NoofSeats"
                      menu-props="auto"
                      label="Select"
                      prepend-icon="supervisor_account"
                      single-line
                      :rules="[rules.required]"
                      @change="ResetSeatsCount"
                      v-model="selectedNoofSeats"
                      :disabled="isFormDisabled"
                    ></v-select>
                  </v-flex>
                </v-layout>

                <v-layout row wrap align-center>
                  <v-flex xs4 sm2 offset-sm2>
                    <v-subheader>Row</v-subheader>
                  </v-flex>
                  <v-flex xs8>
                    <v-select
                      attach
                      :loading="isSelectRowLoading"
                      :items="movieSeats"
                      menu-props="auto"
                      label="Select"
                      prepend-icon="sort_by_alpha"
                      single-line
                      item-text="element_row_reference"
                      item-value="element_row_reference"
                      @change="LoadRowNumber"
                      :rules="[rules.required]"
                      v-model="selectedRow"
                      :disabled="isFormDisabled"
                    ></v-select>
                  </v-flex>
                </v-layout>

                <v-layout row wrap align-center>
                  <v-flex xs4 sm2 offset-sm2>
                    <v-subheader>Row Number</v-subheader>
                  </v-flex>
                  <v-flex xs8>
                    <v-select
                      attach
                      :items="movieFilteredRows"
                      ref="RowNumber"
                      :disabled="isFormDisabled"
                      menu-props="auto"
                      label="Select"
                      prepend-icon="filter_1"
                      item-text="element_column_reference"
                      item-value="layout_element_code"
                      v-model="selectedLayout"
                      multiple
                      chips
                      hint="Select your seats"
                      persistent-hint
                      required
                      :rules="[validateSelectedSeats]"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-divider></v-divider>
              <v-subheader>Actions Panel</v-subheader>
              <v-container fluid>
                <v-layout>
                  <v-flex xs4 offset-xs1>
                    <v-btn
                      slot="activator"
                      color="teal"
                      :disabled="!selectedPerformanceCode"
                      @click="LoadSeats(selectedPerformanceCode)"
                      fab
                      dark
                      medium
                      bottom
                    >
                      <v-icon dark>refresh</v-icon>
                    </v-btn>
                    <span>Refresh</span>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      fab
                      :disabled="!selectedPerformanceCode"
                      color="teal"
                      dark
                      bottom
                      medium
                      slot="activator"
                      :href="SeatUrl"
                      target="_blank"
                    >
                      <v-icon dark>event_seat</v-icon>
                    </v-btn>
                    <span class="text-xs-center">Seat Map</span>
                  </v-flex>
                  <v-flex xs4>
                    <v-btn
                      fab
                      color="teal"
                      dark
                      bottom
                      medium
                      slot="activator"
                      :href="selectedMovie.reviewUrl"
                      target="_blank"
                      :disabled="!selectedMovie.reviewUrl"
                    >
                      <v-icon dark>comment</v-icon>
                    </v-btn>
                    <span color="teal">IMDB Reviews</span>
                  </v-flex>
                  <!-- <v-flex xs4>
                    <v-tooltip bottom style="flex: 1 0 auto">
                      <v-btn
                        fab
                        dark
                        bottom
                        medium
                        slot="activator"
                        color="orange"
                        @click="ShowReportDialog"
                      >
                        <v-icon dark>bug_report</v-icon>
                      </v-btn>
                      <span>Report Issue</span>
                    </v-tooltip>
                  </v-flex>-->
                </v-layout>
              </v-container>
              <v-divider></v-divider>
              <v-list three-line subheader>
                <v-subheader>Additional Settings</v-subheader>
                <v-list-tile avatar>
                  <v-list-tile-action>
                    <v-checkbox v-model="genericNotifications" :disabled="isFormDisabled"></v-checkbox>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>Email Notifications</v-list-tile-title>
                    <v-list-tile-sub-title>Notify me when my seats has been released, nearing to my choped timeslots</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <!-- <v-list-tile avatar>
                <v-list-tile-action>
                  <v-checkbox v-model="lateReleaseNotification" :disabled="isFormDisabled"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>Late Release</v-list-tile-title>
                  <v-list-tile-sub-title>Ticket not purchased within 6 hours from the show will be auto released. Select this to enable late relase to 1 hour before show time. Note: Use at risk!</v-list-tile-sub-title>
                </v-list-tile-content>
                </v-list-tile>-->
                <v-list-tile avatar>
                  <v-list-tile-action>
                    <v-checkbox v-model="smsNotification" disabled></v-checkbox>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title color="disabled">SMS Notification (Not available yet)</v-list-tile-title>
                    <v-list-tile-sub-title>Enable this if you wish to receive SMS notification.</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-form>
          <v-btn
            block
            :disabled="!chopeFormValid"
            large
            dark
            @click="submitChope"
            class="headline font-weight-bold"
          >Chope!</v-btn>
        </v-container>

        <!-- <v-toolbar dark color="dark">
          <v-toolbar-title class="text-sm-center">{{selectedMovie.title}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn :disabled="!chopeFormValid" dark flat @click="submitChope">CHOPE!</v-btn>
          </v-toolbar-items>
        </v-toolbar>-->
      </v-card-text>
    </v-card>
    <v-snackbar
      v-model="showAlertBar"
      :color="alertType"
      :timeout="0"
      multi-line
      vertical
      auto-height
    >
      {{alertMessage}}
      <v-btn dark flat @click="closeDialog">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="showChopeLoader" persistent width="300">
      <v-card color="black" dark>
        <v-card-text>Choping...Please Hold on...
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import Api from "@/services/Api";

export default {
  name: "MovieChopeDialog",
  props: {
    dialog: Boolean,
    movieObj: null,
    movieShowTimeData: null
  },
  data() {
    return {
      isSelectShowTimeLoading: false,
      isSelectRowLoading: false,
      isFormDisabled: false,
      showChopeLoader: false,
      showTooltip: true,
      showAlertBar: false,
      alertMessage: "",
      alertType: "",
      chopeFormValid: false,
      smsNotification: false,
      lateReleaseNotification: false,
      genericNotifications: true,
      selectedNoofSeats: 0,
      selectedLayout: [],
      selectedRow: "",
      selectedPerformanceCode: "",
      selectedDate: "",
      selectedLocation: null,
      moviePerformance: [],
      movieSeats: [],
      submitSucess: false,
      movieFilteredRows: [],
      NoofSeats: [1, 2, 3, 4, 5],
      rules: {
        required: value => !!value || "Please select one.",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      }
    };
  },
  methods: {
    closeDialog: function() {
      this.isFormDisabled = false;
      this.showAlertBar = false;

      if (this.submitSucess) {
        this.showStatus = false;
      }
    },
    validateSelectedSeats: function(value) {
      if (value.length <= this.selectedNoofSeats) return true;
      return "Cannot Exceed " + this.selectedNoofSeats + " seats";
    },
    submitChope: function() {
      if (this.$refs.chopeForm.validate()) {
        this.showChopeLoader = true;
        Api.post("/api/movuee/submitChope", {
          ShowLocation: this.$refs.Cinema.selectedItems[0].display,
          ShowDate: this.selectedDate,
          ShowTime: this.$refs.ShowTime.selectedItems[0]
            .performance_display_time,
          NoOfSeats: this.selectedNoofSeats,
          Row: this.selectedRow,
          GenericNotification: this.genericNotifications,
          LateReleaseNotification: this.lateReleaseNotification,
          SMSNotification: this.smsNotification,
          ElementCode: this.$refs.RowNumber.selectedItems,
          PerformanceCode: this.selectedPerformanceCode,
          MovieTitle: this.selectedMovie.title
        })
          .then(response => {
            this.isFormDisabled = true;
            this.showChopeLoader = false;
            this.submitSucess = true;
            this.showAlert(
              "Successfully submitted Chope request! You will receive notification soon!",
              "success"
            );
          })
          .catch(e => {
            this.showChopeLoader = false;
            this.showAlert("Chope Error: " + e.response.data, "error");
          });
      }
    },
    showAlert: function(message, alertType) {
      this.showAlertBar = true;
      this.alertMessage = message;
      this.alertType = alertType;
    },
    ResetSeatsCount: function() {
      this.selectedLayout = [];
    },
    LoadPerformanceInfo: function() {
      if (this.selectedDate && this.selectedLocation) {
        this.isSelectShowTimeLoading = true;
        this.url =
          "/api/movuee/MoviePerformance?movieCode=" +
          this.selectedMovie.movieCode +
          "&movieDate=" +
          this.selectedDate +
          "&movieLocation=" +
          this.selectedLocation;
        Api.get(this.url)
          .then(response => {
            this.moviePerformance = response.data;
            this.isSelectShowTimeLoading = false;
          })
          .catch(e => {
            this.showAlert(e.response.data, "error");
          });
      }
    },
    ShowReportDialog: function() {
      this.$store.dispatch("enableReportDialog");
    },
    LoadSeats: function(performanceInfo) {
      this.url = "/api/movuee/MovieSeats?performanceCode=" + performanceInfo;
      this.$store.dispatch("setActivePerformanceCode", performanceInfo);
      this.isSelectRowLoading = true;
      Api.get(this.url)
        .then(response => {
          this.movieSeats = response.data;
          this.movieFilteredRows = [];
          this.ResetSeatsCount();
          this.selectedRow = "";
          this.isSelectRowLoading = false;
        })
        .catch(e => {
          this.showAlert(e.response.data, "error");
        });
    },
    LoadRowNumber: function(row) {
      this.movieFilteredRows = [];
      this.movieSeats.forEach(element => {
        if (element.element_row_reference === row)
          this.movieFilteredRows.push(element);
      });
      this.ResetSeatsCount();
    }
  },
  watch: {},
  computed: {
    SeatUrl: {
      get() {
        return (
          "https://www.shaw.sg/seat-selection/" + this.selectedPerformanceCode
        );
      }
    },
    show: {
      get() {
        return this.dialog;
      },
      set(value) {
        if (!value) {
          this.$store.dispatch("removeActivePerformanceCode");
          this.$emit("close");
        }
      }
    },
    showStatus: {
      get() {
        return false;
      },
      set(value) {
        if (!value) {
          this.$store.dispatch("removeActivePerformanceCode");
          this.$emit("updateStatus");
        }
      }
    },
    selectedMovie: {
      get() {
        return this.movieObj;
      }
    },
    showTimes: {
      get() {
        var selectedMovieShowTime = this.movieShowTimeData;
        var returnShowtimes = [];
        selectedMovieShowTime.forEach(element => {
          if (element.type === "PerformanceDate")
            returnShowtimes.push(element.display);
        });
        return returnShowtimes;
      }
    },
    showLocations: {
      get() {
        var selectedMovieLocation = this.movieShowTimeData;
        var returnShowLocations = [];
        selectedMovieLocation.forEach(element => {
          if (element.type === "Location") returnShowLocations.push(element);
        });
        return returnShowLocations;
      }
    }
  }
};
</script>

<style>
</style>