<template>
  <div class="login">
    <section class="from_container">
      <div class="header">
        <span class="title">财务综合服务平台</span>
      </div>
      <div class="login_box">
        <el-form class="loginForm" :model="loginForm" ref="loginForm" :rules="loginRules" utocomplete="off">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" autocomplete="off">
              <i style="font-size: 1.125rem; color: #409eff;" slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" autocomplete="new-password">
              <i style="font-size: 1.125rem; color: #409eff;" slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="resetForm" class="submit_btn" round>重置</el-button>
            <el-button type="primary" @click="submitForm" class="submit_btn" round>登录</el-button>
          </el-form-item>
          <!-- <div class="go_register">
            <p>
              还没有账号？现在
              <router-link to="/register">注册</router-link>
            </p>
          </div> -->
        </el-form>
      </div>
    </section>
    <div class="footer">西安纳学电子科技有限责任公司 @2020-6</div>
    <!-- <mt-button type="danger">danger</mt-button>
    <el-button type="info">信息按钮</el-button> -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        emptel: '',
        loginForm: {
          username: "",
          password: "",
          openid: ""
        },
        loginRules: {
          username: [{
              required: true,
              message: "请输入用户名",
              trigger: "blur"
            },
            {
              min: 2,
              max: 20,
              message: "长度在 3 到 20 个字符",
              trigger: "blur"
            }
          ],
          password: [{
              required: true,
              message: "请输入密码",
              trigger: "blur"
            },
            {
              min: 3,
              max: 16,
              message: "长度在 3 到 16 个字符",
              trigger: "blur"
            }
          ]
        }
      };
    },
    methods: {
      async submitForm() {
        this.$refs.loginForm.validate(valid => {
          if (!valid) return this.$message.error("登录失败");
        });
        console.log(this.loginForm);
        const {
          data: res
        } = await this.$axios
          .post("/admin/webLogin", {
            admin: [{
              ulogin: this.loginForm.username,
              upwd: this.loginForm.password,
              openid: this.loginForm.openid
            }]
          })
        let data = JSON.parse(res);

        console.log(data)
        if (data.retCode == 0) {
          this.emptel = data.user.admin[0].ulogin
          let tokenStr = data.tokenStr
          sessionStorage.setItem("token", data.tokenStr);

          this.getUloginName()
        }
      },
      resetForm() {
        this.loginForm.username = ''
        this.loginForm.password = ''
      },
      async getUloginName() {

        let emptel = this.emptel
        sessionStorage.setItem("emptel", emptel);
        const {
          data: res
        } = await this.$axios.post('/employee/queryEmpByTel', {
          emptel
        })
        let data = JSON.parse(res);
        let ulogin = data.empcard
        let empname = data.empname
        sessionStorage.setItem("ulogin", ulogin);
        sessionStorage.setItem("entname", empname);
        sessionStorage.setItem("userInfo", JSON.stringify(data));
        this.$router.push({
          path: "/home"
        });
      }
    }
  };

</script>

<style scoped="scoped">
  .login {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url('../../assets/img/login_bg.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .footer {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 3.125rem;
    font-size: 0.875rem;
    color: #fff;
    opacity: .7;
    letter-spacing: 0.0625rem;
  }

  .from_container {
    position: absolute;
    width: 360px;
    top: 20%;
    left: calc(50% - 180px);
    text-align: center;
    border-radius: 10px;
    background-color: rgba(225, 225, 225, 0.22);
  }

  .from_container .header {
    padding: 24px 0;
  }

  .from_container .header .title {
    font-family: "microsoft yahei";
    font-size: 1.625rem;
    font-weight: bold;
    color: #fff;
    letter-spacing: 0.0625rem;
  }


  .el-input__inner {
    background-color: rgba(225, 225, 225, 0.2) !important;
  }

  .login_box .user {
    padding-top: 1.5rem;
    margin-bottom: 0.875rem;
    font-size: 1.25rem;
    color: #333;
    letter-spacing: 0.125rem;
  }

  .loginForm {
    padding: 1.25rem;
    border-radius: 0.3125rem;
  }

  .submit_btn {
    width: 46%;
  }

  .go_register p {
    text-align: right;
    font-size: 0.75rem;
    color: #333;
  }

  .go_register p a {
    color: #409eff;
  }

</style>
