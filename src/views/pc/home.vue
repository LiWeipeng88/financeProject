<template>
  <div class="home">
    <el-header>
      <div class="logo">
        <span>财务综合服务平台</span>
      </div>
      <div class="login_out">
        <span style="color: #fff; margin-right: 16px; font-size: 14px;">欢迎进入平台：{{loginName}}</span>
        <el-button type="info" @click="loginOut">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-col :span="12">
          <el-menu @open="handleOpen" :default-active="$router.path" router unique-opened background-color="#545c64"
                   text-color="#fff" active-text-color="#409eff">
            <el-submenu :index="item.pid" v-for="(item, index) in oneNavList" :key="item.pid">
              <template slot="title">
                <i :class="iconList[index]"></i>
                <span>{{item.pname}}</span>
              </template>
              <el-menu-item :index="item.purl" v-for="item in twoNavList" :key="item.pid">
                <template slot="title">
                  <i class="el-icon-s-operation"></i>
                  <span>{{item.pname}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        emptel: '',
        pid: '',
        oneNavList: [],
        twoNavList: [],
        loginName: '',
        iconList: ['el-icon-s-tools', 'el-icon-info', 'el-icon-s-order', 'el-icon-s-claim']
      }
    },
    created() {
      this.loginName = JSON.parse(window.sessionStorage.getItem('userInfo')).empname || 'admin'
      const emptel = window.sessionStorage.getItem('emptel')
      this.emptel = emptel
      this.getOneNavList()
    },
    mounted() {

    },
    methods: {
      // 个人中心
      personal() {
        this.$router.push('/personal')
      },
      // 退出登录
      loginOut() {
        // 清空token
        window.sessionStorage.clear()
        // 跳转到登录页面
        this.$router.push('/login')
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
    }
  }

</script>

<style scoped="scoped">
  .home {
    height: calc(100vh - 60px)
  }

  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
    padding: 0px 20px;
  }

  .el-header .logo {
    color: #fff;
    font-size: 24px;
    font-weight: bold;
  }

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-container {
    height: 100%;
  }

  .el-aside {
    width: 100%;
    height: 100%;
  }

  .el-menu {
    border-right: 0px;
  }

  .tac {
    width: 100%;
    height: 100%;
  }

  .el-row {
    width: 100%;
    height: 100%;
  }

  .el-col {
    width: 100%;
    height: 100%;
  }

  .el-menu {
    height: 100%;
  }

  .el-breadcrumb {
    padding: 10px 0px;
    margin-bottom: 10px;
  }

  .el-pagination {
    margin-top: 20px;
    text-align: right;
  }

  .el-dropdown {
    color: #fff;
  }

</style>
