import axios from "axios";
import configJson from "@/config.json";
import router from "@/router";
import store from "@/store";

var http = axios.create({
  baseURL: configJson.MovueAPI
});

http.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
http.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    const {
      config,
      response: { status }
    } = error;
    const originalRequest = config;

    if (status === 401) {
      store.dispatch("removeUser");
      router.push("/login");
    }

    return Promise.reject(error);
  }
);

export default http;
