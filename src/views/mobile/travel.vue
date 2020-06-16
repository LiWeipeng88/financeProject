<template>
  <div>
    <topHome></topHome>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销审批</el-breadcrumb-item>
      <el-breadcrumb-item>差旅报销</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- table表格区域 -->
    <el-tabs type="border-card">
      <!-- 已申请列表视图 -->
      <el-tab-pane style="width: 100%">
        <span slot="label"><i class="el-icon-date"></i> 已申请列表</span>
        <el-table :data="travelList" border style="width: 100%">
          <el-table-column prop="formcode" label="编号" align="center">
          </el-table-column>
          <el-table-column prop="deptname" label="部门" align="center">
          </el-table-column>
          <el-table-column prop="loanpay" label="金额" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <van-button :disabled="scope.row.currentstep == 2 ? false :true" type="info" size="mini"
                          @click="submitAuditBtn(scope.row)">提交</van-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已申请列表分页  -->
        <van-pagination v-model="currentPage" :total-items="+pagetotal" :items-per-page="5" @change="prevPageDay" />
      </el-tab-pane>
      <!-- 待办理列表视图 -->
      <el-tab-pane style="width: 100%">
        <span slot="label"><i class="el-icon-date"></i> 待办理列表</span>
        <el-table :data="approveDataList" border style="width: 100%">
          <el-table-column prop="formcode" label="编号" align="center">
          </el-table-column>
          <el-table-column prop="deptname" label="部门" align="center">
          </el-table-column>
          <el-table-column prop="loanpay" label="金额" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <van-button type="info" size="mini" @click="transactBtn(scope.row)">办理</van-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 待办理列表分页  -->
        <van-pagination v-model="WaitPage" :total-items="+approvepagetotal" :items-per-page="5"
                        @change="prevWaitPage" />
      </el-tab-pane>
      <!-- 已办理列表视图 -->
      <el-tab-pane style="width: 100%">
        <span slot="label"><i class="el-icon-date"></i> 已办理列表</span>
        <el-table :data="yesApproveDataList" border style="width: 100%">
          <el-table-column prop="formcode" label="编号" align="center">
          </el-table-column>
          <el-table-column prop="deptname" label="部门" align="center">
          </el-table-column>
          <el-table-column prop="loanpay" label="金额" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <van-button type="info" size="mini" @click="lookTransacBtn(scope.row)">查看</van-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已办理列表分页  -->
        <van-pagination v-model="FinishPage" :total-items="+yesApprovepagetotal" :items-per-page="5"
                        @change="prevFinishPage" />
      </el-tab-pane>
    </el-tabs>
    <!-- 提交审核对话框 -->
    <el-dialog title="提交审核" :visible.sync="submitAuditDialog" width="90%" :before-close="submitAuditClose">
      <el-form ref="submitFormRef" :model="submitForm" :label-position="submitFormposition">
        <el-form-item label="申请人" label-width="80px">
          <el-input v-model="submitForm.entname" disabled></el-input>
        </el-form-item>
        <el-form-item label="分管校长" label-width="80px">
          <el-select v-model="submitForm.fgxz" placeholder="请选择分管校长">
            <el-option v-for="item in rectorList" :key="item.postid" :label="item.postname" :value="item.postname">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitAuditDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSubmitAudit" :loading="isLoading">提交审核</el-button>
      </span>
    </el-dialog>
    <!-- 办理审核对话框 -->
    <el-dialog title="报销信息查看" :visible.sync="transacTdialog" width="90%">
      <el-collapse v-model="activeNames" accordion>
        <!-- 基础信息 -->
        <el-collapse-item title="基础信息" name="1">
          <div v-for="item in travelData">
            <el-row class="travel_box" :gutter="20">
              <el-col :span="24">
                <div>项目分类：{{item.protypeid}}</div>
              </el-col>
              <el-col :span="24">
                <div>表单编号：{{item.formcode}}</div>
              </el-col>
              <el-col :span="24">
                <div>部门：{{item.deptname}}</div>
              </el-col>
              <el-col :span="24">
                <div>报销金额：{{item.paymoney}}</div>
              </el-col>
              <el-col :span="24">
                <div>报销人：{{item.createby}}</div>
              </el-col>
              <el-col :span="24">
                <div>申请时间：{{item.createtime}}</div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 明细信息 -->
        <el-collapse-item title="明细信息" name="2">
          <div v-for="item in mxlistData">
            <el-row :gutter="20" class="travel_box">
              <el-col :span="24">
                <div>费用类别：{{item.costtype}}</div>
              </el-col>
              <el-col :span="24">
                <div>报销类型：{{item.expendtype}}</div>
              </el-col>
              <el-col :span="24">
                <div>人数：{{item.expendnum}}</div>
              </el-col>
              <el-col :span="24">
                <div>天数：{{item.expendday}}</div>
              </el-col>
              <el-col :span="24">
                <div>费用标准：{{item.expendlevel}}</div>
              </el-col>
              <el-col :span="24">
                <div>报销金额：{{item.expendmoney}}</div>
              </el-col>
              <el-col :span="24">
                <div style='display: flex;'>
                  <div style="border: none;" class="travel_box travel_box_img" v-for="items in item.fplist">
                    <p>发票编码：{{items.receiptcode}}</p>
                    <img class="travel_box_img" :src="imgURL + items.picpath" alt="">
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 审批流程 -->
        <el-collapse-item title="审批流程" name="3">
          <div style="width: 100%;">
            <el-timeline :reverse="reverse">
              <el-timeline-item v-for="(activity, index) in CommentLists" :key="index" :timestamp="activity.endtime"
                                placement="top">
                <el-card>
                  <div style="display: flex; justify-content: space-between;">
                    <h4>{{activity.username}} -- {{activity.Message}}</h4>
                    <img src="../../assets/img/avatar.jpg" alt="" width="60px">
                  </div>
                </el-card>

              </el-timeline-item>
            </el-timeline>
          </div>
        </el-collapse-item>
        <!-- 付款凭证上传 -->
        <el-collapse-item title="付款凭证" name="4" v-if="cashier == '待付款' ? true : false">
          <el-upload :action="uploadURL" list-type="picture-card" :on-preview="handlePictureCardPreview"
                     :on-remove="handlePictureRemove" :on-success="handlePictureSuccess">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-collapse-item>
      </el-collapse>
      <!-- 审批意见 -->
      <el-form :model="opinionForm" :rules="opinionFormRules" ref="opinionFormRef">
        <el-form-item label="审批意见" prop="opinion">
          <el-input type="textarea" v-model="opinionForm.opinion"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleRejectBtn" v-if="cashier == '待付款' ? false : true">驳 回</el-button>
        <el-button type="primary" @click="handlePassBtn">通 过</el-button>
      </span>
    </el-dialog>
    <!-- 查看审批意见 -->
    <el-dialog title="查看办理进度" :visible.sync="lookTransacDialog" width="90%">
      <div>
        <el-timeline :reverse="reverse">
          <el-timeline-item v-for="(activity, index) in CommentLists" :key="index" :timestamp="activity.endtime"
                            placement="top">
            <el-card>
              <div style="display: flex; justify-content: space-between;">
                <h4>{{activity.username}} -- {{activity.Message}}</h4>
                <img src="../../assets/img/avatar.jpg" alt="" width="60px">
              </div>
            </el-card>

          </el-timeline-item>
        </el-timeline>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookTransacDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import top_home from './home.vue'
  import GLOBAL from '../../api/global_path'
  export default {
    data() {
      return {
        // 已申请列表数据
        travelList: [],
        // 已申请列表总条数
        pagetotal: '',
        // 已申请列表第一页数据
        currentPage: 1,
        // 请求页数配置
        pagenum: '0',
        // 分管校长数据
        rectorList: [],
        // 提交审核对话框隐藏
        submitAuditDialog: false,
        // 提交审核参数配置
        submitForm: {
          empcard: '',
          traid: '',
          entname: '',
          fgxz: ''
        },
        submitFormposition: "right",
        // 提交状态判断
        isLoading: false,
        // 待审核列表数据
        approveDataList: [],
        // 待审核总数据
        approvepagetotal: '',
        // 待办理列表第一页数据
        WaitPage: 1,
        // 办理对话框隐藏
        transacTdialog: false,
        activeNames: ['1'],
        // 基础信息
        travelData: [],
        // 明细信息
        mxlistData: [],
        // 附件信息
        fplistData: [],
        // 审批数据
        CommentLists: [],
        // 通过或者驳回参数
        expendTravel: {
          traid: '',
          taskID: ''
        },
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
        reverse: true,
        cashier: '',
        // 图片上传URL地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        // 已办理数据列表
        yesApproveDataList: [],
        // 已办理数据总数据
        yesApprovepagetotal: 0,
        // 已办理列表第一页数据
        FinishPage: 1,
        // 查看办理数据
        lookTransacDialog: false
      }
    },
    components: {
      topHome: top_home
    },
    created() {
      this.getTravelList()
      this.getRectorList()
      this.getNoApproveList()
      this.getYesApproveList()
    },
    methods: {
      // 获取报销列表数据
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
        this.travelList = travelData.tralist;
        this.pagetotal = travelData.pagetotal;
      },
      // 已申请列表分页
      prevPageDay() {
        this.pagenum = this.currentPage.toString() - 1
        this.getTravelList()
      },
      // 获取分管校长数据
      async getRectorList() {
        const {
          data: res
        } = await this.$axios.post('/jobpost/getFG')
        this.rectorList = JSON.parse(res)
      },
      // 提交审核事件
      submitAuditBtn(row) {
        this.submitForm.traid = row.travelid
        this.submitForm.empcard = sessionStorage.getItem('ulogin');
        this.submitForm.entname = sessionStorage.getItem('entname')
        this.submitAuditDialog = true
      },
      // 提交审核对话框关闭事件
      submitAuditClose() {
        this.submitAuditDialog = false
      },
      //点击提交审核按钮事件
      async addSubmitAudit() {
        this.isLoading = true
        let empcard = this.submitForm.empcard
        let traid = this.submitForm.traid
        let fgxz = this.submitForm.fgxz
        const {
          data: res
        } = await this.$axios.post('/expendTravel/submitReview', {
          empcard,
          traid,
          fgxz
        })
        console.log('submitReview', res)
        let submitData = JSON.parse(res)
        if (submitData.retCode == '1') {
          this.$message.error('提交审核失败！');
          this.isLoading = false
        } else if (submitData.retCode == '0') {
          this.$message.success('申请成功，待部门审批！');
          this.isLoading = false
        } else if (submitData.retCode == '2') {
          this.$message.error('请先上传发票信息！');
          this.isLoading = false
        }
        this.submitAuditDialog = false
      },
      // 查看待审批列表数据
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
        this.approveDataList = approveData.tralist
        this.approvepagetotal = approveData.pagetotal
        console.log('getNoApproveList', this.approveDataList)
      },
      // 待审批数据分页
      prevWaitPage() {
        this.pagenum = this.WaitPage.toString() - 1
        this.getNoApproveList()
      },
      // 办理对话关闭事件
      submitAuditClose() {
        this.transacTdialog = false
      },
      // 流程办理按钮事件
      async transactBtn(row) {
        console.log('流程办理', row)
        this.cashier = row.desc
        this.expendTravel.traid = row.travelid
        this.expendTravel.taskID = row.taskID
        let traid = row.travelid
        const {
          data: res
        } = await this.$axios.post('/expendTravel/queryOneTravel', {
          traid
        })
        console.log(JSON.parse(res))
        let transactData = JSON.parse(res)
        this.travelData = transactData.travel
        this.mxlistData = transactData.mxlist
        this.fplistData = transactData.fplist
        this.transacTdialog = true
        this.getCommentLists(traid)
      },
      // 获取审批意见数据
      async getCommentLists(traid) {
        const {
          data: res
        } = await this.$axios.post('/expendTravel/findComment', {
          traid
        })
        if (!res.length > 0) return this.$message.error('获取办理信息失败！')
        const data = JSON.parse(res)
        console.log(data)
        this.CommentLists = data
      },
      // 办理驳回事件
      handleRejectBtn() {
        const _this = this
        this.$refs.opinionFormRef.validate(async valid => {
          if (valid) {
            let empcard = sessionStorage.getItem('ulogin')
            let expendTravel = [{
              traid: _this.expendTravel.traid,
              taskID: _this.expendTravel.taskID
            }]
            let opinion = _this.opinionForm.opinion
            let agree = 1
            const {
              data: res
            } = await _this.$axios.post('/expendTravel/webPassAudit', {
              empcard,
              expendTravel,
              agree,
              opinion
            })
            console.log('办理驳回事件', res)
            this.$message.success('报销申请已驳回！')
            _this.getYesApproveList()
            _this.getNoApproveList()
            _this.getTravelList()
            this.transacTdialog = false
          } else {
            return _this.$message.warning('请先填写审批意见！')
          }
        })
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
        console.log('办理通过事件', res)
        let expendReceipt = []
        this.voucherList.map(e => {
          let obj = {}
          obj.picpath = e
          obj.isflag = "2"
          obj.recid = ""
          obj.expendid = this.expendTravel.traid
          obj.receiptcode = ""
          expendReceipt.push(obj)
        })
        const {
          data: rulst
        } = await this.$axios.post('/expendReceipt/webSaveReceipt', {
          empcard,
          expendReceipt
        });
        this.$message.success('报销审批已通过！');
        console.log('办理通过事件', rulst)
        this.transacTdialog = false
        this.getYesApproveList()
        this.getNoApproveList()
        this.getTravelList()
      },
      // 查看已审批列表数据
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
        this.yesApproveDataList = yesApproveData.tralist
        this.yesApprovepagetotal = yesApproveData.pagetotal
        console.log('getNoApproveList', this.approveDataList)
      },
      // 已审批列表数据分页
      prevFinishPage() {
        this.pagenum = this.FinishPage.toString() - 1
        this.getYesApproveList()
      },
      // 查看流程事件
      lookTransacBtn(row) {
        let traid = row.travelid
        this.getCommentLists(traid)
        this.lookTransacDialog = true
      },
    },
  }

</script>

<style scope>
  .el-breadcrumb {
    padding: 0.875rem;
  }

</style>
