<template>
  <div class="everyday">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>报销系统</el-breadcrumb-item>
        <el-breadcrumb-item>日常报销</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button style=" margin-bottom: 16px;" size="medium" type="primary" icon="el-icon-download"
                 v-if="postidBtn == 'f938d56b40e4427dbe9e51a469e12345'? true : false" @click="exportInfoBtn">付款信息导出
      </el-button>
    </div>
    <el-card>
      <el-tabs type="border-card">
        <!-- 已申请列表视图 -->
        <el-tab-pane>
          <router-link to="/expendDaily/dayApply">
            <el-button type="primary">报销申请入口</el-button>
          </router-link>
          <span slot="label"><i class="el-icon-date"></i> 已申请列表</span>
          <el-table :data="DayMoneyList" border style="width: 100%">
            <el-table-column prop="formcode" label="表单编号" align="center">
            </el-table-column>
            <el-table-column prop="protypename" label="项目名称" align="center">
            </el-table-column>

            <el-table-column prop="deptid" label="部门名称" align="center">
            </el-table-column>
            <el-table-column prop="paymoney" label="报销金额" width="120" align="center">
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
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button :disabled="scope.row.currentstep == 2 ? false :true " type="danger" size="mini"
                           icon="el-icon-circle-plus" @click="dayNoteUploadBtn(scope.row)">票 据
                </el-button>
                <el-button :disabled="scope.row.currentstep == 2 ? false :true " type="primary" size="mini"
                           icon="el-icon-success" @click="dayApplyBtn(scope.row)">提
                  交
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 已申请列表分页  -->
          <el-pagination @current-change="handleEverydayPageChange" :page-sizes="[5]" :page-size="5"
                         layout="total, sizes, prev, pager, next, jumper" :total="+pagetotal">
          </el-pagination>
        </el-tab-pane>
        <!-- 待办理列表 -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 待办理列表</span>
          <el-table :data="DayAppleWaitList" border style="width: 100%">
            <el-table-column prop="formcode" label="表单编号" align="center">
            </el-table-column>
            <el-table-column prop="protypename" label="项目名称" align="center">
            </el-table-column>
            <el-table-column prop="deptid" label="部门名称" align="center">
            </el-table-column>
            <el-table-column prop="paymoney" label="报销金额" width="120" align="center">
            </el-table-column>
            <el-table-column prop="createbyname" label="报销人" align="center"> </el-table-column>
            <el-table-column prop="createtime" label="时间" width="200" align="center">
            </el-table-column>
            <el-table-column label="当前状态" width="80" align="center">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.currentstep == 1" size="small">流转中</el-tag>
                <el-tag v-else size="medium">待处理</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="审核步骤">
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" v-if="scope.row.currentstep == 1" icon="el-icon-edit"
                           @click="tranDayDataBtn(scope.row)">办 理
                </el-button>
                <el-button type="warning" size="mini" v-if="scope.row.currentstep == 0" icon="el-icon-edit"
                           @click="editDataBtn(scope.row.dailyid)">修 改
                </el-button>
                <el-button type="primary" size="mini" v-if="scope.row.currentstep == 0" icon="el-icon-success"
                           @click="handleEditPassBtn(scope.row)">提 交
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 待办理列表分页  -->
          <el-pagination @current-change="handleDayApple" :page-sizes="[5]" :page-size="5"
                         layout="total, sizes, prev, pager, next, jumper" :total="+Waittotal">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 已办理列表</span>
          <el-table :data="DayAppleFinishList" border style="width: 100%">
            <el-table-column prop="formcode" label="表单编号" align="center">
            </el-table-column>
            <el-table-column prop="protypename" label="项目名称" align="center">
            </el-table-column>

            <el-table-column prop="deptid" label="部门名称" align="center"> </el-table-column>
            <el-table-column prop="paymoney" label="报销金额" width="120" align="center">
            </el-table-column>
            <el-table-column prop="createbyname" label="报销人" align="center"> </el-table-column>
            <el-table-column prop="createtime" label="时间" width="200" align="center">
            </el-table-column>
            <el-table-column prop="desc" label="审核步骤" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-search" @click="lookDayAppleFinishBtn(scope.row)">查
                  看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 已办理列表分页  -->
          <el-pagination @current-change="handleDayAppleFinish" :page-sizes="[5]" :page-size="5"
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
            <el-form-item label="发票">
              <el-upload id="avatar-uploader" class="avatar-uploader" :action="uploadURL" :show-file-list="false"
                         :on-success=" res =>$set(item, 'picpath', JSON.parse(res).relationPath)">
                <img v-if="item.picpath" :src="imgURL+item.picpath" class="avatar">
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
    <!-- 查看审批意见 -->
    <el-dialog title="查看办理进度" :visible.sync="lookDayDialog" width="60%">
      <div>
        <el-collapse v-model="activeNames" accordion>
          <!-- 基础信息展示 -->
          <el-collapse-item title="基础信息" name="1">
            <div v-for="item in dayInfoList">
              <el-row class="travel_box" :gutter="20">
                <el-col :span="6">
                  <div>表单编号：{{item.formcode}}</div>
                </el-col>
                <el-col :span="6">
                  <div>项目名称：{{item.protypename}}</div>
                </el-col>
                <el-col :span="6">
                  <div>部门：{{item.deptname}}</div>
                </el-col>
                <el-col :span="6">
                  <div>报销金额：{{item.paymoney}}</div>
                </el-col>
                <el-col :span="6">
                  <div>报销人：{{item.createbyname}}</div>
                </el-col>
                <el-col :span="6">
                  <div>申请时间：{{item.createtime}}</div>
                </el-col>
                <el-col :span="6">
                  <div v-if="item.isflag == 0">报销标识：办公业务</div>
                  <div v-if="item.isflag == 1">报销标识：教学业务</div>
                  <div v-if="item.isflag == 2">报销标识：学生业务</div>
                  <div v-if="item.isflag == 3">报销标识：科研业务</div>
                </el-col>
                <el-col :span="6">
                  <div>内容摘要：{{item.expendcontent}}</div>
                </el-col>
                <el-col :span="12">
                  <div>报销要求：{{item.paydemand}}</div>
                </el-col>
                <el-col :span="12">
                  <div>报销描述：{{item.dailydesc}}</div>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
          <!-- 发票信息展示 -->
          <el-collapse-item title="发票信息" name="2">
            <div style='display: flex;'>
              <div class="travel_box travel_box_img" v-for="item in dayFpList">
                <p>发票编码：{{item.receiptcode}}</p>
                <img class="travel_box_img" :src="imgURL + item.picpath" alt="">
              </div>
            </div>
          </el-collapse-item>
          <!-- 附件 -->
          <el-collapse-item title="附件" name="3">
            <div style='display: flex;'>
              <div class="travel_box travel_box_img" v-for="item in dayfJlist">

                <a :href="imgURL + item.picpath" target="_block">
                  <p>附件名称：{{item.recname}}(点击查看详情)</p>
                </a>
                <!-- <img class="travel_box_img" :src="imgURL + item.picpath" alt=""> -->
              </div>
            </div>
          </el-collapse-item>
          <!-- 审批流程 -->
          <el-collapse-item title="审批流程" name="4">
            <div style="width: 80%; margin: 0 auto;">
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
          <!-- 凭证信息展示 -->
          <el-collapse-item title="付款凭证" name="5">
            <div style='display: flex;'>
              <div class="travel_box travel_box_img" v-for="item in daypzlist">
                <img class="travel_box_img" :src="imgURL + item.picpath" alt="">
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookDayDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 办理对话框 -->
    <el-dialog title="办理信息查看" :visible.sync="tranDayDialog" width="60%">
      <el-collapse v-model="activeNames" accordion>
        <!-- 基础信息展示 -->
        <el-collapse-item title="基础信息" name="1">
          <div v-for="item in dayInfoList">
            <el-row class="travel_box" :gutter="20">
              <el-col :span="6">
                <div>表单编号：{{item.formcode}}</div>
              </el-col>
              <el-col :span="6">
                <div>项目名称：{{item.protypename}}</div>
              </el-col>
              <el-col :span="6">
                <div>部门：{{item.deptname}}</div>
              </el-col>
              <el-col :span="6">
                <div>报销金额：{{item.paymoney}}</div>
              </el-col>
              <el-col :span="6">
                <div>报销人：{{item.createbyname}}</div>
              </el-col>
              <el-col :span="6">
                <div>申请时间：{{item.createtime}}</div>
              </el-col>
              <el-col :span="6">
                <div v-if="item.isflag == 0">报销标识：办公业务</div>
                <div v-if="item.isflag == 1">报销标识：教学业务</div>
                <div v-if="item.isflag == 2">报销标识：学生业务</div>
                <div v-if="item.isflag == 3">报销标识：科研业务</div>
              </el-col>
              <el-col :span="6">
                <div>内容摘要：{{item.expendcontent}}</div>
              </el-col>
              <el-col :span="12">
                <div>报销要求：{{item.paydemand}}</div>
              </el-col>
              <el-col :span="12">
                <div>报销描述：{{item.dailydesc}}</div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 发票信息展示 -->
        <el-collapse-item title="发票信息" name="2">
          <div style='display: flex;'>
            <div class="travel_box travel_box_img" v-for="item in dayFpList">
              <p>发票编码：{{item.receiptcode}}</p>
              <img class="travel_box_img" :src="imgURL + item.picpath" alt="">
            </div>
          </div>
        </el-collapse-item>
        <!-- 附件 -->
        <el-collapse-item title="附件" name="3">
          <div style='display: flex;'>
            <div class="travel_box travel_box_img" v-for="item in dayfJlist">
              <a :href="imgURL + item.picpath" target="_block">
                <p>附件名称：{{item.recname}}(点击查看详情)</p>
              </a>
              <!-- <img class="travel_box_img" :src="imgURL + item.picpath" alt=""> -->
            </div>
          </div>
        </el-collapse-item>
        <!-- 审批流程 -->
        <el-collapse-item title="审批流程" name="4">
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
        <el-button @click="handleRejectBtn" v-if="cashier == '待付款' ? false : true">驳 回</el-button>
        <el-button type="primary" @click="handlePassBtn">通 过</el-button>
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
        // 标识选择数据
        isflagoptions: [{
            value: "0",
            label: "办公业务"
          },
          {
            value: "1",
            label: "教学业务"
          },
          {
            value: "2",
            label: "学生业务"
          },
          {
            value: "3",
            label: "科研业务"
          }
        ],
        isCascader: false,
        isLoading: false,
        // 附件数组
        fileListS: [],
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
        dayfJlist: [],
        daypzlist: [],
        activeNames: ['1'],
        // 办理对话框隐藏
        tranDayDialog: false,
        // 查看对话框隐藏
        lookDayDialog: false,
        submitFormposition: "right",
        submitForm: {
          empcard: '',
          dailyid: '',
          fgxz: '',
          entname: ''
        },
        // 提交审核信息填写对话框隐藏
        dayAppleInfoDialog: false,
        // 已申请列表每条数据ID
        dayApplyId: '',
        // 发票上传地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        // 发票参数暂存
        noteDataList: [],
        // 发票对话框隐藏
        NoteUploadDV: false,

        // 报销申请对话框隐藏
        applyInDialog: false,

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

        cashier: '',
        // 付款凭证预览临时路径
        dialogImageUrl: '',
        // 付款凭证预览对话框隐藏
        dialogVisible: false,
        // 付款凭证数据
        voucherList: [],
        postidBtn: ''
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
      let userInfo = sessionStorage.getItem('userInfo')
      let userInfoData = JSON.parse(userInfo)
      this.postidBtn = userInfoData.postid
    },
    methods: {
      // 分页事件
      handleEverydayPageChange(newpage) {
        this.pagenum = newpage - 1
        this.getDayMoneyList()
      },
      // 获取分管校长数据
      async getRectorList() {
        const {
          data: res
        } = await this.$axios.post('/employee/queryFg')
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
          console.log('已申请数据列表', this.DayMoneyList)
        } else {
          this.$message.error('获取数据失败！');
        }
      },
      // 发票上传按钮事件
      dayNoteUploadBtn(row) {
        console.log(row)
        this.dayApplyId = row.dailyid
        this.NoteUploadDV = true
      },
      // 添加发票事件
      addNoteData() {
        this.noteDataList.push({})
      },
      // 上传发票确定按钮事件
      async addDayNoteBtn() {
        this.noteDataList.forEach(e => {
          e.recid = '',
            e.expendid = this.dayApplyId
          e.isflag = '0'
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
        this.submitForm.dailyid = row.dailyid
        this.submitForm.empcard = sessionStorage.getItem('ulogin')
        this.submitForm.entname = sessionStorage.getItem('entname')
        this.dayAppleInfoDialog = true
      },
      // 提交审核确定按钮事件
      async dayAppleInfoBtn() {
        this.isLoading = true
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
        console.log('提交审核', data)
        if (data.retCode == '1') {
          this.$message.error('提交审核失败！');
          this.isLoading = false
        } else if (data.retCode == '0') {
          this.$message.success('申请成功，待部门审批！');
          this.isLoading = false
        } else if (data.retCode == '2') {
          this.$message.error('请先上传发票信息！');
          this.isLoading = false
        }
        this.dayAppleInfoDialog = false
        this.getDayMoneyList()
        this.getDayAppleWaitList()
        this.getDayAppleFinishList()

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
          console.log(this.DayAppleWaitList);

          this.Waittotal = data.pagetotal
        } else {
          this.$message.error('获取数据失败！');
        }
      },
      // 待办理列表分页
      handleDayApple(newpage) {
        this.pagenum = newpage - 1
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
          this.DayAppleFinishList = data.dailylist
          this.Finishtotal = data.pagetotal
        } else {
          this.$message.error('获取数据失败！');
        }
      },
      // 待办理列表分页
      handleDayAppleFinish(newpage) {
        this.pagenum = newpage - 1
        this.getDayAppleFinishList()
      },
      // 办理按钮事件和数据获取
      tranDayDataBtn(row) {
        console.log('数据获取', row)
        this.cashier = row.desc
        let dailyid = row.dailyid
        this.expendDaily.dailyid = row.dailyid
        this.expendDaily.taskID = row.taskID
        this.getDailyInfo(dailyid)
        this.getFindCommentList(dailyid)
        this.tranDayDialog = true
      },
      async getDailyInfo(dailyid) {
        const {
          data: res
        } = await this.$axios.post('/expendDaily/queryOneDaily', {
          dailyid
        })
        if (res.length > 0) {
          const data = JSON.parse(res)
          console.log('办理按钮事件', data)
          this.dayInfoList = data.daily
          this.editInfoForm = data.daily[0]
          this.dayFpList = data.fplist
          this.dayfJlist = data.fjlist
          this.daypzlist = data.pzlist
          console.log('editInfoForm', this.editInfoForm)
        } else {
          this.$message.error('获取数据失败！');
        }
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
            this.$message.error('报销审批已驳回！');
            console.log('办理驳回事件', res)
            this.opinionForm.opinion = ''
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
        console.log(expendDaily);
        const {
          data: res
        } = await this.$axios.post('/expendDaily/webPassAudit', {
          empcard,
          expendDaily,
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
          obj.expendid = this.expendDaily.dailyid
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
        this.tranDayDialog = false
        this.opinionForm.opinion = ''
        this.getDayMoneyList()
        this.getDayAppleWaitList()
        this.getDayAppleFinishList()
      },
      // 查看按钮事件
      lookDayAppleFinishBtn(row) {
        console.log(row)
        let dailyid = row.dailyid
        this.getFindCommentList(dailyid)
        this.getDailyInfo(dailyid)
        this.lookDayDialog = true
      },
      // 查询审批意见
      async getFindCommentList(dailyid) {
        const {
          data: res
        } = await this.$axios.post('/expendDaily/findComment', {
          dailyid
        })
        console.log('CommentLists', res)
        this.CommentLists = JSON.parse(res)
        console.log('CommentLists', this.CommentLists)
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
      // 付款信息导出
      async exportInfoBtn() {
        let empcard = sessionStorage.getItem('ulogin')
        this.$axios.post('/expendDaily/exportExcel', {
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
            const fileName = '日常报销文件.xls'
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
      },
      // 修改按钮跳转
      editDataBtn(id) {
        this.$router.push({
          path: '/expendDaily/editDay',
          query: {
            id: id
          }
        })
      },
      // 修改后办理通过事件
      async handleEditPassBtn(row) {
        let empcard = sessionStorage.getItem('ulogin')
        let expendDaily = [{
          dailyid: row.dailyid,
          taskID: row.taskID
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
        let expendReceipt = []
        this.voucherList.map(e => {
          let obj = {}
          obj.picpath = e
          obj.isflag = "2"
          obj.recid = ""
          obj.expendid = row.dailyid
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
        this.tranDayDialog = false
        this.getDayMoneyList()
        this.getDayAppleWaitList()
        this.getDayAppleFinishList()
      },
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

  .el-collapse-item__content {
    padding-bottom: 0px;
  }

  .disabled {
    display: none;
  }

  .upload_img {
    border: 1px solid #DCDFE6;
    padding: 8px;
    border-radius: 5px;
  }

  a {
    color: #333;
    text-decoration: none;
  }

</style>
