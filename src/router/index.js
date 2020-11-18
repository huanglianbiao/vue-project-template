import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: () => import(/* webpackChunkName: "route-index" */ "@views/index"),
      redirect: "overview",
      children: [
        {
          path: "overview",
          name: "overview",
          component: () => import(/* webpackChunkName: "route-overview" */ "@views/Overview")
        },
        {
          path: "data",
          name: "data",
          component: () => import(/* webpackChunkName: "route-data" */ "@views/Data")
        },
        {
          path: "self",
          name: "self",
          component: () => import(/* webpackChunkName: "route-self" */ "@views/Self")
        }
      ]
    }
  ]
});
