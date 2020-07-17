<template>
  <div>
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb> -->
    <van-form>
      <van-field disabled v-model="ulogin" name="手机号" label="手机号：" placeholder="请填写手机号"
                 :rules="[{ required: true, message: '请填写手机号' }]" />
      <van-field v-model="oldupwd" type="password" name="旧密码" label="旧密码" placeholder="请填写旧密码"
                 :rules="[{ required: true, message: '请填写密码' }]" />
      <van-field v-model="newupwd" type="password" name="新密码" label="新密码" placeholder="请填写新密码"
                 :rules="[{validator, required: true, message: '请输入6到16为字符的正确密码' }]" />
      <van-field v-model="newupwd2" type="password" name="确认密码" label="确认密码" placeholder="请再次填写密码"
                 :rules="[{editpass, required: true, message: '请输入6到16为字符的正确密码' }]" />
      <div style="margin: 16px;">
        <van-row gutter="40">
          <van-col span="8" offset="4">
            <van-button round block type="primary" size="normal" @click="getEditWord"
                        style="background-color: #1989fa; border-color:#1989fa;">
              提交
            </van-button>
          </van-col>
          <van-col span="8">
            <van-button @click="resetForm" round block plain hairline style="border-color:#545c64;">
              重置
            </van-button>
          </van-col>
        </van-row>
      </div>
    </van-form>
  </div>
</template>

<script>
  import {
    Toast,
    Notify
  } from 'vant';
  import tokenUtils from '../../../../utils/cookieToken'
  export default {
    data() {
      return {
        ulogin: '',
        oldupwd: '',
        newupwd: '',
        newupwd2: ''
      };
    },
    created() {
      this.ulogin = sessionStorage.getItem('emptel')
    },
    mounted() {

    },
    methods: {
      validator(val) {
        return /^\w{6,16}$/.test(val);
      },
      editpass(val) {
        return /^\w{6,16}$/.test(val);
      },
      async getEditWord() {
        if (this.oldupwd === '' || this.newupwd === '' || this.newupwd2 === '') return Toast({
          message: '请先填写密码！',
          icon: 'close',
        })
        let ulogin = this.ulogin
        let oldupwd = this.oldupwd
        let newupwd = this.newupwd
        if (newupwd == this.newupwd2) {
          const res = await this.$axios.post('/admin/editpass', {
            ulogin,
            oldupwd,
            newupwd
          })
          console.log('---------------', res);
          const infoData = JSON.parse(res.data)
          if (infoData.retCode == 0) {
            Toast({
              message: '修改密码成功！',
              icon: 'warning-o',
            })
            setTimeout(() => {
              // 清空token
              window.sessionStorage.clear()
              tokenUtils.clearCookie()
              // 跳转到登录页面
              this.$router.push('/')
            }, 2000)
          }
          if (infoData.retCode == 1) {
            Toast({
              message: '旧密码错误！',
              icon: 'close',
            })
          }
          if (infoData.retCode == 2) {
            Toast({
              message: '修改密码失败！',
              icon: 'close',
            })
          }
        } else {
          Toast({
            message: '两次输入密码不一致!',
            icon: 'close',
          })
        }
      },
      resetForm() {
        this.oldupwd = ''
        this.newupwd = ''
        this.newupwd2 = ''
      }
    },
  }

</script>

<style scoped>
  .el-breadcrumb {
    padding: .875rem;
  }

</style>
