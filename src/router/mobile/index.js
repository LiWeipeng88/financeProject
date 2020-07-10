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
import BorrowPage from "@/views/mobile/borrowViews/borrowPage.vue";
import HandBorrowPage from "@/views/mobile/borrowViews/handBorrowPage.vue";
import BorrowApplyPage from "@/views/mobile/borrowViews/borrowApplyPage.vue";
import LookBorrow from "@/views/mobile/borrowViews/lookBorrow.vue";
import DayPage from "@/views/mobile/dayViews/dayPage.vue";
import HandDayPage from "@/views/mobile/dayViews/handDayPage.vue";
import LookDay from "@/views/mobile/dayViews/lookDay.vue";
import DayApplyPage from "@/views/mobile/dayViews/dayApplyPage.vue";
import TravelPage from "@/views/mobile/travelViews/travelPage.vue";
import HandTravelPage from "@/views/mobile/travelViews/handtravelPage.vue";
import LookTravel from "@/views/mobile/travelViews/lookTravel.vue";
import TravelApplyPage from "@/views/mobile/travelViews/travelApplyPage.vue";

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
      redirect: "/Welcome",
      children: [
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
        // 差旅报销相关页面
        {
          path: "/expendTavel/queryPage",
          name: "TravelPage",
          component: TravelPage
        },
        {
          path: "/handTravelPage",
          name: "HandTravelPage",
          component: HandTravelPage
        },
        {
          path: "/travelApplyPage",
          name: "TravelApplyPage",
          component: TravelApplyPage
        },
        {
          path: "/lookTravel",
          name: "LookTravel",
          component: LookTravel
        },
        // 日常报销相关页面
        {
          path: "/expendDaily/queryPage",
          name: "DayPage",
          component: DayPage
        },
        {
          path: "/handDayPage",
          name: "HandDayPage",
          component: HandDayPage
        },
        {
          path: "/lookDay",
          name: "LookDay",
          component: LookDay
        },
        {
          path: "/dayApplyPage",
          name: "DayApplyPage",
          component: DayApplyPage
        },
        // 借款相关页面
        {
          path: "/expendLoan/queryPage",
          name: "BorrowPage",
          component: BorrowPage
        },
        {
          path: "/handBorrowPage",
          name: "HandBorrowPage",
          component: HandBorrowPage
        },
        {
          path: "/borrowApplyPage",
          name: "BorrowApplyPage",
          component: BorrowApplyPage
        },
        {
          path: "/lookBorrow",
          name: "LookBorrow",
          component: LookBorrow
        }
      ]
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
