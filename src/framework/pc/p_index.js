// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "../../router/pc/index";
import Element from "element-ui";
import TreeTable from "vue-table-with-tree-grid";
import { Button } from "mint-ui";

import axios from "axios";

// axios.defaults.baseURL = "http://192.168.0.63:8080/sfFinace/"; //本地地址
axios.defaults.baseURL = "http://221.11.70.78:8111/sfFinace/"; //服务器地址
Vue.prototype.$axios = axios;
import echarts from 'echarts'  //引入Echarts，

Vue.prototype.$echarts = echarts  //定义为全局变量
Vue.component("tree-table", TreeTable);

Vue.component(Button.name, Button);
Vue.use(Element);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: {
    App
  },
  template: "<App/>"
});
