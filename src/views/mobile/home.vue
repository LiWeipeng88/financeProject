<template>
  <div class="home">
    <van-nav-bar title="财务综合服务平台" right-text="退出" @click-left="onClickLeft" @click-right="onClickRight">
      <van-icon name="wap-nav" slot="left" size="20" />
    </van-nav-bar>
    <van-popup v-model="show" position="left" :style="{ height: '100%', width:'50%'}">
      <div>
        <el-menu @open="handleOpen" :default-active="$router.path" router unique-opened background-color="#545c64"
                 text-color="#fff" active-text-color="#409eff">
          <el-submenu :index="item.pid" v-for="item in oneNavList" :key="item.pid">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              <span>{{item.pname}}</span>
            </template>
            <el-menu-item :index="item.purl" v-for="item in twoNavList" :key="item.pid">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{item.pname}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        emptel: '',
        activeNames: ['1'],
        show: false,
        popupVisible: false,
        oneNavList: [],
        twoNavList: [],
      }
    },
    created() {
      const emptel = window.sessionStorage.getItem('emptel')
      this.emptel = emptel
      this.getOneNavList()
    },
    methods: {
      onClickLeft() {
        console.log('按钮')
        this.show = true;
      },
      onClickRight() {
        // 清空token
        window.sessionStorage.clear()
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
        console.log(this.oneNavList)
      },
      // 点击一级菜单获取二级菜单
      async handleOpen(key) {
        const {
          data: res
        } = await this.$axios.post('/permission/getWebPermission', {
          ulogin: this.emptel,
          fpid: key
        })
        const data = JSON.parse(res)
        this.twoNavList = data.permissions
        console.log(this.twoNavList)
      },
    }
  }

</script>

<style scoped="scoped">
  .mint-header {
    font-size: 1rem;
  }

  .v-modal {
    opacity: 0 !important;
    z-index: 0 !important;
  }

  .mint-popup {
    top: 2.3rem;
    width: 100%;
    background-color: #26a2ff;
    color: #fff;
  }

  .nav_top {
    width: 100%;
    height: auto;
    padding: 0px 1.25rem;
  }

  .nav_top ul li {
    line-height: 2.5rem;
    font-size: 1rem;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .home_nav {
    padding: 0.625rem;
    font-size: 0.875rem;
  }

  .van-collapse-item__content {
    padding: 0rem 0.625rem !important;
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
