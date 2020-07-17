<template>
  <div class="login">
    <section class="from_container">
      <div class="header">
        <span class="title">财务综合服务平台</span>
      </div>
      <div class="login_box">
        <el-form class="loginForm" :model="loginUser" ref="loginForm" :rules="loginRules" utocomplete="off">
          <el-form-item prop="username">
            <el-input v-model="loginUser.username" placeholder="请输入用户名" autocomplete="off">
              <i style="font-size: 18px; color: #409eff;" slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginUser.password" placeholder="请输入密码" type="password" autocomplete="new-password">
              <i style="font-size: 18px; color: #409eff;" slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <div class="remember">
            <input type="checkBox" name="adviceCheck" id="adviceCheck" :checked="pasChecked" @click="changeChecked" />
            <label for="adviceCheck" class="advice">下次自动登录</label>
          </div>
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
  </div>
</template>
<script>
  import jwt_decode from "jwt-decode";
  import tokenUtils from '../../../utils/cookieToken'
  export default {
    data() {
      return {
        pasChecked: false,
        emptel: '',
        loginUser: {
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
    mounted() {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('='); //再次切割
          //判断查找相对应的值
          if (arr2[0] == 'username') {
            this.loginUser.username = arr2[1]; //保存到保存数据的地方
          } else if (arr2[0] == 'password') {
            this.loginUser.password = arr2[1];
          }
        }
        this.submitForm()
      }
    },
    methods: {
      changeChecked() {
        this.pasChecked = !this.pasChecked;
      },
      async submitForm() {
        //保存的账号
        let name = this.loginUser.username;
        //保存的密码
        let pass = this.loginUser.password;
        //判断复选框是否被勾选 勾选则调用配置cookie方法
        if (this.pasChecked == true) {
          //传入账号名，密码，和保存天数3个参数
          tokenUtils.setCookie(name, pass, 7);
        } else {
          tokenUtils.clearCookie()
        }
        this.$refs.loginForm.validate(valid => {
          if (!valid) return this.$message.error("登录失败");
        });
        const {
          data: res
        } = await this.$axios.post("/admin/webLogin", {
          admin: [{
            ulogin: this.loginUser.username,
            upwd: this.loginUser.password,
            openid: this.loginUser.openid
          }]
        })
        let data = JSON.parse(res);
        console.log(data)
        if (data.retCode == 0) {
          this.emptel = data.user.admin[0].ulogin
          let tokenStr = data.tokenStr
          sessionStorage.setItem("token", data.tokenStr);
          this.getUloginName()
          this.$message.success('登录成功！')
        } else if (data.retCode == 1) {
          this.$message.error('用户名或密码错误！')
        }
      },
      resetForm() {
        this.loginUser.username = ''
        this.loginUser.password = ''
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
        let ulogin = data.empcard || 'admin'
        let empname = data.empname || 'admin'
        sessionStorage.setItem("ulogin", ulogin);
        sessionStorage.setItem("entname", empname);
        sessionStorage.setItem("userInfo", JSON.stringify(data));
        this.$router.push({
          path: "/"
        });
      }
    }
  };

</script>
<style scoped="scoped">
  .login {
    position: relative;
    width: 100vw;
    height: 100vh;
    min-height: 700px;
    background-image: url('../../assets/img/login_bg.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .footer {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 50px;
    font-size: 14px;
    color: #fff;
    opacity: .7;
    letter-spacing: 2px;
  }

  .from_container {
    position: absolute;
    width: 360px;
    top: 32%;
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
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    letter-spacing: 2px;
  }



  .el-input__inner {
    background-color: rgba(225, 225, 225, 0.2) !important;
  }

  .login_box .user {
    padding-top: 24px;
    margin-bottom: 14px;
    font-size: 20px;
    color: #333;
    letter-spacing: 3px;
  }

  .loginForm {
    padding: 20px;
    border-radius: 5px;
  }

  .submit_btn {
    width: 46%;
  }

  .go_register p {
    text-align: right;
    font-size: 12px;
    color: #333;
  }

  .go_register p a {
    color: #409eff;
  }

  .remember {
    text-align: left;
    color: #fff;
    font-size: 14px;
    margin-bottom: 16px;
  }

</style>
