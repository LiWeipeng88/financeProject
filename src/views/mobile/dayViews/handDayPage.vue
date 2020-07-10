<template>
  <div class="manage">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销审批</el-breadcrumb-item>
      <el-breadcrumb-item>日常报销</el-breadcrumb-item>
      <el-breadcrumb-item>提交审核</el-breadcrumb-item>
    </el-breadcrumb>

    <van-form style="margin-top: 1.25rem;">
      <van-field v-model="username" name="申请人" label="申请人" placeholder="申请人" />
      <van-field readonly clickable name="picker" :value="value" label="分管校长" placeholder="请选择分管校长"
                 @click="showPicker = true" />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker show-toolbar :columns="rectorNameList" @confirm="onConfirm" @cancel="showPicker = false" />
      </van-popup>
      <van-button class="handleInfoBtn" type="primary" size="small" @click="handleInfoBtn"
                  style="background-color: #1989fa; border-color:#1989fa;" :loading="isLoading">提交审核
      </van-button>
    </van-form>
  </div>
</template>

<script>
  import {
    Toast,
    Notify
  } from 'vant';
  export default {
    data() {
      return {
        isLoading: false,
        dailyid: '',
        username: '',
        value: '',
        fgxz: '',
        rectorList: [],
        rectorNameList: [],
        showPicker: false,
      };
    },
    created() {
      console.log(this.$route.query.id)
      this.dailyid = this.$route.query.id
      // 调用获取分管校长函数
      this.getRectorList()
      this.username = sessionStorage.getItem('entname')
    },
    mounted() {

    },
    methods: {
      onConfirm(value) {
        this.value = value;
        this.showPicker = false;

        let data = this.rectorList.filter(item => {
          return item.empname == value
        })
        this.fgxz = data[0].empid
        console.log(this.fgxz)
      },
      // 获取分管校长数据
      async getRectorList() {
        const {
          data: res
        } = await this.$axios.post('/employee/queryFg')
        this.rectorList = JSON.parse(res)
        this.rectorList.map(e => {
          this.rectorNameList.push(e.empname)
        })
      },
      async handleInfoBtn() {
        if (this.value === '') {
          Toast('请先选择分管校长！');
          return false;
        }
        this.isLoading = true
        let empcard = sessionStorage.getItem('ulogin')
        let dailyid = this.dailyid
        let fgxz = this.fgxz
        console.log(empcard, dailyid, fgxz)
        const {
          data: res
        } = await this.$axios.post('/expendDaily/submitReview', {
          dailyid,
          empcard,
          fgxz
        })
        let data = JSON.parse(res)
        if (data.retCode == '1') {
          this.isLoading = false
          Toast({
            message: '提交审核失败！',
            icon: 'close',
          });
        } else if (data.retCode == '0') {
          Toast({
            message: '申请成功，待部门审批！',
            icon: 'warning-o',
          })
          this.$router.push({
            path: '/expendDaily/queryPage'
          })
        } else if (data.retCode == '2') {
          this.isLoading = false
          Toast({
            message: '请先上传发票信息！',
            icon: 'close',
          });
        }
      }
    },
  }

</script>

<style scoped>
  .manage {
    padding: 0.625rem;
  }

  .handleInfoBtn {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

</style>
