<template>
  <div class="look_borrow">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销审批</el-breadcrumb-item>
      <el-breadcrumb-item>日常报销</el-breadcrumb-item>
      <el-breadcrumb-item>查看申请</el-breadcrumb-item>
    </el-breadcrumb>
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="基础信息" name="1">
        <div class="info">
          <div class="base_info">
            <div class="base_info_l">
              <p class="bianma">编码：{{editInfoForm.formcode}}</p>
              <p class="bianma">部门：{{editInfoForm.deptname}}</p>
              <p class="bianma">报销人：{{editInfoForm.createbyname}}</p>

            </div>
            <div class="base_info_r">
              <p class="bianma">名称：{{editInfoForm.protypename}}</p>
              <p class="bianma">金额：{{editInfoForm.paymoney}}</p>
              <p class="bianma">
                <span v-if="editInfoForm.isflag == 0">报销标识：办公业务</span>
                <span v-if="editInfoForm.isflag == 1">报销标识：教学业务</span>
                <span v-if="editInfoForm.isflag == 2">报销标识：学生业务</span>
                <span v-if="editInfoForm.isflag == 3">报销标识：科研业务</span>
              </p>
            </div>
          </div>
          <p class="bianma" style="margin-top: 0px;">时间：{{editInfoForm.createtime}}</p>

          <p class="bianma">内容摘要：{{editInfoForm.expendcontent}}</p>
          <p class="bianma">报销要求：{{editInfoForm.paydemand}}</p>
          <p class="bianma">报销描述：{{editInfoForm.dailydesc}}</p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="附件信息" name="2">
        <div style="display: flex; justify-content: space-between;">
          <div class="travel_box travel_box_img" v-for="item in dayfJlist">
            <a :href="imgURL + item.picpath" target="_block">
              <p>附件名称：{{item.recname}}(查看详情)</p>
            </a>
            <img :src="imgURL + item.picpath" alt="">
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="发票信息" name="3">
        <div style="display: flex; justify-content: space-between;">
          <div class="travel_box travel_box_img" v-for="item in dayFpList">
            <p>发票编码：{{item.receiptcode}}</p>
            <img :src="imgURL + item.picpath" alt="">
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="审批流程" name="4">
        <van-steps direction="vertical" :active="0">
          <van-step v-for="(item, index) in CommentLists" :key="index">
            <h3>【{{item.username}}】{{item.Message}}</h3>
            <p>{{item.endtime}}</p>
          </van-step>
        </van-steps>
      </van-collapse-item>
      <van-collapse-item title="付款凭证" name="5">
        <div style="display: flex; justify-content: space-between;">
          <div v-if="pzlist" class="travel_box travel_box_img" v-for="item in daypzlist">
            <img :src="imgURL + item.picpath" alt="">
          </div>
          <div style="padding: 1rem; text-align: center; width: 100%;">暂无数据</div>
        </div>
      </van-collapse-item>
    </van-collapse>
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
        editInfoForm: {},
        dayFpList: [],
        dayfJlist: [],
        daypzlist: [],
        // 发票上传地址
        imgURL: GLOBAL.imgURL,
        opinionForm: {
          opinion: ''
        },
        // 通过或者驳回参数
        expendDaily: {
          dailyid: '',
          taskID: '',
        },
        CommentLists: '',
      };
    },
    created() {
      this.expendDaily.dailyid = this.$route.query.id
      this.expendDaily.taskID = this.$route.query.taskID
      this.geteditInfoForm(this.expendDaily.dailyid)
      this.getFindCommentList(this.expendDaily.dailyid)
    },
    mounted() {

    },
    methods: {
      async geteditInfoForm(dailyid) {
        const {
          data: res
        } = await this.$axios.post('/expendDaily/queryOneDaily', {
          dailyid
        })
        if (res.length > 0) {
          const data = JSON.parse(res)
          console.log('办理按钮事件', data)
          this.editInfoForm = data.daily[0]
          this.dayFpList = data.fplist
          this.dayfJlist = data.fjlist
          this.daypzlist = data.pzlist
          console.log('editInfoForm', this.editInfoForm)
        } else {
          Notify({
            type: 'warning',
            message: '获取数据失败！'
          });
        }
      },
      // 查询审批意见
      async getFindCommentList(dailyid) {
        const {
          data: res
        } = await this.$axios.post('/expendDaily/findComment', {
          dailyid
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
