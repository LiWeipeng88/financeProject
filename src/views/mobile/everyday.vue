<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销审批</el-breadcrumb-item>
      <el-breadcrumb-item>日常报销</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- table表格区域 -->
    <el-tabs type="border-card">
      <!-- 已申请列表视图 -->
      <el-tab-pane style="width: 100%">
        <span slot="label"><i class="el-icon-date"></i> 已申请列表</span>
        <el-table :data="DayMoneyList" border style="width: 100%">
          <el-table-column prop="formcode" label="编号" align="center">
          </el-table-column>
          <el-table-column prop="deptid" label="部门" align="center">
          </el-table-column>
          <el-table-column prop="paymoney" label="金额" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <van-button :disabled="scope.row.currentstep == 2 ? false : true" type="info" size="mini"
                          @click="goApplyBtn(scope.row)">提交</van-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已申请列表分页  -->
        <van-pagination v-model="currentPage" :total-items="+pagetotal" :items-per-page="5" @change="prevPageDay" />
      </el-tab-pane>
      <!-- 待办理列表 -->
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 待办理列表</span>
        <el-table :data="DayAppleWaitList" border style="width: 100%">
          <el-table-column prop="formcode" label="表单编号" align="center">
          </el-table-column>
          <el-table-column prop="deptid" label="部门名称" align="center">
          </el-table-column>
          <el-table-column prop="paymoney" label="报销金额" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <van-button type="info" size="mini" @click="tranDayDataBtn(scope.row)">办 理</van-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 待办理列表分页  -->
        <van-pagination v-model="WaitPage" :total-items="+Waittotal" :items-per-page="5" @change="prevPageDayWait" />
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 已办理列表</span>
        <el-table :data="DayAppleFinishList" border style="width: 100%">
          <el-table-column prop="formcode" label="表单编号" align="center">
          </el-table-column>
          <el-table-column prop="deptid" label="部门名称" align="center"> </el-table-column>
          <el-table-column prop="paymoney" label="报销金额" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <van-button type="info" size="mini" @click="lookDayAppleFinishBtn(scope.row)">查
                看</van-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已办理列表分页  -->
        <van-pagination v-model="FinishPage" :total-items="+Finishtotal" :items-per-page="5"
                        @change="prevPageDayFinish" />
      </el-tab-pane>

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
        <el-button @click="dayAppleInfoDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="dayAppleInfoBtn" size="mini">提交审核</el-button>
      </span>
    </el-dialog>
    <!-- 办理对话框 -->
    <el-dialog title="办理信息查看" :visible.sync="tranDayDialog" width="90%">
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="基础信息" name="1">
          <div v-for="item in dayInfoList">
            <el-row class="info_lsit">
              <el-col :span="24">
                <div>表单编号：{{item.formcode}}</div>
              </el-col>
              <el-col :span="24">
                <div>项目分类：{{item.protypeid}}</div>
              </el-col>
              <el-col :span="24">
                <div>部门：{{item.deptid}}</div>
              </el-col>
              <el-col :span="24">
                <div>报销金额：{{item.paymoney}}</div>
              </el-col>
              <el-col :span="24">
                <div>报销人：{{item.createbyname}}</div>
              </el-col>
              <el-col :span="24">
                <div>申请时间：{{item.createtime}}</div>
              </el-col>
              <el-col :span="24">
                <div>报销标识：{{item.isflag}}</div>
              </el-col>
              <el-col :span="24">
                <div>内容摘要：{{item.expendcontent}}</div>
              </el-col>
              <el-col :span="24">
                <div>报销要求：{{item.paydemand}}</div>
              </el-col>
              <el-col :span="24">
                <div>报销描述：{{item.dailydesc}}</div>
              </el-col>

            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="发票信息" name="2">
          <div>
            <div class="travel_box travel_box_img" v-for="item in dayFpList">
              <p>发票编码：{{item.receiptcode}}</p>
              <img class="travel_box_img" :src="imgURL + item.picpath" alt="">
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="审批流程" name="3">
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
        <el-collapse-item title="付款凭证" name="5" v-if="cashier == '待付款' ? true : false">
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
        <el-button size="mini" @click="handleRejectBtn" v-if="cashier == '待付款' ? false : true">驳 回</el-button>
        <el-button size="mini" type="primary" @click="handlePassBtn">通 过</el-button>
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
        cashier: '',
        FinishPage: 1,
        currentPage: 1,
        reverse: true,
        CommentLists: [],
        // 通过或者驳回参数
        expendDaily: {
          dailyid: '',
          taskID: '',
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
        dayInfoList: [],
        dayFpList: [],
        activeNames: ['1'],
        // 办理对话框隐藏
        tranDayDialog: false,
        // 查看对话框隐藏
        lookDayDialog: false,
        submitFormposition: "right",
        submitForm: {
          empcard: '',
          dailyid: '',
          fgxz: ''
        },
        // 提交审核信息填写对话框隐藏
        dayAppleInfoDialog: false,
        // 已申请列表每条数据ID
        dayApplyId: '',
        // 发票上传地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        isflag: '',
        // 分管校长数据
        rectorList: [],
        // 已申请列表数据
        DayMoneyList: [],
        // 分页
        pagenum: '0',
        // 总条数
        pagetotal: '0',
        Waittotal: '0',
        // 待办理数据列表
        DayAppleWaitList: [],
        // 已办理数据列表
        DayAppleFinishList: [],
        Finishtotal: '0',
        WaitPage: 1
      }
    },
    created() {
      // 调用获取分管校长函数
      this.getRectorList()
      // 调用获取已申请数据列表
      this.getDayMoneyList()
      // 调用待办理列表数据获取
      this.getDayAppleWaitList()
      // 调用已办理列表数据获取
      this.getDayAppleFinishList()
    },
    methods: {
      // 获取分管校长数据
      async getRectorList() {
        const {
          data: res
        } = await this.$axios.post('/jobpost/getFG')
        this.rectorList = JSON.parse(res)
      },
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
        } else {
          this.$message.error('获取数据失败！');
        }
      },

      // 提交审核打开对话框按钮事件
      goApplyBtn(row) {
        console.log('++++++++++')
        this.submitForm.dailyid = row.dailyid
        this.submitForm.empcard = sessionStorage.getItem('ulogin')
        this.dayAppleInfoDialog = true
      },
      // 提交审核确定按钮事件
      async dayAppleInfoBtn() {
        let empcard = this.submitForm.empcard
        let dailyid = this.submitForm.dailyid
        let fgxz = this.submitForm.fgxz
        const {
          data: res
        } = await this.$axios.post('/expendDaily/submitReview', {
          dailyid,
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
        this.getDayMoneyList()
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
          console.log(JSON.parse(res))
          let data = JSON.parse(res)
          this.DayAppleWaitList = data.dailylist
          this.Waittotal = data.pagetotal
        } else {
          this.$message.error('获取数据失败！');
        }
      },
      prevPageDayWait() {
        this.pagenum = this.WaitPage.toString() - 1
        this.getDayAppleWaitList()
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
          console.log(data)
          this.DayAppleFinishList = data.dailylist
          this.Finishtotal = data.pagetotal
        } else {
          this.$message.error('获取数据失败！');
        }
      },
      // 办理按钮事件和数据获取
      async tranDayDataBtn(row) {
        let dailyid = row.dailyid
        this.cashier = row.desc
        console.log(row)
        const {
          data: res
        } = await this.$axios.post('/expendDaily/queryOneDaily', {
          dailyid
        })
        if (res.length > 0) {
          console.log(JSON.parse(res))
          const data = JSON.parse(res)
          this.dayInfoList = data.daily
          this.dayFpList = data.fplist
        } else {
          this.$message.error('获取数据失败！');
        }
        this.expendDaily.dailyid = row.dailyid
        this.expendDaily.taskID = row.taskID
        this.getFindCommentList(dailyid)
        this.tranDayDialog = true
      },
      // 办理驳回事件
      handleRejectBtn() {
        const _this = this
        this.$refs.opinionFormRef.validate(async valid => {
          if (valid) {
            let empcard = sessionStorage.getItem('ulogin')
            let expendDaily = [{
              dailyid: _this.expendDaily.dailyid,
              taskID: _this.expendDaily.taskID
            }]
            let opinion = _this.opinionForm.opinion
            let agree = 1
            const {
              data: res
            } = await _this.$axios.post('/expendDaily/webPassAudit', {
              empcard,
              expendDaily,
              agree,
              opinion
            })
            console.log('办理驳回事件', res)
            _this.getDayMoneyList()
            _this.getDayAppleWaitList()
            _this.getDayAppleFinishList()
            _this.tranDayDialog = false
          } else {
            return _this.$message.warning('请先填写审批意见！')
          }
        })
      },
      // 办理通过事件
      async handlePassBtn() {
        let empcard = sessionStorage.getItem('ulogin')
        let expendDaily = [{
          dailyid: this.expendDaily.dailyid,
          taskID: this.expendDaily.taskID
        }]
        let opinion = this.opinionForm.opinion
        let agree = 0
        const {
          data: res
        } = await this.$axios.post('/expendDaily/webPassAudit', {
          empcard,
          expendDaily,
          agree,
          opinion
        })
        console.log('办理通过事件', res)
        this.tranDayDialog = false
        this.getDayMoneyList()
        this.getDayAppleWaitList()
        this.getDayAppleFinishList()
      },
      // 查看按钮事件
      lookDayAppleFinishBtn(row) {
        console.log(row)
        const dailyid = row.dailyid
        this.getFindCommentList(dailyid)
        this.lookDayDialog = true
      },
      // 查询审批意见
      async getFindCommentList(dailyid) {
        const {
          data: res
        } = await this.$axios.post('/expendDaily/findComment', {
          dailyid
        })
        this.CommentLists = JSON.parse(res)
        console.log(this.CommentLists)
      },
      // 已申请列表数据分页
      prevPageDay() {
        this.pagenum = this.currentPage.toString() - 1
        console.log(this.pagenum)
        this.getDayMoneyList()
      },
      // 已办理数据分页
      prevPageDayFinish() {
        this.pagenum = this.FinishPage.toString() - 1
        console.log(this.pagenum)
        this.getDayAppleFinishList()
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      uploadFileSuccess(file, fileList) {
        console.log(fileList)
        this.fileDataList.push(fileList)
      },
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

<style scoped="scoped">
  .van-pagination {
    margin-top: .875rem;
  }

  .el-breadcrumb {
    padding: .875rem;
  }

  .top_btn {
    padding-bottom: .875rem;
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

  .info_lsit .el-col div {
    padding: 6px 0px;
  }

</style>
