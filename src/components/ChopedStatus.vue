<template>
  <v-container fluid grid-list-xl>
    <v-layout row wrap>
      <v-flex xs12>
        <v-expansion-panel popout dark>
          <v-expansion-panel-content>
            <div slot="header" class="expandheader">
              <v-badge left color="indigo">
                <span slot="badge">{{chopedStatus.length}}</span>
                <span>Choped Seats</span>
              </v-badge>
            </div>
            <v-list three-line subheader dark avatar>
              <v-list-tile v-for="choped in chopedStatus" :key="choped.guid" avatar ripple>
                <v-list-tile-action class="floatbtn">
                  <v-btn fab dark color="indigo">
                    <v-icon
                      :disabled="!choped.isConfirmed"
                      dark
                      @click="ReleaseChope(choped)"
                    >lock_open</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{choped.movieTitle}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{choped.showDate}} {{choped.showTime}}</v-list-tile-sub-title>
                  <v-list-tile-sub-title>{{choped.cinema}}, {{choped.noOfSeats}} Seats</v-list-tile-sub-title>
                  <v-list-tile-sub-title>
                    <span class="font-weight-bold">{{choped.hall}}&nbsp;</span>
                    <span
                      v-for="chopedSeat in choped.seats"
                      :key="chopedSeat"
                    >[{{chopedSeat}}]&nbsp;&nbsp;</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-avatar>
                  <v-icon v-if="choped.isConfirmed" dark color="green">done_all</v-icon>
                  <v-icon v-if="!choped.isConfirmed" dark color="orange">restore</v-icon>
                </v-list-tile-avatar>
              </v-list-tile>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
    <v-snackbar
      v-model="showAlertBar"
      :color="alertType"
      :timeout="0"
      multi-line
      vertical
      auto-height
    >
      {{releaseStatus}}
      <v-btn dark flat @click="showAlertBar=false">Close</v-btn>
    </v-snackbar>
    <v-snackbar
      v-model="showStatusAlert"
      :color="alertType"
      :timeout="3000"
      multi-line
      top
      auto-height
    >
      {{releaseStatus}}
      <v-btn dark flat @click="showAlertBar=false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="showReleaseLoader" persistent width="300">
      <v-card color="black" dark>
        <v-card-text>Releasing...Please Hold on...
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
import Api from "@/services/Api";
import { timeout } from "q";

export default {
  name: "ChopedStatus",
  props: {
    refresh: Boolean
  },
  data() {
    return {
      chopedStatus: [],
      releaseStatus: "",
      apiError: [],
      showAlertBar: false,
      showStatusAlert: false,
      alertType: "",
      showReleaseLoader: false,
      timerId: 0
    };
  },
  watch: {
    refresh: function() {
      if (this.refresh) {
        this.PoolChopStatus();
        this.$store.dispatch("resetChopedStatusCard");
      }
    }
  },
  methods: {
    PoolChopStatus: function() {
      this.LoadChopStatus();
      if (this.timerId === 0) {
        var self = this;
        this.timerId = setInterval(function() {
          self.LoadChopStatus();
        }, 3000);
      }
    },
    LoadChopStatus: function() {
      Api.get("api/movuee/ChopedStatus")
        .then(response => {
          this.chopedStatus = response.data;

          if (this.timerId > 0) {
            var isDestroyPool = true;
            if (this.chopedStatus) {
              for (let i = 0; i < this.chopedStatus.length; i++) {
                if (!this.chopedStatus[i].isConfirmed) {
                  isDestroyPool = false;
                }
              }
            }
            if (isDestroyPool) {
              clearInterval(this.timerId);
              this.showAlert(
                "Your request has been confirmed.",
                "success",
                true
              );
              this.timerId = 0;
            }
          }
        })
        .catch(e => {
          this.apiError.push(e);
        });
    },
    ReleaseChope: function(chopeReq) {
      this.showReleaseLoader = true;
      Api.post("api/movuee/releaseSeat/" + chopeReq.guid)
        .then(response => {
          this.showReleaseLoader = false;
          this.showAlert(response.data, "success", false);
          this.PoolChopStatus();
        })
        .catch(e => {
          this.apiError.push(e);
          this.showReleaseLoader = false;
          this.showAlert(e.response.data, "error", false);
        });
    },
    showAlert: function(message, alertType, isStatus) {
      if (isStatus) {
        this.showStatusAlert = true;
      } else {
        this.showAlertBar = true;
      }
      this.releaseStatus = message;
      this.alertType = alertType;
    }
  },
  created() {
    this.LoadChopStatus();
  }
};
</script>

<style>
.expandheader {
  font-size: 25px;
}

.floatbtn {
  padding-right: 18px;
}
</style>