import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);


const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [],
});

export default router;
