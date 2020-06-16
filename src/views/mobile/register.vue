<template>
  <div class="register">
    <div class="form_container">
      <div class="header">
        <span>报销管理系统</span>
      </div>
      <el-form :model="registerForm" :rules="registerRules" ref="registerForm" label-width="70px" class="register_form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password1">
          <el-input v-model="registerForm.password1" type="password" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-select v-model="registerForm.admin" placeholder="请选择身份">
            <el-option label="管理员" value="admin"></el-option>
            <el-option label="普通人员" value="general"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="register_btn" @click="registerBtn()">立即注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      var validatepass = (rule, value, callback) => {
        if (value !== this.registerForm.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      }
      return {
        registerForm: {
          username: '',
          email: '',
          password: '',
          password1: '',
          admin: ''
        },
        registerRules: {
          username: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 5,
              message: '长度在 2 到 5 个字符',
              trigger: 'blur'
            }
          ],
          email: [{
              required: true,
              message: '请输入邮箱地址',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 16,
              message: '长度在 6 到 16 个字符',
              trigger: 'blur'
            }
          ],
          password1: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 16,
              message: '长度在 6 到 16 个字符',
              trigger: 'blur'
            }, {
              validator: validatepass,
              trigger: 'blur'
            }
          ],
        }
      }
    },
    methods: {
      registerBtn() {
        console.log('+++++++')
      }
    }
  }
</script>

<style scoped="scoped">
  .register {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login_bg.jpg);
  }

  .form_container {
    position: absolute;
    width: 100%;
    top: 10%;
    height: auto;
    padding: 0px 40px;
    box-sizing: border-box;
  }

  .form_container .header span {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    font-family: "microsoft yahei"
  }
  .register_form{
    margin-top: 20px;
    background-color: #fff;
    opacity: 1;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
  }
  .register_btn{
    width: 100%;
  }
</style>
