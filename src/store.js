import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    IsRefreshChopedStatus: false,
    userName: "",
    ActivePerformanceCode: "",
    isShowNotice: false,
    isShowStory: false,
    isShowGuide: false,
    isShowInfo: false,
    isWelcomeRequest: false,
    IsNew: false,
    IsReportIssue: false
  },
  actions: {
    refreshChopedStatusCard(context) {
      context.commit("refreshChopedStatusCard");
    },
    NoticeDialog(context, isOpen) {
      context.commit("NoticeDialog", isOpen);
    },
    StoryDialog(context, isOpen) {
      context.commit("StoryDialog", isOpen);
    },
    GuideDialog(context, isOpen) {
      context.commit("GuideDialog", isOpen);
    },
    InfoDialog(context, isOpen) {
      context.commit("InfoDialog", isOpen);
    },
    isWelcome(context, isOpen) {
      context.commit("isWelcome", isOpen);
    },
    resetChopedStatusCard(context) {
      context.commit("resetChopedStatusCard");
    },
    setUser(context) {
      context.commit("setUser", localStorage.getItem("user"));
    },
    removeUser(context) {
      context.commit("removeUser");
    },
    setActivePerformanceCode(context, perfcode) {
      context.commit("setActivePerformanceCode", perfcode);
    },
    setIsNew(context, isN) {
      context.commit("setIsNew", isN);
    },
    removeActivePerformanceCode(context) {
      context.commit("removeActivePerformanceCode");
    },
    enableReportDialog(context) {
      context.commit("enableReportDialog");
    },
    closeReportDialog(context) {
      context.commit("closeReportDialog");
    }
  },

  getters: {
    IsRefreshChopedStatus: function(state) {
      return state.IsRefreshChopedStatus;
    },
    UserName: function(state) {
      return state.userName;
    },
    ActivePerformanceCode: function(state) {
      return state.ActivePerformanceCode;
    },
    isShowNotice: function(state) {
      return state.isShowNotice;
    },
    isShowGuide: function(state) {
      return state.isShowGuide;
    },
    isShowInfo: function(state) {
      return state.isShowInfo;
    },
    isShowStory: function(state) {
      return state.isShowStory;
    },
    isWelcomeRequest: function(state) {
      return state.isWelcomeRequest;
    },
    IsNew: function(state) {
      return state.IsNew;
    },
    IsReportIssue: function(state) {
      return state.IsReportIssue;
    }
  },

  mutations: {
    refreshChopedStatusCard(state) {
      state.IsRefreshChopedStatus = true;
    },
    NoticeDialog(state, isOpen) {
      state.isShowNotice = isOpen;
    },
    StoryDialog(state, isOpen) {
      state.isShowStory = isOpen;
    },
    GuideDialog(state, isOpen) {
      state.isShowGuide = isOpen;
    },
    InfoDialog(state, isOpen) {
      state.isShowInfo = isOpen;
    },
    isWelcome(state, isOpen) {
      state.isWelcomeRequest = isOpen;
    },
    resetChopedStatusCard(state) {
      state.IsRefreshChopedStatus = false;
    },
    setUser(state, username) {
      state.userName = username;
    },
    setIsNew(state, isN) {
      state.IsNew = isN;
    },
    setActivePerformanceCode(state, perfCode) {
      state.ActivePerformanceCode = perfCode;
    },
    removeActivePerformanceCode(state) {
      state.ActivePerformanceCode = "";
    },
    removeUser(state) {
      state.userName = "";
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
    },
    enableReportDialog(state) {
      state.IsReportIssue = true;
    },
    closeReportDialog(state) {
      state.IsReportIssue = false;
    }
  }
});
