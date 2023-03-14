import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
const routers = []
const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [...routers],
});

export default router;
