<template>
  <div class="borrow_money">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>报销系统</el-breadcrumb-item>
        <el-breadcrumb-item>借款</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button style=" margin-bottom: 16px;" size="medium" type="primary" icon="el-icon-download"
                 v-if="postidBtn == 'f938d56b40e4427dbe9e51a469e12345'? true : false" @click="exportInfoBtn">付款信息导出
      </el-button>
    </div>
    <el-card>
      <el-tabs type="border-card">
        <!-- 已申请列表视图 -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 已申请列表</span>
          <router-link to="/expendLoan/borrowApply">
            <el-button type="primary">借款申请入口</el-button>
          </router-link>
          <el-table :data="borrowMoneList" border style="width: 100%">
            <el-table-column prop="formcode" label="表单编号" align="center">
            </el-table-column>
            <el-table-column prop="protypename" label="项目名称" align="center">
            </el-table-column>

            <el-table-column prop="deptname" label="部门名称" align="center">
            </el-table-column>
            <el-table-column prop="loanpay" label="报销金额" width="120" align="center">
            </el-table-column>
            <el-table-column prop="createbyname" label="报销人" align="center"> </el-table-column>
            <el-table-column prop="createtime" label="时间" width="200" align="center">
            </el-table-column>
            <el-table-column prop="currentstep" label="当前状态" width="80" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.currentstep == 1" size="small">流转中</el-tag>
                <el-tag v-else size="medium">待处理</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-button type="info" size="mini" icon="el-icon-circle-plus" @click="borrowNoteUploadBtn(scope.row)">票
                  据
                </el-button> -->
                <el-button :disabled="scope.row.currentstep == 2 ? false :true " type="primary" size="mini"
                           icon="el-icon-success" @click="dayApplyBtn(scope.row)">提 交
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 已申请列表分页  -->
          <el-pagination @current-change="handleborrowMoneyPage" :page-sizes="[5]" :page-size="5"
                         layout="total, sizes, prev, pager, next, jumper" :total="+pagetotal">
          </el-pagination>
        </el-tab-pane>
        <!-- 待办理列表视图 -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 待办理列表</span>
          <el-table :data="BorrowMoneWaitList" border style="width: 100%">
            <el-table-column prop="formcode" label="表单编号" align="center">
            </el-table-column>
            <el-table-column prop="protypename" label="项目名称" align="center">
            </el-table-column>

            <el-table-column prop="deptname" label="部门名称" align="center">
            </el-table-column>
            <el-table-column prop="loanpay" label="报销金额" width="120" align="center">
            </el-table-column>
            <el-table-column prop="createbyname" label="报销人" align="center"> </el-table-column>
            <el-table-column prop="createtime" label="时间" width="200" align="center">
            </el-table-column>
            <el-table-column prop="currentstep" label="当前状态" width="80" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.currentstep == 1" size="small">流转中</el-tag>
                <el-tag v-else size="medium">待处理</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="审核步骤">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-success" @click="tranDayDataBtn(scope.row)">办 理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 待办理列表分页  -->
          <el-pagination @current-change="handleWaitPage" :page-sizes="[5]" :page-size="5"
                         layout="total, sizes, prev, pager, next, jumper" :total="+Waittotal">
          </el-pagination>
        </el-tab-pane>
        <!-- 已办理列表视图 -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 已办理列表</span>
          <el-table :data="BorrowMoneFinishList" border style="width: 100%">
            <el-table-column prop="formcode" label="表单编号" align="center">
            </el-table-column>
            <el-table-column prop="protypename" label="项目名称" align="center">
            </el-table-column>

            <el-table-column prop="deptname" label="部门名称" align="center">
            </el-table-column>
            <el-table-column prop="loanpay" label="报销金额" width="120" align="center">
            </el-table-column>
            <el-table-column prop="createbyname" label="报销人" align="center"> </el-table-column>
            <el-table-column prop="createtime" label="时间" width="200" align="center">
            </el-table-column>
            <el-table-column prop="desc" label="审核步骤" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-success" @click="lookBtn(scope.row)">查 看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 已办理列表分页  -->
          <el-pagination @current-change="handleWaitPage" :page-sizes="[5]" :page-size="5"
                         layout="total, sizes, prev, pager, next, jumper" :total="+Finishtotal">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 发票上传对话框事件 -->
    <el-dialog title="发票上传" :visible.sync="NoteUploadDV" width="50%">
      <el-button @click="addNoteData" type="primary" size="mini">
        <i class="el-icon-plus"> 添加发票</i>
      </el-button>
      <el-row type="flex" style="display: flex; flex-wrap: wrap;" :gutter="40">
        <el-col :span="12" v-for="(item, i) in noteDataList" :key='i'>
          <el-form>
            <el-form-item label="发票编码">
              <el-input v-model="item.receiptcode"></el-input>
            </el-form-item>
            <el-form-item label="标识">
              <el-input v-model="item.isflag"></el-input>
            </el-form-item>
            <el-form-item label="发票">
              <el-upload id="avatar-uploader" class="avatar-uploader" :action="uploadURL" :show-file-list="false"
                         :on-success=" res =>$set(item, 'picpath', JSON.parse(res).relationPath)">
                <img v-if="item.picpath" :src=" imgURL + item.picpath" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="NoteUploadDV = false">取 消</el-button>
        <el-button type="primary" @click="addDayNoteBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 提交审核信息填写对话框 -->
    <el-dialog title="填写提交审核信息" :visible.sync="dayAppleInfoDialog" width="50%">
      <el-form :model="submitForm" :label-position="submitFormposition">
        <el-form-item label="申请人：" label-width="90px">
          <el-input v-model="submitForm.entname" disabled></el-input>
        </el-form-item>
        <el-form-item label="分管校长：" label-width="90px">
          <el-select v-model="submitForm.fgxz" placeholder="请选择分管校长">
            <el-option v-for="item in rectorList" :key="item.empcard" :label="item.empname" :value="item.empcard">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dayAppleInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="dayAppleInfoBtn" :loading="isLoading">提交审核</el-button>
      </span>
    </el-dialog>
    <!-- 办理对话框 -->
    <el-dialog title="办理信息查看" :visible.sync="tranDayDialog" width="60%">
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="基础信息" name="1">
          <div v-for="item in dayInfoList">
            <el-row class="travel_box" :gutter="20">
              <el-col :span="6">
                <div>表单编号：{{item.formcode}}</div>
              </el-col>
              <el-col :span="6">
                <div>项目分类：{{item.protypeid}}</div>
              </el-col>
              <el-col :span="6">
                <div>部门：{{item.deptname}}</div>
              </el-col>
              <el-col :span="6">
                <div>借款金额：{{item.loanpay}}</div>
              </el-col>
              <el-col :span="6">
                <div>报销人：{{item.createbyname}}</div>
              </el-col>
              <el-col :span="6">
                <div>申请时间：{{item.createtime}}</div>
              </el-col>
              <el-col :span="6">
                <div>出差天数：{{item.tradays}}</div>
              </el-col>
              <el-col :span="6">
                <div>出差人数：{{item.tranum}}</div>
              </el-col>
              <el-col :span="6">
                <div>出差地点：{{item.traadd}}</div>
              </el-col>
              <el-col :span="6">
                <div v-if="item.loanusefor == 0">借款用途：差旅借款</div>
                <div v-else>借款用途：普通借款</div>
              </el-col>
              <el-col :span="6">
                <div>报销标识：{{item.isflag}}</div>
              </el-col>
              <el-col :span="6">
                <div>对冲号：{{item.hedgenum}}</div>
              </el-col>
              <el-col :span="6">
                <div v-if="item.payway == 0">报销方式：对公</div>
                <div v-else>报销方式：对私</div>
              </el-col>
              <el-col :span="6">
                <div>名称：{{item.payname}}</div>
              </el-col>
              <el-col :span="6">
                <div>账号：{{item.payacc}}</div>
              </el-col>
              <el-col :span="6">
                <div>开户行：{{item.paybank}}</div>
              </el-col>
              <el-col :span="12">
                <div>借款事由：{{item.loancause}}</div>
              </el-col>
              <el-col :span="12">
                <div>备注：{{item.memo}}</div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="附件" name="2">
          <div style='display: flex;'>
            <div class="travel_box travel_box_img" v-for="item in dayFJInfoList">

              <a :href="imgURL + item.picpath" target="_block">
                <p>附件名称：{{item.recname}}(点击查看详情)</p>
              </a>
              <!-- <img class="travel_box_img" :src="imgURL + item.picpath" alt=""> -->
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="审批流程" name="3">
          <div style="width: 60%;">
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
    <!-- 付款凭证预览 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <!-- 查看审批意见 -->
    <el-dialog title="查看办理进度" :visible.sync="lookDayDialog" width="50%">
      <div>
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item title="基础信息" name="1">
            <div v-for="item in dayInfoList">
              <el-row class="travel_box" :gutter="20">
                <el-col :span="6">
                  <div>表单编号：{{item.formcode}}</div>
                </el-col>
                <el-col :span="6">
                  <div>项目分类：{{item.protypeid}}</div>
                </el-col>
                <el-col :span="6">
                  <div>部门：{{item.deptname}}</div>
                </el-col>
                <el-col :span="6">
                  <div>借款金额：{{item.loanpay}}</div>
                </el-col>
                <el-col :span="6">
                  <div>报销人：{{item.createbyname}}</div>
                </el-col>
                <el-col :span="6">
                  <div>申请时间：{{item.createtime}}</div>
                </el-col>
                <el-col :span="6">
                  <div>出差天数：{{item.tradays}}</div>
                </el-col>
                <el-col :span="6">
                  <div>出差人数：{{item.tranum}}</div>
                </el-col>
                <el-col :span="6">
                  <div>出差地点：{{item.traadd}}</div>
                </el-col>
                <el-col :span="6">
                  <div v-if="item.loanusefor == 0">借款用途：差旅借款</div>
                  <div v-else>借款用途：普通借款</div>
                </el-col>
                <el-col :span="6">
                  <div>报销标识：{{item.isflag}}</div>
                </el-col>
                <el-col :span="6">
                  <div>对冲号：{{item.hedgenum}}</div>
                </el-col>
                <el-col :span="6">
                  <div v-if="item.payway == 0">报销方式：对公</div>
                  <div v-else>报销方式：对私</div>
                </el-col>
                <el-col :span="6">
                  <div>名称：{{item.payname}}</div>
                </el-col>
                <el-col :span="6">
                  <div>账号：{{item.payacc}}</div>
                </el-col>
                <el-col :span="6">
                  <div>开户行：{{item.paybank}}</div>
                </el-col>
                <el-col :span="12">
                  <div>借款事由：{{item.loancause}}</div>
                </el-col>
                <el-col :span="12">
                  <div>备注：{{item.memo}}</div>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
          <el-collapse-item title="附件" name="2">
            <div style='display: flex;'>
              <div class="travel_box travel_box_img" v-for="item in dayFJInfoList">

                <a :href="imgURL + item.picpath" target="_block">
                  <p>附件名称：{{item.recname}}(点击查看详情)</p>
                </a>
                <!-- <img class="travel_box_img" :src="imgURL + item.picpath" alt=""> -->
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="审批流程" name="3">
            <div style="width: 60%;">
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
        </el-collapse>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookDayDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import GLOBAL from '../../api/global_path'
  export default {
    data() {
      return {
        isLoading: false,


        // 付款凭证预览临时路径
        dialogImageUrl: '',
        // 付款凭证预览对话框隐藏
        dialogVisible: false,
        // 付款凭证数据
        voucherList: [],

        lookDayDialog: false,
        reverse: true,
        CommentLists: [],
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
        // 通过或者驳回参数
        expendLoan: {
          loanid: '',
          taskID: '',
        },
        dayFJInfoList: [],
        dayInfoList: [],
        activeNames: ['1'],
        // 办理对话框
        tranDayDialog: false,
        // 已办理列表
        BorrowMoneFinishList: [],
        // 已办理总条数
        Finishtotal: [],
        // 待办理列表
        BorrowMoneWaitList: [],
        // 待办理总条数
        Waittotal: '',
        dayAppleInfoDialog: false,
        submitFormposition: "right",
        submitForm: {
          empcard: '',
          loanid: '',
          entname: '',
          fgxz: ''
        },
        loanid: '',
        // 发票上传地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        // 发票上传数组
        noteDataList: [],
        // 发票上传对话框的隐藏控制
        NoteUploadDV: false,
        // 分管校长数组
        rectorList: [],

        // 借款报销已申请列表
        borrowMoneList: [],

        // 控制借款申请对话框的显示与隐藏
        borrowMoneyBtnDialog: false,
        // 总条数
        pagetotal: "0",
        // 页码数
        pagenum: '0',

        // 判断是否为出纳
        cashier: "",
        postidBtn: ''
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
      // 已申请列表分页事件
      handleborrowMoneyPage(newPage) {
        this.pagenum = newPage - 1
        this.getBorrowMoneyList()
      },
      // 获取分管校长数据
      async getRectorList() {
        const {
          data: res
        } = await this.$axios.post('/employee/queryFg')

        this.rectorList = JSON.parse(res)
        console.log(this.rectorList);
      },
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
        console.log(res)
        if (res.length > 0) {
          let data = JSON.parse(res)
          console.log(data)
          this.borrowMoneList = data.tralist
          this.pagetotal = data.pagetotal
        } else {
          this.$message.error('获取数据失败！');
        }
        console.log('borrowMoneList', this.borrowMoneList)
      },
      borrowNoteUploadBtn(row) {
        this.loanid = row.loanid
        this.NoteUploadDV = true
      },
      addNoteData() {
        this.noteDataList.push({})
      },
      // 上传发票确定按钮事件
      async addDayNoteBtn() {
        this.noteDataList.forEach(e => {
          e.recid = '',
            e.expendid = this.loanid
        })
        let empcard = sessionStorage.getItem('ulogin')
        let expendReceipt = this.noteDataList
        const {
          data: res
        } = await this.$axios.post('/expendReceipt/webSaveReceipt', {
          expendReceipt,
          empcard
        })
        let noteData = JSON.parse(res)
        if (noteData.retCode == '1') {
          this.$message.error('发票信息上传失败！');
        } else {
          this.$message.success('发票信息上传成功！');
        }
        this.NoteUploadDV = false
      },
      // 提交审核打开对话框按钮事件
      dayApplyBtn(row) {
        this.submitForm.loanid = row.loanid
        this.submitForm.empcard = sessionStorage.getItem('ulogin')
        this.submitForm.entname = sessionStorage.getItem('entname')
        this.dayAppleInfoDialog = true
        this.getRectorList()
      },
      // 提交审核确定按钮事件
      async dayAppleInfoBtn() {
        this.isLoading = true
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
          this.isLoading = false
        } else {
          this.$message.success('申请成功，待部门审批！');
          this.isLoading = false
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
      // 待办理列表分页
      handleWaitPage(newpage) {
        this.pagenum = newpage - 1
        this.getBorrowMoneWaitList()
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
      handleWaitPage(newpage) {
        this.pagenum = newpage - 1
        this.getBorrowMoneFinishList()
      },
      // 办理按钮事件和数据获取
      tranDayDataBtn(row) {
        console.log('办理按钮事件和数据获取', row)
        let loanid = row.Loanid
        let cashier = row.desc
        this.expendLoan.loanid = row.Loanid
        this.expendLoan.taskID = row.taskID
        this.getFindCommentList(loanid)
        this.getLoanInfo(loanid)
        this.tranDayDialog = true
      },
      async getLoanInfo(loanid) {
        const {
          data: res
        } = await this.$axios.post('/expendLoan/queryOneLoan', {
          loanid
        })
        if (res.length > 0) {
          const data = JSON.parse(res)
          console.log(data)
          this.dayInfoList = data.loan
          this.dayFJInfoList = data.fjlist
        } else {
          this.$message.error('获取数据失败！');
        }
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
            _this.$message.warning('借款申请已驳回！')
            console.log('办理驳回事件', res)
            _this.getBorrowMoneyList()
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
        let expendReceipt = []
        this.voucherList.map(e => {
          let obj = {}
          obj.picpath = e
          obj.isflag = "2"
          obj.recid = ""
          obj.expendid = this.expendLoan.loanid
          obj.receiptcode = ""
          expendReceipt.push(obj)
        })
        const {
          data: rulst
        } = await this.$axios.post('/expendReceipt/webSaveReceipt', {
          empcard,
          expendReceipt
        });
        this.$message.success('审批已通过！');
        console.log('办理通过事件', rulst)
        this.tranDayDialog = false
        this.getBorrowMoneyList()
        this.getBorrowMoneWaitList()
        this.getBorrowMoneFinishList()
      },
      // 查看对话框打开
      lookBtn(row) {
        let loanid = row.Loanid
        this.getFindCommentList(loanid)
        this.getLoanInfo(loanid)
        this.lookDayDialog = true
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
      // 付款信息导出
      async exportInfoBtn() {
        let empcard = sessionStorage.getItem('ulogin')
        this.$axios.post('/expendLoan/exportExcel', {
          empcard
        }).then(res => {
          console.log(res)
          let data = JSON.parse(res.data)
          let filepath = data.filepath
          let filename = data.filename
          this.$axios.get('/' + filepath + filename, {
            responseType: 'blob'
          }).then(result => {
            console.log(result)
            const blob = new Blob([result.data], {
              type: 'application/vnd.ms-excel,charset=utf-8'
            })
            const fileName = '借款信息文件.xls'
            if ('download' in document.createElement('a')) { // 非IE下载
              const elink = document.createElement('a')
              elink.download = fileName
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else { // IE10+下载
              navigator.msSaveBlob(blob, fileName)
            }
          });

        });
      }
    },
  }

</script>

<style scoped>
  #avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
  }

  #avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .travel_box .el-col div {
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 5px;
    margin-top: 8px;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333;
  }

  a {
    color: #333;
    text-decoration: none;
  }

  .travel_box_img {
    width: 330px;
  }

  .travel_box_img img {
    width: 300px;
    height: 200px;
  }

  li {
    list-style: none;
  }

  .CommentLists {
    width: 150px;
    height: 150px;
    line-height: 50px;
    border: 1px solid #eee;
    padding: 10px;
    text-align: center;
  }

  .el-collapse-item__header {
    font-size: 16px !important;
    color: #409EFF !important;
  }

  .upload_img {
    border: 1px solid #DCDFE6;
    padding: 8px;
    border-radius: 5px;
  }

</style>
