<template>
  <div>
    <topHome></topHome>
    <div class="come_box">
      欢迎进入财务管理系统：{{loginName}}
    </div>
  </div>
</template>
<script>
  import top_home from './home.vue'
  export default {
    data() {
      return {
        loginName: ''
      }
    },
    components: {
      topHome: top_home
    },
    created() {
      this.loginName = JSON.parse(window.sessionStorage.getItem('userInfo')).empname
    },
  }

</script>
<style scope>
  .come_box {
    padding: 16px;
  }

</style>
