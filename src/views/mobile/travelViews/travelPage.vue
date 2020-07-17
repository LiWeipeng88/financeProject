<template>
  <div class="travel_page">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销审批</el-breadcrumb-item>
      <el-breadcrumb-item>差旅报销</el-breadcrumb-item>
    </el-breadcrumb>
    <van-tabs v-model="activeName">
      <!-- 已申请列表数据 -->
      <van-tab title="已申请列表" name="a">
        <div class="borrow_list">
          <div class="borrow_info" v-for="item in travelList">
            <div class="borrow_time">
              <span class="bianma">编码：{{item.formcode}}</span><span>时间：{{item.createtime}}</span>
            </div>
            <div class="pro_info">
              <span>部门：{{item.deptname}}</span><span>金额：{{item.paymoney}}元</span><span>报销人：{{item.createbyname}}</span>
            </div>
            <div class="borrow_time">
              <span>名称：{{item.protypename}}</span>
              <span>状态：
                <van-tag v-if="item.currentstep == 1" type="primary" size="small">流转中</van-tag>
                <van-tag type="warning" v-else size="small">待处理</van-tag>
              </span>
              <van-button type="info" :disabled="item.currentstep == 2 ? false :true " size="small"
                          @click='handleTravelBtn(item.travelid)'>提交</van-button>
            </div>
          </div>
        </div>
      </van-tab>
      <!-- 待办理列表数据 -->
      <van-tab title="待办理列表" name="b">
        <div class="borrow_list">
          <div class="borrow_info" v-for="item in approveDataList">
            <div class="borrow_time">
              <span class="bianma">编码：{{item.formcode}}</span><span>时间：{{item.createtime}}</span>
            </div>
            <div class="pro_info">
              <span>部门：{{item.deptname}}</span><span>金额：{{item.paymoney}}元</span><span>报销人：{{item.createbyname}}</span>
            </div>
            <div class="borrow_time">
              <span>名称：{{item.protypename}}</span><span>状态：<van-tag v-if="item.currentstep == 1" type="primary"
                         size="small">流转中</van-tag>
                <van-tag type="warning" v-else size="small">待处理</van-tag>
              </span>
              <van-button type="info" size="small" v-if="item.currentstep == 1"
                          @click="handleTravelApplyBtn(item.travelid,item.taskID)">办理
              </van-button>
              <van-button type="info" size="small" v-if="item.currentstep == 0" @click="editDayApplyBtn()">修改
              </van-button>
            </div>
          </div>
        </div>
      </van-tab>
      <!-- 已办理数据列表 -->
      <van-tab title="已办理列表" name="c">
        <div class="borrow_list">
          <div class="borrow_info" v-for="item in yesApproveDataList">
            <div class="borrow_time">
              <span class="bianma">编码：{{item.formcode}}</span><span>时间：{{item.createtime}}</span>
            </div>
            <div class="pro_info">
              <span>部门：{{item.deptname}}</span><span>金额：{{item.paymoney}}元</span><span>报销人：{{item.createbyname}}</span>
            </div>
            <div class="borrow_time">
              <span>名称：{{item.protypename}}</span><span>步骤：<van-tag type="warning">{{item.desc}}</van-tag></span>
              <van-button type="info" size="small" @click="lookInfoBtn(item.travelid)">查看</van-button>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        travelList: [],
        pagetotal: 0,
        approveDataList: [],
        approvepagetotal: 0,
        yesApproveDataList: [],
        yesApprovepagetotal: 0,
        pagenum: '0',
        activeName: 'a',
        has_log: 0,
        no_data: false,
      };
    },
    created() {
      // 获取已申请数据列表
      this.getTravelList()
      // 待办理列表数据获取
      this.getNoApproveList()
      // 已办理列表数据获取
      this.getYesApproveList()
    },
    mounted() {
      window.addEventListener('scroll', this.onScroll)
    },
    methods: {
      // 获取已申请数据列表
      async getTravelList() {
        let empcard = sessionStorage.getItem("ulogin");
        let pagenum = this.pagenum;
        const {
          data: res
        } = await this.$axios.post("/expendTravel/queryList", {
          empcard,
          pagenum
        });
        let travelData = JSON.parse(res)
        this.travelList = [...this.travelList, ...travelData.tralist];
        this.pagetotal = travelData.pagetotal;
        console.log('travelList', this.travelList);
      },
      // 待办理列表数据获取
      async getNoApproveList() {
        let empcard = sessionStorage.getItem("ulogin")
        let pagenum = this.pagenum;
        const {
          data: res
        } = await this.$axios.post('/expendTravel/queryWaitAudit', {
          empcard,
          pagenum
        })
        let approveData = JSON.parse(res)
        this.approveDataList = [...this.approveDataList, ...approveData.tralist]
        this.approvepagetotal = approveData.pagetotal
        console.log('getNoApproveList', this.approveDataList)
      },
      // 已办理列表数据获取
      async getYesApproveList() {
        let empcard = sessionStorage.getItem("ulogin")
        let pagenum = this.pagenum;
        const {
          data: res
        } = await this.$axios.post('/expendTravel/queryFinishAudit', {
          empcard,
          pagenum
        })
        let yesApproveData = JSON.parse(res)
        this.yesApproveDataList = [...this.yesApproveDataList, ...yesApproveData.tralist]
        this.yesApprovepagetotal = yesApproveData.pagetotal
        console.log('yesApproveDataList', this.yesApproveDataList)
      },
      // 提交按钮跳转事件
      handleTravelBtn(id) {
        this.$router.push({
          path: '/handTravelPage',
          query: {
            id: id
          }
        })
      },
      // 查看按钮跳转事件
      lookInfoBtn(id) {
        this.$router.push({
          path: '/lookTravel',
          query: {
            id: id
          }
        })
      },
      editDayApplyBtn() {
        let width = document.body.clientWidth
        if (width < 500) {
          Dialog.alert({
            title: '温馨提示',
            message: '因修改数据复杂，建议登录电脑端修改信息',
          })
        }
      },
      // 办理按钮跳转事件
      handleTravelApplyBtn(travelid, taskID) {
        this.$router.push({
          path: "/travelApplyPage",
          query: {
            travelid: travelid,
            taskID: taskID
          }
        })
      },
      onScroll() {
        this.has_log = 1
        let innerHeight = document.querySelector('#app').clientHeight
        let outerHeight = document.documentElement.clientHeight
        let scrollTop = document.documentElement.scrollTop
        let isCount = outerHeight + scrollTop
        if (isCount - innerHeight < 150) {
          if (this.no_data === true) {
            this.has_log = 2
            return false
          }
          console.log('-----------------')
          this.pagenum++
          this.getTravelList()
          // 待办理列表数据获取
          this.getNoApproveList()
          // 已办理列表数据获取
          this.getYesApproveList()
        }
      }
    }
  }

</script>

<style scoped>
  .travel_page {
    box-sizing: border-box;
  }


  .el-breadcrumb {
    padding: .875rem;
  }

  .borrow_list {
    padding: 0rem .625rem;
    font-size: .8125rem;
  }

  .borrow_info {
    margin: .875rem 0px;
    background-color: #fff;
    padding: .75rem;
    border-radius: .3125rem;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
  }

  .pro_info {
    margin-top: .25rem;
    padding: .75rem 0;
    display: flex;
    justify-content: space-between;
  }

  .pro_name {
    margin-left: 1.2rem;
  }

  .borrow_time {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

</style>
