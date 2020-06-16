import Vue from "vue";
import App from "./App";
import router from "../../router/mobile/index";
import Element from "element-ui";
import {
  Button,
  Search,
  Tabbar,
  TabItem,
  Header,
  Popup,
  IndexList,
  IndexSection,
  Cell
} from "mint-ui";

Vue.component(Button.name, Button);
Vue.component(Cell.name, Cell);
Vue.component(IndexList.name, IndexList);
Vue.component(IndexSection.name, IndexSection);
Vue.component(Popup.name, Popup);
Vue.component(Header.name, Header);
Vue.component(Search.name, Search);
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.use(Element);

import Vant from "vant";
import "vant/lib/index.css";

Vue.use(Vant);

import axios from "axios";
axios.defaults.baseURL = "http://192.168.0.63:8080/sfFinace/"; //本地地址
// axios.defaults.baseURL = "http://10.10.10.220:8111/sfFinace/"; //服务器地址
Vue.prototype.$axios = axios;

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
