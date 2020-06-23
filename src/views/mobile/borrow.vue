<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销审批</el-breadcrumb-item>
      <el-breadcrumb-item>借款</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- table表格区域 -->
    <el-tabs type="border-card">
      <!-- 已申请列表视图 -->
      <el-tab-pane style="width: 100%">
        <span slot="label"><i class="el-icon-date"></i> 已申请列表</span>
        <el-table :data="borrowMoneList" border style="width: 100%">
          <el-table-column prop="formcode" label="编号" align="center">
          </el-table-column>
          <el-table-column prop="deptname" label="部门" align="center">
          </el-table-column>
          <el-table-column prop="loanpay" label="金额" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <van-button :disabled="scope.row.currentstep !== 2 ? true : false" type="info" size="mini"
                          @click="dayApplyBtn(scope.row)">提交</van-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已申请列表分页  -->
        <van-pagination v-model="currentPage" :total-items="+pagetotal" :items-per-page="5" @change="prevPageDay" />
      </el-tab-pane>
      <!-- 待办理列表视图 -->
      <el-tab-pane style="width: 100%">
        <span slot="label"><i class="el-icon-date"></i> 待办理列表</span>
        <el-table :data="BorrowMoneWaitList" border style="width: 100%">
          <el-table-column prop="formcode" label="编号" align="center">
          </el-table-column>
          <el-table-column prop="deptname" label="部门" align="center">
          </el-table-column>
          <el-table-column prop="loanpay" label="金额" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <van-button type="info" size="mini" @click="tranDayDataBtn(scope.row)">办理</van-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 待办理列表分页  -->
        <van-pagination v-model="WaitPage" :total-items="+Waittotal" :items-per-page="5" @change="prevWaitPage" />
      </el-tab-pane>
      <!-- 已办理列表视图 -->
      <el-tab-pane style="width: 100%">
        <span slot="label"><i class="el-icon-date"></i> 已办理列表</span>
        <el-table :data="BorrowMoneFinishList" border style="width: 100%">
          <el-table-column prop="formcode" label="编号" align="center">
          </el-table-column>
          <el-table-column prop="deptname" label="部门" align="center">
          </el-table-column>
          <el-table-column prop="loanpay" label="金额" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <van-button type="info" size="mini" @click="lookBtn(scope.row)">查看</van-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已办理列表分页  -->
        <van-pagination v-model="FinishPage" :total-items="+Finishtotal" :items-per-page="5" @change="prevFinishPage" />
      </el-tab-pane>
    </el-tabs>
    <!-- 提交审核信息填写对话框 -->
    <el-dialog title="填写提交审核信息" :visible.sync="dayAppleInfoDialog" width="90%">
      <el-form :model="submitForm" :label-position="submitFormposition">
        <el-form-item label="申请人：" label-width="90px">
          <el-input v-model="submitForm.empcard" disabled></el-input>
        </el-form-item>
        <el-form-item label="分管校长：" label-width="90px">
          <el-select v-model="submitForm.fgxz" placeholder="请选择分管校长">
            <el-option v-for="item in rectorList" :key="item.postid" :label="item.postname" :value="item.postid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dayAppleInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="dayAppleInfoBtn">提交审核</el-button>
      </span>
    </el-dialog>
    <!-- 办理对话框 -->
    <el-dialog title="办理信息查看" :visible.sync="tranDayDialog" width="90%">
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="基础信息" name="1">
          <div>
            <el-row class="info_lsit">
              <el-col :span="24">
                <div>表单编号：{{dayInfoList.formcode}}</div>
              </el-col>
              <el-col :span="24">
                <div>项目：{{dayInfoList.protypeid}}</div>
              </el-col>
              <el-col :span="24">
                <div>部门：{{dayInfoList.deptname}}</div>
              </el-col>
              <el-col :span="24">
                <div>报销金额：{{dayInfoList.loanpay}}</div>
              </el-col>
              <el-col :span="24">
                <div>报销人：{{dayInfoList.createbyname}}</div>
              </el-col>
              <el-col :span="24">
                <div>申请时间：{{dayInfoList.createtime}}</div>
              </el-col>
              <el-col :span="24">
                <div>报销标识：{{dayInfoList.isflag}}</div>
              </el-col>
              <el-col :span="24">
                <div v-if="dayInfoList.loanusefor == 0">借款用途：差旅借款</div>
                <div v-else>借款用途：普通借款</div>
              </el-col>
              <el-col :span="24">
                <div>借款事由：{{dayInfoList.loancause}}</div>
              </el-col>
              <el-col :span="24">
                <div v-if="dayInfoList.payway == 0">支付方式：对公</div>
                <div v-else>支付方式：对私</div>
              </el-col>
              <el-col :span="24">
                <div>对冲号：{{dayInfoList.hedgenum}}</div>
              </el-col>
              <el-col :span="24">
                <div>预报销日期：{{dayInfoList.expecttime}}</div>
              </el-col>
              <el-col :span="24">
                <div>备注：{{dayInfoList.memo}}</div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="审批流程" name="2">
          <div style="width: 100%;">
            <el-timeline :reverse="reverse">
              <el-timeline-item v-for="(activity, index) in CommentLists" :key="index" :timestamp="activity.endtime"
                                placement="top">
                <el-card>
                  <h4>{{activity.username}} -- {{activity.Message}}</h4>
                </el-card>

              </el-timeline-item>
            </el-timeline>
          </div>
        </el-collapse-item>
        <!-- 付款凭证上传 -->
        <el-collapse-item title="付款凭证" name="4" v-if="cashier == '待付款' ?  false: true">
          <el-upload :action="uploadURL" list-type="picture-card" :on-preview="handlePictureCardPreview"
                     :on-remove="handlePictureRemove" :on-success="handlePictureSuccess">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-collapse-item>
      </el-collapse>
      <el-form :model="opinionForm" :rules="opinionFormRules" ref="opinionFormRef">
        <el-form-item label="审批意见" prop="opinion">
          <el-input type="textarea" v-model="opinionForm.opinion"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleRejectBtn" v-if="cashier == '待付款' ? true : false">驳 回</el-button>
        <el-button type="primary" @click="handlePassBtn">通 过</el-button>
      </span>
    </el-dialog>
    <!-- 查看审批意见 -->
    <el-dialog title="查看办理进度" :visible.sync="lookDayDialog" width="90%">
      <div>
        <el-timeline :reverse="reverse">
          <el-timeline-item v-for="(activity, index) in CommentLists" :key="index" :timestamp="activity.endtime"
                            placement="top">

            <h4>{{activity.username}} -- {{activity.Message}}</h4>

          </el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookDayDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 付款凭证预览 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import GLOBAL from '../../api/global_path'
  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        // 发票上传地址
        uploadURL: GLOBAL.uploadURL,
        // 判断是否为出纳
        cashier: "",
        // 已申请列表数据
        borrowMoneList: [],
        // 已申请数据总条数
        pagetotal: 0,
        // 已申请数据第一页
        currentPage: 1,
        // 请求页码
        pagenum: 0,
        // 提交审核对话框隐藏
        dayAppleInfoDialog: false,
        submitFormposition: "right",
        // 提交审核参数配置
        submitForm: {
          empcard: '',
          loanid: '',
          fgxz: ''
        },
        // 分管校长数据列表
        rectorList: [],
        // 待办理列表数据
        BorrowMoneWaitList: [],
        // 待办理数据总条数
        Waittotal: 0,
        // 待办理数据第一页
        WaitPage: 1,
        // 办理对话框隐藏
        tranDayDialog: false,
        activeNames: [1],
        // 办理意见填写
        opinionForm: {
          opinion: ''
        },
        opinionFormRules: {
          opinion: [{
            required: true,
            message: '请输入审批意见',
            trigger: 'blur'
          }]
        },
        // 审批查询数据
        dayInfoList: [],
        reverse: true,
        CommentLists: [],
        // 通过或者驳回参数
        expendLoan: {
          loanid: '',
          taskID: '',
        },
        // 已办理数据列表
        BorrowMoneFinishList: [],
        // 已办理总条数
        Finishtotal: [],
        // 审批意见对话框隐藏
        lookDayDialog: false,
        // 已办理数据第一页
        FinishPage: 1
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
          console.log(data)
          this.borrowMoneList = data.tralist
          this.pagetotal = data.pagetotal
        } else {
          this.$message.error('获取数据失败！');
        }
        console.log(this.borrowMoneList)
      },
      // 已申请列表数据分页
      prevPageDay() {
        this.pagenum = this.currentPage.toString() - 1
        this.getBorrowMoneyList()
      },
      // 提交审核打开对话框按钮事件
      dayApplyBtn(row) {
        this.submitForm.loanid = row.loanid
        this.submitForm.empcard = sessionStorage.getItem('ulogin')
        this.dayAppleInfoDialog = true
        this.getRectorList()
      },
      // 获取分管校长数据
      async getRectorList() {
        const {
          data: res
        } = await this.$axios.post('/jobpost/getFG')
        this.rectorList = JSON.parse(res)
      },
      // 提交审核确定按钮事件
      async dayAppleInfoBtn() {
        let empcard = this.submitForm.empcard
        let loanid = this.submitForm.loanid
        let fgxz = this.submitForm.fgxz
        console.log(empcard, loanid, fgxz)
        const {
          data: res
        } = await this.$axios.post('/expendLoan/submitReview', {
          loanid,
          empcard,
          fgxz
        })
        let data = JSON.parse(res)
        if (data.retCode == '1') {
          this.$message.error('提交审核失败！');
        } else {
          this.$message.success('提交审核成功！');
        }
        this.dayAppleInfoDialog = false
        this.getBorrowMoneyList()
        this.getBorrowMoneFinishList()
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
      // 待办理数据分页
      prevWaitPage() {
        this.pagenum = this.WaitPage.toString() - 1
        this.getBorrowMoneWaitList()
      },
      // 办理按钮事件和数据获取
      async tranDayDataBtn(row) {
        console.log(row)
        let cashier = row.desc
        let loanid = row.Loanid
        const {
          data: res
        } = await this.$axios.post('/expendLoan/queryOneLoan', {
          loanid
        })
        if (res.length > 0) {
          const data = JSON.parse(res)
          console.log(data)
          this.dayInfoList = data
        } else {
          this.$message.error('获取数据失败！');
        }
        this.expendLoan.loanid = row.Loanid
        this.expendLoan.taskID = row.taskID
        this.getFindCommentList(loanid)
        this.tranDayDialog = true
      },
      // 办理驳回事件
      handleRejectBtn() {
        const _this = this
        this.$refs.opinionFormRef.validate(async valid => {
          if (valid) {
            let empcard = sessionStorage.getItem('ulogin')
            let expendLoan = [{
              loanid: _this.expendLoan.loanid,
              taskID: _this.expendLoan.taskID
            }]
            let opinion = _this.opinionForm.opinion
            let agree = 1
            const {
              data: res
            } = await _this.$axios.post('/expendLoan/webPassAudit', {
              empcard,
              expendLoan,
              agree,
              opinion
            })
            _this.$message.warning('报销申请已驳回！')
            console.log('办理驳回事件', res)
            // 调用获取已申请列表数据
            _this.getBorrowMoneyList()
            // 调用获取待办理列表数据
            _this.getBorrowMoneWaitList()
            _this.getBorrowMoneFinishList()
            _this.tranDayDialog = false
          } else {
            return _this.$message.warning('请先填写审批意见！')
          }
        })
      },
      // 办理通过事件
      async handlePassBtn() {
        console.log(this.expendLoan)
        let empcard = sessionStorage.getItem('ulogin')
        let expendLoan = [{
          loanid: this.expendLoan.loanid,
          taskID: this.expendLoan.taskID
        }]
        let opinion = this.opinionForm.opinion
        let agree = 0
        const {
          data: res
        } = await this.$axios.post('/expendLoan/webPassAudit', {
          empcard,
          expendLoan,
          agree,
          opinion
        })
        this.$message.success('报销申请已通过！')
        console.log('办理通过事件', res)
        this.tranDayDialog = false
        // 调用获取已申请列表数据
        this.getBorrowMoneyList()
        // 调用获取待办理列表数据
        this.getBorrowMoneWaitList()
        this.getBorrowMoneFinishList()
      },
      // 查询审批意见
      async getFindCommentList(loanid) {
        const {
          data: res
        } = await this.$axios.post('/expendLoan/findComment', {
          loanid
        })
        this.CommentLists = JSON.parse(res)
        console.log(this.CommentLists)
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
      // 查看对话框打开
      lookBtn(row) {
        let loanid = row.Loanid
        this.getFindCommentList(loanid)
        this.lookDayDialog = true
      },
      // 已办理数据分页
      prevFinishPage() {
        this.pagenum = this.FinishPage.toString() - 1
        this.getBorrowMoneFinishList()
      },
      // 付款凭证删除
      handlePictureRemove(file, fileList) {
        let voucherDataRemove = JSON.parse(file.response).relationPath
        const index = this.voucherList.find(e => {
          e = voucherDataRemove
        })
        this.voucherList.splice(index, 1)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handlePictureSuccess(file, fileList) {
        let voucherData = JSON.parse(file).relationPath
        this.voucherList.push(voucherData)
      },
    },
  }

</script>

<style scoped>
  .el-breadcrumb {
    padding: .875rem;
  }

  .van-pagination {
    margin-top: .875rem;

  }

  .CommentLists {
    width: 150px;
    height: 150px;
    line-height: 50px;
    border: 1px solid #eee;
    padding: 10px;
    text-align: center;
  }

  .info_lsit .el-col div {
    padding: 6px 0px;
  }

</style>
