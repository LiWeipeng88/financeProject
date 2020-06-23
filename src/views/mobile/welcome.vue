<template>
  <div>
    <div class="come_box">
      欢迎进入财务管理系统：{{loginName}}
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loginName: ''
      }
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
