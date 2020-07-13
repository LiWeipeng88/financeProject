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
        <div class="borrow_list">
          <div class="borrow_info" v-for="item in DayMoneyList">
            <div class="borrow_time">
              <span class="bianma">编码：{{item.formcode}}</span><span>时间：{{item.createtime}}</span>
            </div>
            <div class="pro_info">
              <span>部门：{{item.deptid}}</span><span>金额：{{item.paymoney}}元</span><span>报销人：{{item.createbyname}}</span>
            </div>
            <div class="borrow_time">
              <span>名称：{{item.protypename}}</span>
              <span>状态：
                <van-tag v-if="item.currentstep == 1" type="primary" size="small">流转中</van-tag>
                <van-tag type="warning" v-else size="small">待处理</van-tag>
              </span>
              <van-button type="info" :disabled="item.currentstep == 2 ? false :true " size="small"
                          @click='handleDayBtn(item.dailyid)'>提交</van-button>
            </div>
          </div>
        </div>
      </van-tab>
      <!-- 待办理列表数据 -->
      <van-tab title="待办理列表" name="b">
        <div class="borrow_list" v-for="item in DayAppleWaitList">
          <div class="borrow_info">
            <div class="borrow_time">
              <span class="bianma">编码：{{item.formcode}}</span><span>时间：{{item.createtime}}</span>
            </div>
            <div class="pro_info">
              <span>部门：{{item.deptid}}</span><span>金额：{{item.paymoney}}元</span><span>报销人：{{item.createbyname}}</span>
            </div>
            <div class="borrow_time">
              <span>名称：{{item.protypename}}</span>
              <span>状态：<van-tag v-if="item.currentstep == 1" type="primary" size="small">流转中</van-tag>
                <van-tag type="warning" v-else size="small">待处理</van-tag>
              </span>
              <van-button type="info" size="small" v-if="item.currentstep == 1"
                          @click="handleDayApplyBtn(item.dailyid,item.taskID)">办理
              </van-button>
              <van-button type="info" size="small" v-if="item.currentstep == 0" @click="editDayApplyBtn()">修改
              </van-button>
            </div>
          </div>
        </div>
      </van-tab>
      <!-- 已办理数据列表 -->
      <van-tab title="已办理列表" name="c">
        <div class="borrow_list" v-for="item in DayAppleFinishList">
          <div class="borrow_info">
            <div class="borrow_time">
              <span class="bianma">编码：{{item.formcode}}</span><span>时间：{{item.createtime}}</span>
            </div>
            <div class="pro_info">
              <span>部门：{{item.deptid}}</span><span>金额：{{item.paymoney}}元</span><span>报销人：{{item.createbyname}}</span>
            </div>
            <div class="borrow_time">
              <span>名称：{{item.protypename}}</span><span>步骤：<van-tag type="warning">{{item.desc}}
                </van-tag></span>
              <van-button type="info" size="small" @click="lookInfoBtn(item.dailyid)">查看</van-button>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
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
        has_log: 0,
        no_data: false,
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
      window.addEventListener('scroll', this.onScroll)
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
          this.DayMoneyList = [...this.DayMoneyList, ...DayMoneyData.dailylist]
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
          this.DayAppleWaitList = [...this.DayAppleWaitList, ...data.dailylist]
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
          this.DayAppleFinishList = [...this.DayAppleFinishList, ...data.dailylist]
          this.Finishtotal = data.pagetotal
        } else {
          this.$message.error('获取数据失败！');
        }
      },
      handleDayBtn(id) {
        this.$router.push({
          path: '/handDayPage',
          query: {
            id: id
          }
        })
      },
      // 查看申请按钮跳转事件
      lookInfoBtn(id) {
        this.$router.push({
          path: '/lookDay',
          query: {
            id
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
      handleDayApplyBtn(dailyid, taskID) {
        this.$router.push({
          path: "/dayApplyPage",
          query: {
            dailyid: dailyid,
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
          this.getDayMoneyList()
          this.getDayAppleFinishList()
          this.getDayAppleWaitList()
        }
      }

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

  .bscroll {
    height: 100vh;
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
