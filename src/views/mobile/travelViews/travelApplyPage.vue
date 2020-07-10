<template>
  <div class="look_borrow">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销审批</el-breadcrumb-item>
      <el-breadcrumb-item>差旅报销</el-breadcrumb-item>
      <el-breadcrumb-item>审核办理</el-breadcrumb-item>
    </el-breadcrumb>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="基础信息" name="1">
        <div class="info">
          <div class="base_info">
            <div class="base_info_l">
              <p class="bianma">编码：{{travelData.formcode}}</p>
              <p class="bianma">部门：{{travelData.deptname}}</p>
              <p class="bianma">报销人：{{travelData.createbyname}}</p>

            </div>
            <div class="base_info_r">
              <p class="bianma">名称：{{travelData.protypename}}</p>
              <p class="bianma">金额：{{travelData.paymoney}}</p>
              <p class="bianma">
                <span v-if="travelData.isflag == 0">报销标识：办公业务</span>
                <span v-if="travelData.isflag == 1">报销标识：教学业务</span>
                <span v-if="travelData.isflag == 2">报销标识：学生业务</span>
                <span v-if="travelData.isflag == 3">报销标识：科研业务</span>
              </p>
            </div>
          </div>
          <p class="bianma" style="margin-top: 0px;">时间：{{travelData.createtime}}</p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="发票信息" name="2">
        <div
             style="display: flex; justify-content: space-between; border: 1px solid #ebedf0; padding: 0px 10px; margin: 10px 0px;">
          <div v-for="item in mxlistData">
            <p style="display: flex;"><span style="flex: 1;">费用类别：{{item.costtype}}</span><span
                    style="flex: 1;">报销类型：{{item.expendtype}}</span></p>
            <p style="display: flex;"><span style="flex: 1;">人数：{{item.expendnum}}</span><span
                    style="flex: 1;">天数：{{item.expendday}}</span></p>
            <p style="display: flex;"><span style="flex: 1;">费用标准：{{item.expendlevel}}</span><span
                    style="flex: 1;">报销金额：{{item.expendmoney}}</span></p>
            <div class="travel_box travel_box_img" v-for="i in item.expendReceiptlist">
              <p>发票编码：{{i.receiptcode}}</p>
              <img :src="imgURL + i.picpath" alt="">
            </div>
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
          <div v-if="pzlist" class="travel_box travel_box_img" v-for="item in pzlistData">
            <img :src="imgURL + item.picpath" alt="">
          </div>
          <div style="padding: 1rem; text-align: center; width: 100%;">暂无数据</div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="审批意见" name="5">
        <van-field v-model="opinionForm.opinion" placeholder="请输入审批意见" />
      </van-collapse-item>
    </van-collapse>
    <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
      <van-button @click="handleRejectBtn" type="default" size="small" style="margin-right: 1rem;">驳 回</van-button>
      <van-button @click="handlePassBtn" type="info" size="small"
                  style="background-color: #1989fa; border-color: #1989fa;">通 过</van-button>
    </div>
  </div>
</template>

<script>
  import {
    Toast,
    Notify
  } from 'vant';
  import GLOBAL from '../../../api/global_path'
  export default {
    data() {
      return {
        activeName: '1',
        travelData: {},
        mxlistData: [],
        fplistData: [],
        pzlistData: [],
        // 发票上传地址
        imgURL: GLOBAL.imgURL,
        opinionForm: {
          opinion: ''
        },
        // 通过或者驳回参数
        expendTravel: {
          traid: '',
          taskID: '',
        },
        CommentLists: '',
      };
    },
    created() {
      console.log(this.$route.query);
      this.expendTravel.traid = this.$route.query.travelid
      this.expendTravel.taskID = this.$route.query.taskID
      this.getTravelInfo(this.expendTravel.traid)
      this.getFindCommentList(this.expendTravel.traid)
    },
    mounted() {

    },
    methods: {
      async getTravelInfo(traid) {
        const {
          data: res
        } = await this.$axios.post('/expendTravel/queryOneTravel', {
          traid
        })
        if (res.length > 0) {
          console.log(JSON.parse(res))
          let transactData = JSON.parse(res)
          this.travelData = transactData.travel[0]
          this.mxlistData = transactData.mxlist
          this.fplistData = transactData.expendReceiptlist
          this.pzlistData = transactData.pzlist
        } else {
          Notify({
            type: 'warning',
            message: '获取数据失败！'
          });
        }
      },
      // 办理驳回事件
      async handleRejectBtn() {
        if (this.opinionForm.opinion.trim() === '') {
          return Toast({
            message: '请先填写审批意见！',
            icon: 'warning-o',
          });
        } else {
          let empcard = sessionStorage.getItem('ulogin')
          let expendTravel = [{
            traid: this.expendTravel.traid,
            taskID: this.expendTravel.taskID
          }]
          let opinion = this.opinionForm.opinion
          let agree = 1
          const {
            data: res
          } = await this.$axios.post('/expendTravel/webPassAudit', {
            empcard,
            expendTravel,
            agree,
            opinion
          })
          const resData = JSON.parse(res)
          if (resData.retCode == 0) {
            Toast({
              message: '审批办理已驳回！',
              icon: 'warning-o',
            })
            this.$router.push({
              path: '/expendTavel/queryPage'
            })
          } else {
            Toast({
              message: '审批办理失败，请重试！',
              icon: 'close',
            })
          }
        }
      },
      // 办理通过事件
      async handlePassBtn() {
        let empcard = sessionStorage.getItem('ulogin')
        let expendTravel = [{
          traid: this.expendTravel.traid,
          taskID: this.expendTravel.taskID
        }]
        let opinion = this.opinionForm.opinion
        let agree = 0
        const {
          data: res
        } = await this.$axios.post('/expendTravel/webPassAudit', {
          empcard,
          expendTravel,
          agree,
          opinion
        })
        const resData = JSON.parse(res)
        if (resData.retCode == 0) {
          Toast({
            message: '审批办理已通过！',
            icon: 'warning-o',
          })
          this.$router.push({
            path: '/expendTavel/queryPage'
          })
        } else {
          Toast({
            message: '审批办理失败，请重试！',
            icon: 'close',
          })
        }
        this.opinionForm.opinion = ''
      },
      // 查询审批意见
      async getFindCommentList(traid) {
        const {
          data: res
        } = await this.$axios.post('/expendTravel/findComment', {
          traid
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
