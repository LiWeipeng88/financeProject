<template>
  <div class="look_borrow">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销审批</el-breadcrumb-item>
      <el-breadcrumb-item>借款</el-breadcrumb-item>
      <el-breadcrumb-item>查看申请</el-breadcrumb-item>
    </el-breadcrumb>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="基础信息" name="1">
        <div class="info">
          <div class="base_info">
            <div class="base_info_l">
              <p class="bianma">编码：{{applyInfo.formcode}}</p>
              <p class="bianma">部门：{{applyInfo.deptname}}</p>
              <p class="bianma">报销人：{{applyInfo.createbyname}}</p>
              <p class="bianma">
                <span v-if="applyInfo.loanusefor == 0">借款用途：差旅借款</span>
                <span v-else>借款用途：普通借款</span>
              </p>
              <p class="bianma">出差人数：{{applyInfo.tradays}}</p>
              <p class="bianma">
                <span v-if="applyInfo.isflag == 0">报销标识：办公业务</span>
                <span v-if="applyInfo.isflag == 1">报销标识：教学业务</span>
                <span v-if="applyInfo.isflag == 2">报销标识：学生业务</span>
                <span v-if="applyInfo.isflag == 3">报销标识：科研业务</span>
              </p>
              <p class="bianma">名称：{{applyInfo.payname}}</p>
            </div>
            <div class="base_info_r">
              <p class="bianma">名称：{{applyInfo.protypename}}</p>
              <p class="bianma">金额：{{applyInfo.loanpay}}</p>
              <p class="bianma">出差天数：{{applyInfo.tranum}}</p>
              <p class="bianma">地点：{{applyInfo.traadd}}</p>
              <p class="bianma">
                <span v-if="applyInfo.payway == 0">报销方式：对公</span>
                <span v-else>报销方式：对私</span>
              </p>
              <p class="payacc">卡号：{{applyInfo.traadd}}</p>
              <p class="bianma">开户行：{{applyInfo.paybank}}</p>
            </div>
          </div>
          <p class="bianma" style="margin-top: 0px;">时间：{{applyInfo.createtime}}</p>
          <p class="bianma">借款事由：{{applyInfo.loancause}}</p>
          <p class="bianma">备注：{{applyInfo.memo}}</p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="附件信息" name="2">
        <div style="display: flex; justify-content: space-between;">
          <div class="travel_box travel_box_img" v-for="item in fjlistL">
            <a :href="imgURL + item.picpath" target="_block">
              <p>附件名称：{{item.recname}}(查看详情)</p>
            </a>
            <img :src="imgURL + item.picpath" alt="">
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="审批流程" name="3">
        <van-steps direction="vertical" :active="0">
          <van-step v-for="(item, index) in CommentLists" :key="index">
            <h3>【{{item.username}}】{{item.Message}}</h3>
            <p>{{item.endtime}}</p>
          </van-step>
        </van-steps>
      </van-collapse-item>
      <van-collapse-item title="付款凭证" name="4">
        <div style="display: flex; justify-content: space-between;">
          <div v-if="pzlist" class="travel_box travel_box_img" v-for="item in pzlist">
            <img :src="imgURL + item.picpath" alt="">
          </div>
          <div style="padding: 1rem; text-align: center; width: 100%;">暂无数据</div>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
  import GLOBAL from '../../../api/global_path'
  export default {
    data() {
      return {
        activeName: '1',
        applyInfo: {},
        fjlistL: [],
        pzlist: [],
        // 发票上传地址
        imgURL: GLOBAL.imgURL,
        opinionForm: {
          opinion: ''
        },
        // 通过或者驳回参数
        expendLoan: {
          loanid: '',
          taskID: '',
        },
        CommentLists: '',
      };
    },
    created() {
      this.expendLoan.loanid = this.$route.query.id
      this.expendLoan.taskID = this.$route.query.taskID
      this.getApplyInfo(this.expendLoan.loanid)
      this.getFindCommentList(this.expendLoan.loanid)
    },
    mounted() {

    },
    methods: {
      async getApplyInfo(loanid) {
        const {
          data: res
        } = await this.$axios.post('/expendLoan/queryOneLoan', {
          loanid
        })
        const dataInfo = JSON.parse(res)
        this.applyInfo = dataInfo.loan[0]
        this.fjlistL = dataInfo.fjlist
        this.pzlist = dataInfo.pzlist
        console.log(dataInfo)
      },
      // 查询审批意见
      async getFindCommentList(loanid) {
        const {
          data: res
        } = await this.$axios.post('/expendLoan/findComment', {
          loanid
        })
        this.CommentLists = JSON.parse(res)
      },
    },
  }

</script>

<style scoped>
  .look_borrow {
    padding: 0.625rem;
  }

  .el-breadcrumb {
    margin-bottom: 1rem;
  }

  .info {
    font-size: .875rem;
  }

  .base_info {
    display: flex;

  }

  .base_info_l {
    flex: 1;
  }

  .base_info_r {
    flex: 1;
  }

  .handleInfoBtn {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

  a {
    color: #333;
    text-decoration: none;
  }

  .travel_box_img {
    width: 46%;
  }

  .travel_box_img img {
    width: 100%;
  }

</style>
