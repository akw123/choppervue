<template>
  <div>
    <HelpDial ref="helpdial"/>
    <WelcomeDialog ref="welcomeDialog" @isAccepted="WelcomeAccepted"/>
    <ChopedStatus ref="chopeStatusCard" :refresh="IsRefreshChopedStatus"/>
    <MovieSection ref="movieSectionCard"/>
  </div>
</template>

<script>
import MovieSection from "@/components/MovieSection";
import ChopedStatus from "@/components/ChopedStatus";
import WelcomeDialog from "@/components/WelcomeDialog";
import HelpDial from "@/components/HelpDial";
import { mapState } from "vuex";
import Api from "@/services/Api";

export default {
  name: "Home",
  components: {
    MovieSection,
    ChopedStatus,
    WelcomeDialog,
    HelpDial
  },
  data() {
    return {
      isWelcomeAccepted: false,
      noticeDialog: false,
      subscriptionDevice: ""
    };
  },
  methods: {
    WelcomeAccepted: function() {
      Api.get("/api/movuee/accept");
      this.$store.dispatch("NoticeDialog",true);
      this.$store.dispatch("isWelcome",true);
    }
  },
  mounted() {
    const applicationServerPublicKey =
      "BNs3iEDxQRXlRCSXvqX0DICm_zEIswoROJJOoPaUkDftA6CPjbCjkNDjD6NEMHIejjtM3b4GepBIJmpEnjL6CCA";
    let isSubscribed = false;
    let swRegistration = null;
    var self = this;

    function urlB64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    function updateSubscriptionOnServer(subscription) {
      self.subscriptionDevice = JSON.stringify(subscription);
      console.log(self.subscriptionDevice);
      if (self.subscriptionDevice) {
        Api.post("/api/movuee/subscribe", subscription)
          .then(response => {})
          .catch(e => {});
      }
    }

    function subscribeUser() {
      const applicationServerKey = urlB64ToUint8Array(
        applicationServerPublicKey
      );
      swRegistration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        })
        .then(function(subscription) {
          console.log("User is subscribed.");
          updateSubscriptionOnServer(subscription);
          isSubscribed = true;
        })
        .catch(function(err) {
          console.log("Failed to subscribe the user: ", err);
        });
    }

    function unsubscribeUser() {
      swRegistration.pushManager
        .getSubscription()
        .then(function(subscription) {
          if (subscription) {
            return subscription.unsubscribe();
          }
        })
        .catch(function(error) {
          console.log("Error unsubscribing", error);
        })
        .then(function() {
          updateSubscriptionOnServer(null);
          console.log("User is unsubscribed.");
        });
    }

    function initializeUI() {
      swRegistration.pushManager.getSubscription().then(function(subscription) {
        isSubscribed = !(subscription === null);

        updateSubscriptionOnServer(subscription);

        if (isSubscribed) {
          console.log("User IS subscribed.");
        } else {
          subscribeUser();
          console.log("User is NOT subscribed.");
        }
      });
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      console.log("Service Worker and Push is supported");

      navigator.serviceWorker
        .register("/sw.js")
        .then(function(swReg) {
          console.log("Service Worker is registered", swReg);

          swRegistration = swReg;
          initializeUI();
        })
        .catch(function(error) {
          console.error("Service Worker Error", error);
        });
    } else {
      console.warn("Push messaging is not supported");
    }
  },
  computed: {
    ...mapState([
      "IsRefreshChopedStatus",
      "ActivePerformanceCode",
      "IsReportIssue",
      "IsNew"
    ])
  }
};
</script>

<style>
.v-speed-dial {
  position: absolute;
  z-index: 10;
}

.v-btn--floating {
  position: relative;
}
</style>