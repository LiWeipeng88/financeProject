<template>
  <div class="manage">
    提交审核信息
    <van-form>
      <van-field v-model="username" name="用户名" label="用户名" placeholder="用户名" />
      <van-field readonly clickable name="picker" :value="value" label="选择器" placeholder="点击选择城市"
                 @click="showPicker = true" />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker show-toolbar :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
      </van-popup>
    </van-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        value: '',
        columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
        showPicker: false,
      };
    },
    created() {
      console.log(this.$route.query.id)
    },
    mounted() {

    },
    methods: {
      onConfirm(value) {
        this.value = value;
        this.showPicker = false;
      },
    },
  }

</script>

<style scoped>
  .manage {
    padding: 0.625rem;
  }

</style>
