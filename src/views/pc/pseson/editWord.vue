<template>
  <div class="edit_word">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span='6' :offset="9">
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
            <el-form-item label="手机号：" prop="ulogin">
              <el-input v-model="editForm.ulogin" disabled></el-input>
            </el-form-item>
            <el-form-item label="旧密码：" prop="oldupwd">
              <el-input v-model="editForm.oldupwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="newupwd">
              <el-input v-model="editForm.newupwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="newupwd2">
              <el-input v-model="editForm.newupwd2" type="password"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="getEditWord">提交</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>

<script>
  import tokenUtils from '../../../../utils/cookieToken'
  export default {
    data() {
      return {
        editForm: {
          ulogin: '',
          oldupwd: '',
          newupwd: '',
          newupwd2: ''
        },
        editFormRules: {
          newupwd: [{
              required: true,
              message: '请输入新密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 16,
              message: '长度在 6 到 16 个字符',
              trigger: 'blur'
            }
          ],
          oldupwd: [{
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
          }],
          newupwd2: [{
            required: true,
            message: '请再次输入密码',
            trigger: 'blur'
          }],
        }
      };
    },
    created() {
      this.editForm.ulogin = sessionStorage.getItem('emptel')
    },
    mounted() {

    },
    methods: {
      getEditWord() {
        this.$refs.editFormRef.validate(async (valid) => {
          if (!valid) return this.$message.error('请先填写密码！')
          let ulogin = this.editForm.ulogin
          let oldupwd = this.editForm.oldupwd
          let newupwd = this.editForm.newupwd
          if (this.editForm.newupwd == this.editForm.newupwd2) {
            const res = await this.$axios.post('/admin/editpass', {
              ulogin,
              oldupwd,
              newupwd
            })
            console.log('---------------', res);
            const infoData = JSON.parse(res.data)
            if (infoData.retCode == 0) {
              this.$message.success('修改密码成功！')
              setTimeout(() => {
                // 清空token
                window.sessionStorage.clear()
                tokenUtils.clearCookie()
                // 跳转到登录页面
                this.$router.push('/login')
              }, 2000)
            }
            if (infoData.retCode == 1) {
              this.$message.error('旧密码错误！')
            }
            if (infoData.retCode == 2) {
              this.$message.error('修改密码失败！')
            }
          } else {
            this.$message.error('两次输入密码不一致！')
          }
        })

      },
      resetForm() {
        this.editForm.oldupwd = ''
        this.editForm.newupwd = ''
        this.editForm.newupwd2 = ''
        this.$refs.editFormRef.resetFields();
      }
    },
  }

</script>

<style scoped>
  .el-button {
    width: 47%;
  }

</style>
