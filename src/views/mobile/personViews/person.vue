<template>
  <div class="person">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>个人资料</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="person_head">
      <div class="person_bg">
        <div class="person_base">
          <img v-if="personInfo.signature" :src="personInfo.signature" alt="">
          <img v-else src="../../../assets/img/touxiang.jpg" alt="">
          <div class="base_info">
            <p><span>姓名：</span>{{personInfo.entname}}</p>
            <p><span>性别：</span>{{personInfo.empsex}}</p>
          </div>
        </div>
        <div class="edit_info" @click="editInfo">修改资料</div>
      </div>
      <div class="gong_tel">
        <div><span>电话</span>
          <p>{{personInfo.emptel}}</p>
        </div>
        <div><span>工号</span>
          <p>{{personInfo.empcode}}</p>
        </div>
      </div>
    </div>
    <div class="person_body">
      <ul>
        <li><span>部门：</span><span>{{personInfo.deptname}}</span></li>
        <li><span>职务：</span><span>{{personInfo.postname}}</span></li>
        <li><span>状态：</span>
          <span v-if="personInfo.state == 1">在职</span>
          <span v-else type="warning">离职</span>
        </li>
        <li><span>部门负责人：</span>
          <span v-if="personInfo.isflag == 1">是</span>
          <span v-else type="warning">否</span>
        </li>
        <li><span>学历：</span><span>{{personInfo.edubg}}</span></li>
        <li><span>学位：</span><span>{{personInfo.edudegree}}</span></li>
        <li><span>开户行：</span><span>{{personInfo.bankname}}</span></li>
        <li><span>银行卡号：</span><span>{{personInfo.bankcard}}</span></li>
        <li><span>身份证号：</span><span>{{personInfo.empcard}}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        personInfo: {}
      };
    },
    created() {
      let empcard = sessionStorage.getItem('ulogin')
      this.getPerson(empcard)
    },
    mounted() {

    },
    methods: {
      async getPerson(empcard) {
        const res = await this.$axios.post('/employee/queryEmpbycard', {
          empcard
        })
        if (res.status === 200) {
          this.personInfo = JSON.parse(res.data)
        } else {
          this.$message.error('获取数据失败！')
        }
        console.log(this.personInfo);
      },
      editInfo() {
        this.$router.push('/editInfo')
      }
    },
  }

</script>

<style scoped>
  .el-breadcrumb {
    padding: .875rem;
  }

  p {
    padding: 0;
    margin: 0;
  }

  .person_head {
    width: 95%;
    height: 10rem;
    margin: 0 auto;
    background: url('../../../assets/img/person_bg.png') no-repeat;
    background-size: 100% 100%;
    margin-top: 0.7rem;
    margin-bottom: 8px;
  }

  .person_bg {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    box-sizing: border-box;
  }

  .person_base {
    height: 3.125rem;
    display: flex;
    align-items: center;
  }

  .person_base img {
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 50%;
  }

  .base_info {
    margin-left: 1.125rem;
    color: #fff;
  }

  .base_info p {
    line-height: 1.8;
  }

  .edit_info {
    color: #fff;
  }

  .gong_tel {
    display: flex;
    justify-content: space-around;
    margin-top: .75rem;
  }

  .gong_tel div {
    font-size: 14px;
    color: #fff;
    text-align: center;
  }

  .gong_tel div p {
    margin-top: .625rem;
  }

  .person_body {
    border-top: 8px solid #f2f2f2;

  }

  .person_body ul {
    padding: 0px 1rem;
  }

  .person_body ul li {
    list-style: none;
    height: 2.75rem;
    line-height: 2.75rem;
    font-size: 16px;
    color: #545c64;
    border-bottom: 1px solid #f2f2f2;
  }

  .person_body ul li span {
    font-weight: bold;
  }

</style>
