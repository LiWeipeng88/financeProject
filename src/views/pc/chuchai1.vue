<template>
  <div class="chuchai">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销系统</el-breadcrumb-item>
      <el-breadcrumb-item>差旅报销</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 已申请列表</span>
          <el-button type="primary" @click="applyInBtn">报销申请入口</el-button>
          <el-table :data="travelList" border style="width: 100%">
            <el-table-column prop="formcode" label="表单编号">
            </el-table-column>
            <el-table-column prop="protypeid" label="项目分类">
            </el-table-column>
            <el-table-column prop="deptname" label="部门名称">
            </el-table-column>
            <el-table-column prop="paymoney" label="报销金额" width="120">
            </el-table-column>
            <el-table-column prop="createbyname" label="报销人" width="180"> </el-table-column>
            <el-table-column prop="createtime" label="时间" width="180">
            </el-table-column>
            <el-table-column label="当前状态" width="80">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.currentstep == 1" size="small">流转中</el-tag>
                <el-tag v-else size="medium">待处理</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="280">
              <template slot-scope="scope">
                <el-button type="success" size="mini" icon="el-icon-edit" @click="applyTravelBtn(scope.row)">行程
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-circle-plus" @click="noteUploadBtn(scope.row)">票据
                </el-button>
                <el-button :disabled="scope.row.currentstep == 2 ? false :true " type="primary" size="mini"
                           icon="el-icon-success" @click="submitAuditBtn(scope.row)">提交
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="handleTravelCurrentChange" :page-sizes="[5]" :page-size="5"
                         layout="total, sizes, prev, pager, next, jumper" :total="+pagetotal">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 待审批列表</span>
          <el-table :data="approveDataList" border style="width: 100%">
            <el-table-column prop="formcode" label="表单编号">
            </el-table-column>
            <el-table-column prop="protypeid" label="项目分类" width="300">
            </el-table-column>
            <el-table-column prop="deptname" label="部门名称">
            </el-table-column>
            <el-table-column prop="paymoney" label="报销金额" width="120">
            </el-table-column>
            <el-table-column prop="createbyname" label="报销人"> </el-table-column>
            <el-table-column prop="createtime" label="时间" width="180">
            </el-table-column>
            <el-table-column prop="currentstep" label="当前状态" width="80">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.currentstep == 1" size="small">流转中</el-tag>
                <el-tag v-else size="medium">待处理</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="审核步骤">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-success" @click="transactBtn(scope.row)">办理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="handleapproveCurrentChange" :page-sizes="[5]" :page-size="5"
                         layout="total, sizes, prev, pager, next, jumper" :total="+approvepagetotal">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 已审批列表</span>
          <el-table :data="yesApproveDataList" border style="width: 100%">
            <el-table-column prop="formcode" label="表单编号">
            </el-table-column>
            <el-table-column prop="protypeid" label="项目分类" width="300">
            </el-table-column>
            <el-table-column prop="deptname" label="部门名称">
            </el-table-column>
            <el-table-column prop="paymoney" label="报销金额" width="120">
            </el-table-column>
            <el-table-column prop="createbyname" label="报销人"> </el-table-column>
            <el-table-column prop="createtime" label="时间" width="180">
            </el-table-column>
            <el-table-column prop="desc" label="审核步骤">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-success" @click="lookTransacBtn(scope.row)">查 看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @current-change="handleyesApprove" :page-sizes="[5]" :page-size="5"
                         layout="total, sizes, prev, pager, next, jumper" :total="+yesApprovepagetotal">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewPath" style="width: 100%;" alt="" />
    </el-dialog>
    <!-- 报销申请入口对话框 -->
    <el-dialog title="报销申请明细填写" :visible.sync="applyInDialog" width="50%" :before-close="handleApplyInClose">
      <div>
        <el-form :model="travelTableForm" ref="travelTableRef" :rules="travelTableFormRules">
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item prop="deptid" label="部门编号:" style="width: 100%;">
                <el-input v-model="travelTableForm.deptname" placeholder="请输入部门编号"></el-input>
                <!-- <el-select v-model="travelTableForm.deptid" placeholder="请选择部门">
                  <el-option v-for="item in allPostList" :key="item.deptid" :label="item.deptname" :value="item.deptid">
                  </el-option>
                </el-select> -->
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="protypeid" label="项目编号:">
                <el-input v-model="travelTableForm.protypeid" placeholder="请输入项目编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="报销金额:" prop="paymoney">
                <el-input type="number" v-model="travelTableForm.paymoney" placeholder="请输入报销金额"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="报销标识:" prop="isflagvalue">
                <el-select v-model="travelTableForm.isflagvalue" placeholder="请选择" @change="isflagchange">
                  <el-option v-for="(item, index) in isflagoptions" :key="item.index" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="5">
              <el-form-item label="出差人:" prop="traname">
                <el-input v-model="travelTableForm.traname" placeholder="请输入出差人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="出差人职务:" prop="postid">
                <el-input v-model="travelTableForm.postid" placeholder="请输入职务"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="人数:" prop="tranum">
                <el-input v-model="travelTableForm.tranum" placeholder="请输入人数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="出差地点:" prop="traaddr">
                <el-input v-model="travelTableForm.traaddr" placeholder="请输入出差地点"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="出差事由:" prop="tracause">
                <el-input v-model="travelTableForm.tracause" placeholder="请输入出差事由"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="备注信息:">
                <el-input v-model="travelTableForm.memo" placeholder="请输入备注信息"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="出差时间:" prop="valueTime">
                <el-date-picker v-model="travelTableForm.valueTime" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="applyInDialog = false">取 消</el-button>
        <el-button type="primary" @click="addTravelForm">确 认</el-button>
      </span>
    </el-dialog>
    <!--行程信息填写对话框  -->
    <el-dialog title="报销申请行程单填写" :visible.sync="applyTravelDialog" width="70%">
      <div>
        <el-button @click="addApplyTravel" type="primary" size="mini">添加行程表单</el-button>
        <el-table :data="xcdata">
          <el-table-column prop="cost" label="费用类别">
            <template slot-scope="scope">
              <el-select v-model="xcdata[scope.$index].costtype" placeholder="请选择" @change="costchange">
                <el-option v-for="item in costoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="traffic" label="报销类型">
            <template slot-scope="scope">
              <el-input v-model="xcdata[scope.$index].expendtype" placeholder="请输入费用用途"></el-input>
              <!-- <el-select :disabled="isDisabled" v-model="xcdata[scope.$index].expendtype" placeholder="请选择">
                <el-option v-for="item in trafficoptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select> -->
            </template>
          </el-table-column>
          <el-table-column prop="people" label="人数">
            <template slot-scope="scope">
              <el-input v-model="xcdata[scope.$index].expendnum" placeholder="请输入人数"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="days" label="天数">
            <template slot-scope="scope">
              <el-input v-model="xcdata[scope.$index].expendday" placeholder="请输入天数"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="standard" label="费用标准">
            <template slot-scope="scope">
              <el-input v-model="xcdata[scope.$index].expendlevel" placeholder="请输入费用标准金额"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="money" label="金额">
            <template slot-scope="scope">
              <el-input v-model="xcdata[scope.$index].expendmoney" placeholder="请输入报销金额"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="money" label="票据">
            <template slot-scope="scope">
              <el-input v-model="xcdata[scope.$index].pagenum" placeholder="请输入票据张数"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="deleteRow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="applyTravelDialog = false">取 消</el-button>
        <el-button type="primary" @click="addApplyTravelForm">立即提交</el-button>
      </span>
    </el-dialog>
    <!-- 票据上传对话框 -->
    <el-dialog title="票据上传" :visible.sync="noteUploadDialog" width="50%">
      <div>
        <el-button @click="addNoteList" type="primary" size="mini"><i class="el-icon-plus"></i> 添加发票</el-button>
        <el-row type="flex" style="flex-wrap: wrap;" :gutter="40">
          <el-col :md="12" v-for="(item, i) in noteData" :key="i">
            <el-form>
              <el-form-item label="发票编码">
                <el-input v-model="item.receiptcode"></el-input>
              </el-form-item>
              <el-form-item label="标识">
                <el-input v-model="item.isflag"></el-input>
              </el-form-item>
              <el-form-item label="发票">
                <el-upload id="avatar-uploader" class="avatar-uploader" :action="uploadURL" :show-file-list="false"
                           :on-success="res => $set(item,'picpath', JSON.parse(res).relationPath)">
                  <img v-if="item.picpath" :src="imgURL + item.picpath" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noteUploadDialog = false">取 消</el-button>
        <el-button type="primary" @click="addNoteUpload">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 提交审核对话框 -->
    <el-dialog title="提交审核" :visible.sync="submitAuditDialog" width="50%" :before-close="submitAuditClose">
      <el-form ref="submitFormRef" :model="submitForm" :label-position="submitFormposition">
        <el-form-item label="申请人" label-width="80px">
          <el-input v-model="submitForm.empcard" disabled></el-input>
        </el-form-item>
        <el-form-item label="分管校长" label-width="80px">
          <el-select v-model="submitValue" placeholder="请选择分管校长" @change="submitFormChange">
            <el-option v-for="item in rectorList" :key="item.postid" :label="item.postname" :value="item.postid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitAuditDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSubmitAudit">提交审核</el-button>
      </span>
    </el-dialog>
    <!-- 办理审核对话框 -->
    <el-dialog title="报销信息查看" :visible.sync="transacTdialog" width="70%">
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="基础信息" name="1">
          <div v-for="item in travelData">
            <el-row class="travel_box" :gutter="20">
              <el-col :span="6">
                <div>申报Id：{{item.travelid}}</div>
              </el-col>
              <el-col :span="6">
                <div>项目分类：{{item.protypeid}}</div>
              </el-col>
              <el-col :span="6">
                <div>表单编号：{{item.formcode}}</div>
              </el-col>
              <el-col :span="6">
                <div>部门：{{item.deptname}}</div>
              </el-col>
              <el-col :span="6">
                <div>报销金额：{{item.paymoney}}</div>
              </el-col>
              <el-col :span="6">
                <div>报销人：{{item.createby}}</div>
              </el-col>
              <el-col :span="6">
                <div>申请时间：{{item.createtime}}</div>
              </el-col>
              <el-col :span="6">
                <div>审批步骤：{{item.currentstep}}</div>
              </el-col>
            </el-row>

          </div>
        </el-collapse-item>
        <el-collapse-item title="明细信息" name="2">
          <div v-for="item in mxlistData">
            <el-row :gutter="20" class="travel_box">
              <el-col :span="4">
                <div>费用类别：{{item.costtype}}</div>
              </el-col>
              <el-col :span="4">
                <div>报销类型：{{item.expendtype}}</div>
              </el-col>
              <el-col :span="4">
                <div>人数：{{item.expendnum}}</div>
              </el-col>
              <el-col :span="4">
                <div>天数：{{item.expendday}}</div>
              </el-col>
              <el-col :span="4">
                <div>费用标准：{{item.expendlevel}}</div>
              </el-col>
              <el-col :span="4">
                <div>报销金额：{{item.expendmoney}}</div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="发票信息" name="3">
          <div style='display: flex;'>
            <div class="travel_box travel_box_img" v-for="item in fplistData">
              <p>发票编码：{{item.receiptcode}}</p>
              <img class="travel_box_img" :src="imgURL + item.picpath" alt="">
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
      <el-form :model="opinionForm" :rules="opinionFormRules" ref="opinionFormRef">
        <el-form-item label="审批意见" prop="opinion">
          <el-input type="textarea" v-model="opinionForm.opinion"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleRejectBtn">驳 回</el-button>
        <el-button type="primary" @click="handlePassBtn">通 过</el-button>
      </span>
    </el-dialog>
    <!-- 查看审批意见 -->
    <el-dialog title="查看办理进度" :visible.sync="lookTransacDialog" width="50%">
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
  import GLOBAL from '../../api/global_path'
  export default {
    data() {
      return {
        // 部门数据
        allPostList: [],
        isDisabled: true,
        reverse: true,
        CommentLists: [],
        // 查看审批意见对话框的隐藏
        lookTransacDialog: false,
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
        travelData: [],
        mxlistData: [],
        fplistData: [],
        activeNames: ['1'],
        // 办理对话框的隐藏
        transacTdialog: false,
        // 发票数据
        noteData: [],
        // 已审批总条数
        yesApprovepagetotal: '',
        // 已审批数据列表
        yesApproveDataList: [],
        // 待审批数据列表
        approveDataList: [],
        // 待审批总条数
        approvepagetotal: '',
        // 已申请总条数
        pagetotal: '',
        rectorList: [],
        submitFormposition: "right",
        submitForm: {
          empcard: '',
          traid: '',
          entname: '',
          fgxz: ''
        },
        submitValue: '',
        // 提交审核对话框
        submitAuditDialog: false,
        // 票据上传对话框隐藏
        noteUploadDialog: false,
        // 行程信息填写对话框隐藏
        applyTravelDialog: false,
        // 报销申请入口对话框隐藏
        applyInDialog: false,
        pagenum: "0",
        travelList: [],
        traid: "",
        travelTableForm: {
          deptid: "",
          protypeid: "743375a5dcd24ff09997dfe4fc8b1d8a",
          entname: '',
          paymoney: "",
          traname: '',
          postid: "",
          tranum: "",
          traaddr: "",
          tracause: "",
          memo: "",
          valueTime: "",
          isflagvalue: ""
        },
        // 验证表单规则
        travelTableFormRules: {
          deptid: [{
            required: true,
            message: "请输入部门编号",
            trigger: "blur"
          }],
          protypeid: [{
            required: true,
            message: "请输入项目编号",
            trigger: "blur"
          }],
          paymoney: [{
            required: true,
            message: "请输入报销金额",
            trigger: "blur"
          }],
          traname: [{
            required: true,
            message: "请输入出差人",
            trigger: "blur"
          }],
          postid: [{
            required: true,
            message: "请输入职务",
            trigger: "blur"
          }],
          tranum: [{
            required: true,
            message: "请输入人数",
            trigger: "blur"
          }],
          traaddr: [{
            required: true,
            message: "请输入出差地点",
            trigger: "blur"
          }],
          tracause: [{
            required: true,
            message: "请输入出差事由",
            trigger: "blur"
          }],
          isflagvalue: [{
            required: true,
            message: "请选择活动资源",
            trigger: "change"
          }],
          valueTime: [{
            required: true,
            message: "请选择活动资源",
            trigger: "change"
          }]
        },
        valueTime: "",
        formcode: "",
        // 图片预览对话框显示隐藏
        previewDialogVisible: false,
        // 预览图片地址
        previewPath: "",
        // 图片数组
        picNum: [],
        // 图片上传URL地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        xcdata: [{
          costtype: "",
          expendtype: "",
          expendnum: "",
          expendday: "",
          expendlevel: "",
          pagenum: "",
          expendmoney: ""
        }],
        activeName: "first",
        tabPosition: "left",
        labelPosition: "left",
        tableForm: {},
        value1: "",
        isflagvalue: "",
        isflagoptions: [{
            value: "0",
            label: "二级院办公业务"
          },
          {
            value: "0",
            label: "行政部门"
          },
          {
            value: "1",
            label: "教学业务"
          },
          {
            value: "2",
            label: "学生业务"
          }
        ],
        costoptions: [{
            value: "交通费",
            label: "交通费"
          },
          {
            value: "市内交通",
            label: "市内交通"
          },
          {
            value: "住宿费",
            label: "住宿费"
          },
          {
            value: "伙食补贴",
            label: "伙食补贴"
          },
          {
            value: "其他",
            label: "其他"
          }
        ],
        costvalue: "",
        trafficoptions: [{
            value: "火车",
            label: "火车"
          },
          {
            value: "汽车",
            label: "汽车"
          },
          {
            value: "飞机",
            label: "飞机"
          },
          {
            value: "其他",
            label: "其他"
          }
        ],
        trafficvalue: ""
      };
    },
    computed: {

    },
    created() {
      this.getTravelList();
      // 调用获取分管校长函数
      this.getRectorList()
      this.getNoApproveList()
      this.getYesApproveList()
      // this.getPersonList()
      this.getPostList()
      let userInfo = sessionStorage.getItem('userInfo')
      let userInfoData = JSON.parse(userInfo)
      this.travelTableForm.deptid = userInfoData.deptid
      this.travelTableForm.deptname = userInfoData.deptname
    },
    methods: {
      handleClick(tab) {
        console.log(tab.name);
      },
      addApplyTravel() {
        this.xcdata.push({});
      },
      deleteRow(index) {
        this.xcdata.splice(index, 1);
      },
      // 上传图片预览事件
      handlePreview(file) {
        const picData = JSON.parse(file.response);
        const filePath = picData.relationPath;
        this.previewPath = this.imgURL + filePath;
        this.previewDialogVisible = true;
        console.log(file);
      },
      // 删除图片的操作
      handleRemove(file) {
        const picData = JSON.parse(file.response);
        const filePath = picData.relationPath;
        const i = this.picNum.findIndex(x => x === filePath);
        this.picNum.splice(i, 1);
        console.log(i);
        console.log(picData.relationPath);
        console.log(this.picNum);
      },
      // 图片上传成功的回调
      handleImgSuccess(res) {
        const data = JSON.parse(res);
        this.picNum.push(data.relationPath);
        console.log(this.picNum);
      },
      costchange() {
        this.xcdata.forEach(e => {
          if (e.costtype == "交通费") {
            this.isDisabled = false
            console.log('false')
          } else {
            this.isDisabled = true
            console.log('true')
          }
        })
      },
      isflagchange() {
        console.log("isflagvalue", this.isflagvalue);
      },
      // 明细信息数据提交
      addTravelForm() {
        this.$refs.travelTableRef.validate(async valid => {
          var _this = this;
          if (valid) {
            let expendTravel = [{
              traid: "",
              proType: {
                protypeid: _this.travelTableForm.protypeid
              },
              dept: {
                deptid: _this.travelTableForm.deptid
              },
              starttime: _this.travelTableForm.valueTime[0],
              endtime: _this.travelTableForm.valueTime[1],
              tracause: _this.travelTableForm.tracause,
              traaddr: _this.travelTableForm.traaddr,
              traname: _this.travelTableForm.traname,
              tranum: _this.travelTableForm.tranum,
              postid: _this.travelTableForm.postid,
              paymoney: _this.travelTableForm.paymoney,
              memo: _this.travelTableForm.memo,
              isflag: _this.travelTableForm.isflagvalue
            }];
            let empcard = sessionStorage.getItem("ulogin");
            console.log("expendTravel", expendTravel);
            console.log("empcard", empcard);
            const {
              data: res
            } = await this.$axios.post(
              "/expendTravel/webSaveTravel", {
                expendTravel,
                empcard
              }
            );
            let traidData = JSON.parse(res);
            _this.traid = traidData.traid;
            _this.getTravelList();
            _this.applyInDialog = false;
            _this.handleApplyInClose();
            console.log("明细信息数据提交", traidData.traid);
            this.$message.success("明细信息数据提交成功");
          } else {
            return this.$message.error("请完善明细信息");
          }
        });
      },
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
        console.log(res)
        let travelData = JSON.parse(res)
        this.travelList = travelData.tralist;
        this.pagetotal = travelData.pagetotal;
      },
      // 报销申请入口按钮事件
      applyInBtn() {
        this.applyInDialog = true;
      },
      // 行程信息填写按钮对话框事件
      applyTravelBtn(row) {
        this.applyTravelDialog = true;
        this.traid = row.travelid
      },
      // 票据上传对话框事件
      noteUploadBtn(row) {
        this.noteUploadDialog = true;
        this.traid = row.travelid
      },
      // 报销申请入口对话框关闭事件
      handleApplyInClose() {
        this.applyInDialog = false;
        this.$refs.travelTableRef.resetFields();
      },
      // 行程数据提交
      async addApplyTravelForm() {
        console.log("this.traid", this.traid);
        this.xcdata.forEach((item, index) => {
          item.mxid = ''
        })
        let expendTravelmx = this.xcdata
        let traid = this.traid
        const {
          data: res
        } = await this.$axios.post('/expendTravelmx/webSaveTravelmx', {
          expendTravelmx,
          traid
        })
        console.log("res", res);
        this.applyTravelDialog = false
        console.log("this.xcdata", this.xcdata);
      },
      // 提交审核事件
      submitAuditBtn(row) {
        this.submitForm.traid = row.travelid
        this.submitForm.empcard = sessionStorage.getItem('ulogin');
        this.submitForm.entname = sessionStorage.getItem('entname')
        this.submitAuditDialog = true
        this.getYesApproveList()
      },
      // 提交审核对话框关闭事件
      submitAuditClose() {
        this.submitAuditDialog = false
      },
      // 获取分管校长数据
      async getRectorList() {
        const {
          data: res
        } = await this.$axios.post('/jobpost/getFG')
        this.rectorList = JSON.parse(res)
      },
      // 分管校长选择
      submitFormChange() {
        this.submitForm.fgxz = this.submitValue
      },
      //点击提交审核按钮事件
      async addSubmitAudit() {
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
        if (submitData.retCode == 0) {
          this.$message({
            message: '申请成功，待部门审批！',
            type: 'success'
          });
        } else {
          this.$message({
            message: '提交申请失败！',
            type: 'error'
          });
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
      // 查看已申请列表数据分页
      handleTravelCurrentChange(newPage) {
        this.pagenum = newPage - 1
        this.getTravelList()
      },
      // 待审批列表分页
      handleapproveCurrentChange(newPage) {
        this.pagenum = newPage - 1
        this.getNoApproveList()
      },
      // 已审批列表分页
      handleyesApprove(newPage) {
        this.pagenum = newPage - 1
        this.getYesApproveList()
      },
      // 添加发票按钮事件
      addNoteList() {
        this.noteData.push({})
      },
      // 发票上传提交按钮事件
      async addNoteUpload() {
        this.noteData.forEach(e => {
          e.recid = "",
            e.expendid = this.traid
        })
        let expendReceipt = this.noteData
        const {
          data: res
        } = await this.$axios.post('/expendReceipt/webSaveReceipt', {
          expendReceipt
        })
        console.log('this.noteData', res)
        this.noteUploadDialog = false
      },
      // 流程办理按钮事件
      async transactBtn(row) {
        console.log('流程办理', row)
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
        this.$message.success('报销申请已通过！')
        this.transacTdialog = false
        this.getYesApproveList()
        this.getNoApproveList()
        this.getTravelList()
      },
      // 查看流程事件
      lookTransacBtn(row) {
        let traid = row.travelid
        this.getCommentLists(traid)
        this.lookTransacDialog = true
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
      // // 获取人员数据列表
      // async getPersonList() {
      //   const res = await this.$axios.post('/employee/querybyparm')
      //   console.log('getPersonList', res)
      // },
      // 获取部门数据
      async getPostList() {
        const res = await this.$axios.post('/department/queryListallnew', {
          deptid: 0
        })
        this.allPostList = JSON.parse(res.data)
        console.log(this.allPostList)
      }
    }
  };

</script>

<style scoped="scoped">
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

  .time_code {
    line-height: 8px;
  }

  .time_code_row {
    margin-bottom: 20px;
  }

  .el-collapse-item__header {
    font-size: 22px !important;
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

</style>
