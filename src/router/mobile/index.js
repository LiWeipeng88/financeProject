import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/mobile/login";
import Register from "@/views/mobile/register";
import Home from "@/views/mobile/home.vue";
import Table from "@/views/mobile/table.vue";
import Everyday from "@/views/mobile/everyday.vue";
import Travel from "@/views/mobile/travel.vue";
import Borrow from "@/views/mobile/borrow.vue";
import Welcome from "@/views/mobile/welcome.vue";

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      redirect: "/Welcome"
    },
    {
      path: "/welcome",
      name: "welcome",
      component: Welcome
    },
    {
      path: "/table",
      name: "Table",
      component: Table
    },
    {
      path: "/expendTavel/queryPage",
      name: "Travel",
      component: Travel
    },
    {
      path: "/expendLoan/queryPage",
      name: "Borrow",
      component: Borrow
    },
    {
      path: "/expendDaily/queryPage",
      name: "Everyday",
      component: Everyday
    }
  ]
});

/**
 * 验证
 */
router.beforeEach((to, from, next) => {
  if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.location.href = "/p_index.html#/";
    return;
  }
  next();
});

export default router;
