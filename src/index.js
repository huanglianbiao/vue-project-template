import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import "./plugins";
import "./assets/style/global.less";

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
