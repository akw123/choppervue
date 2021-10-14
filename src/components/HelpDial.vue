<template>
  <div>
    <v-speed-dial
      v-model="fab"
      :top="top"
      :bottom="bottom"
      :right="right"
      :left="left"
      :direction="direction"
      :transition="transition"
    >
      <v-btn slot="activator" v-model="fab" color="cyan  darken-3" dark fab>
        <v-icon>help</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-tooltip light left :value="enableTooltip" :disabled="diabledTooltip">
        <v-btn
          id="infoFab"
          fab
          dark
          small
          color="pink darken-1"
          @click="isShowInfoComp = true"
          slot="activator"
        >
          <v-icon>info</v-icon>
        </v-btn>
        <span>Rules</span>
      </v-tooltip>

      <v-tooltip dark left :value="enableTooltip" :disabled="diabledTooltip">
        <v-btn
          fab
          dark
          small
          color="orange darken-2"
          @click="issueDialogComp= true"
          slot="activator"
        >
          <v-icon>bug_report</v-icon>
        </v-btn>
        <span>Report</span>
      </v-tooltip>
      <v-tooltip dark left :value="enableTooltip" :disabled="diabledTooltip">
        <v-btn fab dark small color="green darken-2" @click="isShowGuideComp= true" slot="activator">
          <v-icon>library_books</v-icon>
        </v-btn>
        <span>Guide</span>
      </v-tooltip>
      <v-tooltip dark left :value="enableTooltip" :disabled="diabledTooltip">
        <v-btn fab dark small color="yellow darken-2" @click="isShowNoticeComp= true" slot="activator">
          <v-icon>notifications</v-icon>
        </v-btn>
        <span>Notice</span>
      </v-tooltip>
      <v-tooltip dark left :value="enableTooltip" :disabled="diabledTooltip">
        <v-btn fab dark small color="pink darken-2" @click="isComic1= true" slot="activator">
          <v-icon>burst_mode</v-icon>
        </v-btn>
        <span>Story</span>
      </v-tooltip>
    </v-speed-dial>
    <v-dialog v-model="isShowInfoComp" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">Rules of Choping</v-card-title>
        <v-card-text>1. There can only be 2 active chope per user account.</v-card-text>
        <v-card-text>2. Movie starting within an hour will not be available for chope.</v-card-text>
        <v-card-text>3. Each chope can select maximum 5 seats, and all seats has to be on the same row with no orphaned seat.</v-card-text>
        <v-card-text>4. For super popular blockbuster, maximum 2 seats allowable per chope. (Coming-Soon)</v-card-text>
        <v-card-text>5. Upon Chope submission, you will be alerted via email or in-app notification of the chope outcome within 1 min.</v-card-text>
        <v-card-text>6. System will send 2 reminders 6 and 2 hours prior to movie show time.</v-card-text>
        <v-card-text>7. If the choped seats are not released 1 hour before the show starts. System will auto-release the seats.</v-card-text>
        <v-card-text>8. To prevent misuse of this app, if there has been more than 5 auto-released chope in a week, your account will be LOCKED.</v-card-text>
        <v-card-text>9. This app is designed to be fair to the Cinemas.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal  darken-1" flat @click="isShowInfoComp = false">I got it!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="IsReportIssue" persistent max-width="600px">
      <v-form ref="issueForm" v-model="issueFormValid">
        <v-card>
          <v-card-title>
            <span class="headline">Report an Issue</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-select
                    :items="['Bug', 'Suggestions', 'Feedbacks', 'Like']"
                    label="Type"
                    v-model="IssueType"
                    :rules="[v => !!v || 'Item is required']"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    v-model="IssueDescription"
                    outline
                    label="Description"
                    counter="500"
                    value
                    :rules="[v => !!v || 'Item is required',
                    v => (v && v.length > 10) || 'Must be greater than 10 characters', 
                    v => (v && v.length <= 500) || 'Must be less than 500 characters']"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="issueDialogComp = false">Close</v-btn>
            <v-btn
              color="blue darken-1"
              flat
              @click="submitReport"
              :disabled="!issueFormValid"
            >Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="showIssueLoader" persistent width="300">
      <v-card color="black" dark>
        <v-card-text>Submitting Issue....
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isShowGuideComp" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">
          <v-badge right color="green">
            <span>Application Guide</span>
            <v-icon slot="badge">library_books</v-icon>
          </v-badge>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>1. To start choping, expand the desired Cinema, and click chope on the movie.</v-card-text>
        <v-card-text>2. Then select the theater location and the date, Showtime will be populated.</v-card-text>
        <v-card-text>3. Refresh button is for refreshing the available Seats Row and Number. Note: This option will only be enabled if showtime is selected.</v-card-text>
        <v-card-text>4. Seat Map button is to view the Seat layout. Note: This option will only be enabled if showtime is selected.</v-card-text>
        <v-card-text>5. IMDB Reviews will show the movie reviews, filtered based on the best voted reviews. Note: This option is not available if IMDB rating is not available for the movie.</v-card-text>
        <v-card-text>6. Checking Notification will send out app notification, or email notification.</v-card-text>
        <v-divider></v-divider>
        <v-card-text>Chope Request:</v-card-text>
        <v-card-text>1. Once you submitted a chope, the system will process your request, and you will received in-app alert or notification.</v-card-text>
        <v-card-text>2. Expanding the chope request, the status of the chope will change from pending to a tick if chope is successful.</v-card-text>
        <v-card-text>3. Any error in choping, the adminstrator will be alerted.</v-card-text>
        <v-divider></v-divider>
        <v-card-text>Release Request:</v-card-text>
        <v-card-text>1. Click the unlock icon under chope request to release your chope.</v-card-text>
        <v-card-text>2. The status of the chope will to pending, and if release is successful, the chope will be removed from the list.</v-card-text>
        <v-card-text>3. Any error in releasing, the adminstrator will be alerted.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal  darken-1" flat @click="isShowGuideComp = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isShowNoticeComp" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">
          <v-badge right color="yellow">
            <span>Notice</span>
            <v-icon slot="badge">error</v-icon>
          </v-badge>
        </v-card-title>
        <v-card-text>1. Currently only Shaw Cineplex is available, GV will be available in the near future</v-card-text>
        <v-card-text>2. More enhancement will be released on beta-2 version, features including Release & buy, and enhanced security measurements for anti-stuffing attack, and malicious logins.</v-card-text>
        <v-card-text>3. If you are lost, help is just a click away at ? icon.</v-card-text>
        <v-card-text>4. Do report any issue you faced by clicking the ? icon, select report. Any issues reported will be looked into and much appreciated.</v-card-text>
        <v-card-text>5. Enjoy!</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="isWelcomeAcceptedComp"
            color="teal  darken-1"
            flat
            @click="isComic1 = true"
          >Show me User Story</v-btn>
          <v-btn
            v-if="isWelcomeAcceptedComp"
            color="teal  darken-1"
            flat
            @click="CloseWelcome"
          >I'm Ready to Start</v-btn>
          <v-btn
            v-if="!isWelcomeAcceptedComp"
            color="teal  darken-1"
            flat
            @click="isShowNoticeComp = false"
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isComic1" persistent fullscreen full-width>
      <v-card color="grey darken-4" class="elevate-6" dark>
        <v-card-title>This is a story of AhBeng & AhHua using ChopeMovie</v-card-title>
        <v-card-text>
          <v-img src="/static/img/comic/1.png" height="80%" contain></v-img>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal darken-1" flat @click="isComic2 = true">Next Page</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isComic2" persistent fullscreen full-width>
      <v-card color="grey darken-4" class="elevate-6" dark>
        <v-card-title>This is a story of AhBeng & AhHua using ChopeMovie</v-card-title>
        <v-card-text>
          <v-img src="/static/img/comic/2.png" height="80%" contain></v-img>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal darken-1" flat @click="isComic2 = false">Back</v-btn>
          <v-btn color="teal darken-1" flat @click="CloseComic">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="showReportStatus"
      color="success"
      :timeout="3000"
      multi-line
      top
      auto-height
    >{{reportMsg}}</v-snackbar>
  </div>
