<template>
  <div class="day_page">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销审批</el-breadcrumb-item>
      <el-breadcrumb-item>日常报销</el-breadcrumb-item>
    </el-breadcrumb>
    <van-tabs v-model="activeName">
      <!-- 已申请列表数据 -->
      <van-tab title="已申请列表" name="a">
        <div class="borrow_list" v-for="item in DayMoneyList">
          <div class="borrow_info">
            <span class="bianma">编码：{{item.formcode}}</span><span class="pro_name">名称：{{item.protypename}}</span>
            <div class="pro_info">
              <span>部门：{{item.deptid}}</span><span>金额：{{item.paymoney}}元</span><span>报销人：{{item.createbyname}}</span>
            </div>
            <div class="borrow_time">
              <span>时间：{{item.createtime}}</span><span>状态：
                <van-tag v-if="item.currentstep == 1" type="primary" size="small">流转中</van-tag>
                <van-tag type="warning" v-else size="small">待处理</van-tag>
              </span>
              <van-button type="info" :disabled="item.currentstep == 2 ? false :true " size="small"
                          @click='handleBorrowBtn(item.loanid)'>提交</van-button>
            </div>
          </div>
        </div>
      </van-tab>
      <!-- 待办理列表数据 -->
      <van-tab title="待办理列表" name="b">
        <div class="borrow_list" v-for="item in DayAppleWaitList">
          <div class="borrow_info">
            <span class="bianma">编码：{{item.formcode}}</span><span class="pro_name">名称：{{item.protypename}}</span>
            <div class="pro_info">
              <span>部门：{{item.deptid}}</span><span>金额：{{item.paymoney}}元</span><span>报销人：{{item.createbyname}}</span>
            </div>
            <div class="borrow_time">
              <span>时间：{{item.createtime}}</span><span>状态：<van-tag v-if="item.currentstep == 1" type="primary"
                         size="small">流转中</van-tag>
                <van-tag type="warning" v-else size="small">待处理</van-tag>
              </span>
              <van-button type="info" size="small" v-if="item.currentstep == 1"
                          @click="handleBorrowApplyBtn(item.Loanid,item.taskID)">办理
              </van-button>
              <van-button type="info" size="small" v-if="item.currentstep == 0"
                          @click="editBorrowApplyBtn(item.Loanid,item.taskID)">修改
              </van-button>
            </div>
          </div>
        </div>
      </van-tab>
      <!-- 已办理数据列表 -->
      <van-tab title="已办理列表" name="c">
        <div class="borrow_list" v-for="item in DayAppleFinishList">
          <div class="borrow_info">
            <span class="bianma">编码：{{item.formcode}}</span><span class="pro_name">名称：{{item.protypename}}</span>
            <div class="pro_info">
              <span>部门：{{item.deptid}}</span><span>金额：{{item.paymoney}}元</span><span>报销人：{{item.createbyname}}</span>
            </div>
            <div class="borrow_time">
              <span>时间：{{item.createtime}}</span><span>步骤：<van-tag type="warning">{{item.desc}}</van-tag></span>
              <van-button type="info" size="small" @click="lookInfoBtn(item.Loanid)">查看</van-button>
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
        pagenum: '0',
        DayMoneyList: [],
        pagetotal: 0,
        DayAppleWaitList: [],
        Waittotal: 0,
        DayAppleFinishList: [],
        Finishtotal: 0,
        activeName: 'a',
      };
    },
    created() {
      // 获取已申请数据列表
      this.getDayMoneyList()
      // 待办理列表数据获取
      this.getDayAppleWaitList()
      // 已办理列表数据获取
      this.getDayAppleFinishList()
    },
    mounted() {

    },
    methods: {
      // 获取已申请数据列表
      async getDayMoneyList() {
        let empcard = sessionStorage.getItem('ulogin')
        let pagenum = this.pagenum
        const {
          data: res
        } = await this.$axios.post('/expendDaily/queryList', {
          empcard,
          pagenum
        })
        if (res.length > 0) {
          let DayMoneyData = JSON.parse(res)
          this.DayMoneyList = DayMoneyData.dailylist
          this.pagetotal = DayMoneyData.pagetotal
          console.log(this.DayMoneyList);
        } else {
          this.$message.error('获取数据失败！');
        }
      },
      // 待办理列表数据获取
      async getDayAppleWaitList() {
        let empcard = sessionStorage.getItem('ulogin')
        let pagenum = this.pagenum
        const {
          data: res
        } = await this.$axios.post('/expendDaily/queryWaitAudit', {
          empcard,
          pagenum
        })
        if (res.length > 0) {
          let data = JSON.parse(res)
          this.DayAppleWaitList = data.dailylist
          this.Waittotal = data.pagetotal
        } else {
          this.$message.error('获取数据失败！');
        }
      },
      // 已办理列表数据获取
      async getDayAppleFinishList() {
        let empcard = sessionStorage.getItem('ulogin')
        let pagenum = this.pagenum
        const {
          data: res
        } = await this.$axios.post('/expendDaily/queryFinishAudit', {
          empcard,
          pagenum
        })
        if (res.length > 0) {
          let data = JSON.parse(res)
          this.DayAppleFinishList = data.dailylist
          this.Finishtotal = data.pagetotal
        } else {
          this.$message.error('获取数据失败！');
        }
      },
    },
  }

</script>

<style scoped>
  .day_page {
    box-sizing: border-box;
    background-color: #f6f7fb;
  }

  .top {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 9;
  }

  .el-breadcrumb {
    padding: .875rem;
  }

  .borrow_list {
    padding: 0rem .625rem;
    font-size: .875rem;
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
