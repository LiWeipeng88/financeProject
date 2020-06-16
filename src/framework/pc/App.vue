<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App'
  }

</script>

<style>
  html,
  body {
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #app {
    width: 100%;
    height: 100%;
  }

  .el-breadcrumb {
    margin-bottom: 12px;
  }

  .el-pagination {
    margin-top: 20px;
  }

  .el-table--border {
    margin-top: 15px;
  }

</style>