</template>


<script>
import { mapState } from "vuex";
import Api from "@/services/Api";
export default {
  name: "HelpDial",
  data() {
    return {
      direction: "top",
      IssueType: "",
      IssueDescription: "",
      enableTooltip: false,
      diabledTooltip: false,
      showReportStatus: false,
      issueFormValid: false,
      showIssueLoader: false,
      isComic1: false,
      isComic2: false,
      reportMsg: "",
      fab: false,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: "slide-y-reverse-transition"
    };
  },
  watch: {
    fab(val) {
      this.enableTooltip = false;
      this.diabledTooltip = false;
      val &&
        setTimeout(() => {
          this.enableTooltip = true;
          this.$nextTick(() => (this.diabledTooltip = true));
        }, 250);
    }
  },

  computed: {   
    ...mapState(["IsReportIssue","isShowNotice","isShowStory","isShowGuide","isShowInfo","isWelcomeRequest"]),
    issueDialogComp: {
      get() {
        return this.IsReportIssue;
      },
      set(value) {
        if (!value) {
          this.$store.dispatch("closeReportDialog");
        } else {
          this.$store.dispatch("enableReportDialog");
        }
      }
    },
    isShowInfoComp: {
      get() {
        return this.isShowInfo;
      },
      set(value) {
           this.$store.dispatch("InfoDialog",value);
      }
    },
    isShowStoryComp: {
      get() {
        return this.isShowStory;
      },
      set(value) {
            this.$store.dispatch("StoryDialog",value);
      }
    },
    isShowGuideComp: {
      get() {
        return this.isShowGuide;
      },
      set(value) {
         this.$store.dispatch("GuideDialog",value);
      }
    },
    isShowNoticeComp: {
      get() {
        return this.isShowNotice;
      },
      set(value) {
            this.$store.dispatch("NoticeDialog",value);
      }
    },
    isWelcomeAcceptedComp: {
       get() {
        return this.isWelcomeRequest;
      },
      set(value) {
            this.$store.dispatch("isWelcome",value);
      }
    }
  },
  methods: {
    CloseWelcome: function()
    {
     this.isWelcomeAcceptedComp = false;
     this.isShowNoticeComp = false;
    },
    CloseComic: function() {
      this.isComic1 = false;
      this.isComic2 = false;
    },
    submitReport: function() {
      if (this.$refs.issueForm.validate()) {
        this.showIssueLoader = true;
        Api.post("/api/movuee/submitIssue", {
          IssueType: this.IssueType,
          Description: this.IssueDescription
        })
          .then(response => {
            this.issueDialogComp = false;
            this.showIssueLoader = false;
            this.showReportStatus = true;
            this.reportMsg = response.data;
          })
          .catch(e => {
            this.issueDialogComp = false;
            //swallow it
          });
      }
    }
  },
  created() {}
};
</script>

<style>
</style>