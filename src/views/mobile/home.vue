<template>
  <div class="home">
    <van-nav-bar title="财务综合服务平台" right-text="退出" @click-left="onClickLeft" @click-right="onClickRight">
      <van-icon name="wap-nav" slot="left" size="20" />
    </van-nav-bar>
    <van-popup v-model="show" position="left" :style="{ height: '100%', width:'50%'}">
      <div>
        <el-menu @open="handleOpen" :default-active="$router.path" router unique-opened background-color="#545c64"
                 text-color="#fff" active-text-color="#409eff">
          <el-submenu :index="item.pid" v-for="(item, index) in oneNavList" :key="item.pid">
            <template slot="title">
              <i :class="iconList[index]"></i>
              <span>{{item.pname}}</span>
            </template>
            <el-menu-item @click="handleNavBtn" :index="item.purl" v-for="item in twoNavList" :key="item.pid">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.pname}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </van-popup>
    <router-view class="content"></router-view>
    <!-- <van-tabbar v-model="active" active-color="#545c64" inactive-color="#545c64">
      <router-link to="/Welcome" tag="van-tabbar-item">
        <van-tabbar-item icon="wap-home">平台首页</van-tabbar-item>
      </router-link>
      <router-link to="/person" tag="van-tabbar-item">
        <van-tabbar-item icon="friends">个人中心</van-tabbar-item>
      </router-link>
    </van-tabbar> -->
  </div>
</template>

<script>
  import tokenUtils from '../../../utils/cookieToken'
  export default {
    data() {
      return {
        active: '/Welcome',
        emptel: '',
        show: false,
        popupVisible: false,
        oneNavList: [],
        twoNavList: [],
        iconList: ['el-icon-s-tools', 'el-icon-info', 'el-icon-s-order', 'el-icon-s-claim']
      }
    },
    created() {

      const emptel = window.sessionStorage.getItem('emptel')
      this.emptel = emptel
      this.getOneNavList()
    },
    mounted() {},
    methods: {
      onClickLeft() {
        console.log('按钮')
        this.show = true;
      },
      onClickRight() {
        // 清空token
        window.sessionStorage.clear()
        tokenUtils.clearCookie()
        // 跳转到登录页面
        this.$router.push('/')
      },
      // 获取左侧菜单列表
      async getOneNavList() {
        const {
          data: res
        } = await this.$axios.post('/permission/getWebPermission', {
          ulogin: this.emptel,
          fpid: ''
        })
        const data = JSON.parse(res)
        this.oneNavList = data.permissions
      },
      // 点击一级菜单获取二级菜单
      async handleOpen(key) {
        this.twoNavList = {};
        const {
          data: res
        } = await this.$axios.post('/permission/getWebPermission', {
          ulogin: this.emptel,
          fpid: key
        })
        const data = JSON.parse(res)
        this.twoNavList = data.permissions
      },
      handleNavBtn() {
        this.show = false;
      },
    }
  }

</script>

<style scoped="scoped">
  .van-nav-bar {
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 9;
    height: 2.875rem;
  }

  .home {
    padding-top: 2.875rem;
    height: calc(100vh - 2.875rem);
  }

  .home_nav {
    padding: 0.625rem;
    font-size: 0.875rem;
  }

  .van-popup--left {
    background-color: #545c64;
  }

  .el-menu {
    border: 0rem
  }

  .van-nav-bar {
    background-color: #545c64;
  }

  .van-nav-bar__text {
    color: #fff !important;
  }

</style>
