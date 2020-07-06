import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/pc/login";
import Register from "@/views/pc/register";
import Home from "@/views/pc/home";
import RenshiList from "@/views/pc/renshiList";
import Welcome from "@/views/pc/welcome";
import DepartmentList from "@/views/pc/departmentList";
import DutyList from "@/views/pc/dutyList";
import ProjectList from "@/views/pc/projectList";
import Chuchai from "@/views/pc/chuchai";
import BorrowMoney from "@/views/pc/borrowMoney";
import Workflow from "@/views/pc/workflow";
import Everyday from "@/views/pc/everyday";
import CondSearch from "@/views/pc/condSearch";
import RoleAdmin from "@/views/pc/roleAdmin";
import UserAdmin from "@/views/pc/userAdmin";
import Banner from "@/views/pc/banner";
import DayApply from "@/views/pc/dayApply";
import BorrowApply from "@/views/pc/borrowApply";
import TravelApply from "@/views/pc/travelApply";
import EditDay from "@/views/pc/editDay";
import EditBorrow from "@/views/pc/editBorrow";
import EditTravel from "@/views/pc/editTravel";
import All from "@/views/pc/all";

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/login",
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
      component: Home,
      redirect: "/welcome",
      children: [
        {
          path: "/expendTavel/queryPage", //差旅报销
          component: Chuchai
        },
        {
          path: "/expendTavel/travelApply",
          component: TravelApply
        },
        {
          path: "/expendTavel/editTravel",
          component: EditTravel
        },
        {
          path: "/flowpost/queryPage", //流程设置
          component: Workflow
        },
        {
          path: "/expendLoan/queryPage", //  借款报销
          component: BorrowMoney
        },
        {
          path: "/expendLoan/borrowApply", //  借款报销申请界面
          component: BorrowApply
        },
        {
          path: "/expendLoan/editBorrow", //  借款申请驳回修改
          component: EditBorrow
        },
        {
          path: "/expendDaily/queryPage", //  日常报销
          component: Everyday
        },
        {
          path: "/expendDaily/dayApply", //  日常报销申请界面
          component: DayApply
        },
        {
          path: "/expendDaily/editDay", //日常报销驳回修改
          component: EditDay
        },
        {
          path: "/welcome",
          component: Welcome
        },
        {
          path: "/employee/queryPage", //人事管理
          component: RenshiList
        },
        {
          path: "/department/queryListall", //部门管理
          component: DepartmentList
        },
        {
          path: "/jobpost/queryPage", //职务管理
          component: DutyList
        },
        {
          path: "/projectType/listAllPro", //项目管理
          component: ProjectList
        },
        {
          path: "/condSearch",
          component: CondSearch
        },
        {
          path: "/role/queryPage",
          component: RoleAdmin
        },
        {
          path: "/admin/queryPage",
          component: UserAdmin
        },
        {
          path: "/banner/queryPage",
          component: Banner
        }
      ]
    },
    {
      path: "*",
      name: "all",
      component: All
    }
  ]
});

// 为路由对象添加 beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页面，直接放行
  if (to.path === "/login") return next();
  // 从 sessionStorage 中获取到保存的 token 值
  const tokenStr = window.sessionStorage.getItem("token");
  // 如果没有 token 强制跳转到登录页面
  if (!tokenStr) return next("/login");
  // 如果有 token 直接放行
  next();
});

/**
 * 判断是否为移动设备，是，则跳转到移动端的路径
 */
router.beforeEach((to, from, next) => {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.location.href = "/m_index.html#/";
    return;
  }
  next();
});

export default router;
