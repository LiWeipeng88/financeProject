<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
	body, html,ul, li{
		margin: 0;
		padding: 0;
    height: 100%;
	}
  #app{
    width: 100%;
    height: 100%;
  }
	ul, li{
		list-style: none;
    
	}
</style>
