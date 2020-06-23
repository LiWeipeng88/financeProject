<template>
  <div class="borrow">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销审批</el-breadcrumb-item>
      <el-breadcrumb-item>借款</el-breadcrumb-item>
    </el-breadcrumb>
    <van-tabs v-model="activeName">
      <van-tab title="已申请列表" name="a">
        <div class="borrow_list" v-for="item in borrowMoneList">
          <div class="borrow_info">
            <span class="bianma">编码：{{item.formcode}}</span><span class="pro_name">名称：{{item.protypeid}}</span>
            <div class="pro_info">
              <span>部门：{{item.deptname}}</span><span>金额：{{item.loanpay}}元</span><span>报销人：{{item.createbyname}}</span>
            </div>
            <div class="borrow_time">
              <span>时间：{{item.expecttime}}</span><span>状态：
                <van-tag v-if="item.currentstep == 1" type="info" size="small">流转中</van-tag>
                <van-tag type="warning" v-else size="small">待处理</van-tag>
              </span>
              <van-button type="info" size="small" @click='handleBorrowBtn(item.loanid)'>提交</van-button>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="待办理列表" name="b">
        <div class="borrow_list" v-for="item in 10">
          <div class="borrow_info">
            <span class="bianma">编码：202061801</span><span class="pro_name">名称：公司项目出差</span>
            <div class="pro_info">
              <span>部门：技术部</span><span>金额：10000元</span><span>报销人：研发部</span>
            </div>
            <div class="borrow_time">
              <span>时间：2020-06-18</span><span>状态：<van-tag type="warning">已审批</van-tag></span>
              <van-button type="info" size="small">办理</van-button>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="已办理列表" name="c">
        <div class="borrow_list" v-for="item in 10">
          <div class="borrow_info">
            <span class="bianma">编码：202061801</span><span class="pro_name">名称：公司项目出差</span>
            <div class="pro_info">
              <span>部门：研发部</span><span>金额：1000元</span><span>报销人：研发部</span>
            </div>
            <div class="borrow_time">
              <span>时间：2020-06-18</span><span>状态：<van-tag type="warning">待审批</van-tag></span>
              <van-button type="info" size="small">查看</van-button>
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
        activeName: 'a',
        // 已申请列表数据
        borrowMoneList: [],
        // 请求页码
        pagenum: 0,
        // 待办理列表数据
        BorrowMoneWaitList: [],
        // 已办理数据列表
        BorrowMoneFinishList: [],
      }
    },
    created() {
      // 调用获取已申请列表数据
      this.getBorrowMoneyList()
      // 调用获取待办理列表数据
      this.getBorrowMoneWaitList()
      // 调用获取已办理列表数据
      this.getBorrowMoneFinishList()
    },
    methods: {
      // 获取已申请数据列表
      async getBorrowMoneyList() {
        let empcard = sessionStorage.getItem('ulogin')
        let pagenum = this.pagenum
        const {
          data: res
        } = await this.$axios.post('/expendLoan/queryList', {
          empcard,
          pagenum
        })
        if (res.length > 0) {
          let data = JSON.parse(res)
          this.borrowMoneList = data.tralist
          this.pagetotal = data.pagetotal
        } else {
          this.$message.error('获取数据失败！');
        }
        console.log('borrowMoneList', this.borrowMoneList)
      },
      // 待办理列表数据获取
      async getBorrowMoneWaitList() {
        let empcard = sessionStorage.getItem('ulogin')
        let pagenum = this.pagenum
        const {
          data: res
        } = await this.$axios.post('/expendLoan/queryWaitAudit', {
          empcard,
          pagenum
        })
        if (res.length > 0) {
          console.log(JSON.parse(res))
          let data = JSON.parse(res)
          this.BorrowMoneWaitList = data.loanlist
          this.Waittotal = data.pagetotal
        } else {
          this.$message.error('获取数据失败！');
        }
      },
      // 已办理列表数据获取
      async getBorrowMoneFinishList() {
        let empcard = sessionStorage.getItem('ulogin')
        let pagenum = this.pagenum
        const {
          data: res
        } = await this.$axios.post('/expendLoan/queryFinishAudit', {
          empcard,
          pagenum
        })
        if (res.length > 0) {
          let data = JSON.parse(res)
          console.log('getBorrowMoneFinishList', data)
          this.BorrowMoneFinishList = data.loanlist
          this.Finishtotal = data.pagetotal
        } else {
          this.$message.error('获取数据失败！');
        }
      },
      handleBorrowBtn(id) {
        this.$router.push({
          path: "/handBorrowPage",
          query: {
            id
          }
        })
      }

    },
  }

</script>


<style scoped>
  .borrow {
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
    margin-left: 1rem;
  }

  .borrow_time {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

</style>
