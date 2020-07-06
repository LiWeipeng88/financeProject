<template>
  <div class="chuchai">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>报销系统</el-breadcrumb-item>
        <el-breadcrumb-item>差旅报销</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button style=" margin-bottom: 16px;" size="medium" type="primary" icon="el-icon-download"
                 v-if="postidBtn == 'f938d56b40e4427dbe9e51a469e12345'? true : false" @click="exportInfoBtn">付款信息导出
      </el-button>
    </div>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 已申请列表</span>
          <router-link to="/expendTavel/travelApply">
            <el-button type="primary">报销申请入口</el-button>
          </router-link>

          <el-table :data="travelList" border style="width: 100%">
            <el-table-column prop="formcode" label="表单编号" align="center">
            </el-table-column>
            <el-table-column prop="protypename" label="项目名称" align="center">
            </el-table-column>
            <el-table-column prop="deptname" label="部门名称" align="center">
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
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" :disabled="scope.row.currentstep == 2 ? false :true "
                           icon="el-icon-circle-plus" @click="applyTravelBtn(scope.row)">行程
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
            <el-table-column prop="formcode" label="表单编号" align="center">
            </el-table-column>
            <el-table-column prop="protypename" label="项目名称" align="center">
            </el-table-column>
            <el-table-column prop="deptname" label="部门名称" align="center">
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
            <el-table-column prop="desc" label="审核步骤" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" v-if="scope.row.currentstep == 1" icon="el-icon-success"
                           @click="transactBtn(scope.row)">办理
                </el-button>
                <el-button type="warning" size="mini" v-if="scope.row.currentstep == 0" icon="el-icon-edit"
                           @click="editDataBtn(scope.row)">修 改
                </el-button>
                <el-button type="primary" size="mini" v-if="scope.row.currentstep == 0" icon="el-icon-success"
                           @click="handleEditPassBtn(scope.row)">提 交
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
            <el-table-column prop="formcode" label="表单编号" align="center">
            </el-table-column>
            <el-table-column prop="protypename" label="项目名称" align="center">
            </el-table-column>
            </el-table-column>
            <el-table-column prop="deptname" label="部门名称" align="center">
            </el-table-column>
            <el-table-column prop="paymoney" label="报销金额" width="120" align="center">
            </el-table-column>
            <el-table-column prop="createbyname" label="报销人" align="center"> </el-table-column>
            <el-table-column prop="createtime" label="时间" width="200" align="center">
            </el-table-column>
            <el-table-column prop="desc" label="审核步骤" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
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
    <!--行程信息填写对话框  -->
    <el-dialog title="报销申请行程单填写" :visible.sync="applyTravelDialog" width="80%">
      <el-collapse v-model="activeTravelNames" accordion>
        <el-collapse-item title="已填写信息发票查看" name="1">
          <div v-for="item in mxlistData" style="border: 1px solid #999; padding: 20px; margin-bottom: 16px;">
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
              <el-col :span="24">
                <div style='display: flex;'>
                  <div style="border: none;" class="travel_box travel_box_img" v-for="items in item.expendReceiptlist">
                    <p>发票编码：{{items.receiptcode}}</p>
                    <img class="travel_box_img" :src="imgURL + items.picpath" alt="">
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <el-collapse-item title="新增信息发票填写" name="2">
          <div>
            <el-button @click="addApplyTravel" type="primary" size="mini">添加行程表单</el-button>
            <el-table :data="xcdata" :default-expand-all="true">
              <el-table-column type="expand" label="发票上传" width="80">
                <template slot-scope="scope">
                  <el-button @click="addNoteList(scope.$index)" type="primary" size="mini"><i class="el-icon-plus"></i>
                    添加发票
                  </el-button>
                  <el-row type="flex" style="flex-wrap: wrap;" :gutter="40">
                    <el-col :md="6" v-for="(item, i) in xcdata[scope.$index].expendReceiptlist" :key="i">
                      <el-form>
                        <el-form-item label="发票编码">
                          <el-input v-model="item.receiptcode"></el-input>
                        </el-form-item>
                        <el-form-item label="标识" style="display: none;">
                          <el-input v-model="item.isflag"></el-input>
                        </el-form-item>
                        <el-form-item label="发票">
                          <el-upload id="avatar-uploader" class="avatar-uploader" :action="uploadURL"
                                     :show-file-list="false"
                                     :on-success="res => $set(item,'picpath', JSON.parse(res).relationPath)">
                            <img v-if="item.picpath" :src="imgURL + item.picpath" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                          </el-upload>
                        </el-form-item>
                      </el-form>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
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
                  <el-input v-model="xcdata[scope.$index].expendlevel" placeholder="请输入费用标准"></el-input>
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
        </el-collapse-item>
      </el-collapse>

      <span slot="footer" class="dialog-footer">
        <el-button @click="applyTravelDialog = false">取 消</el-button>
        <el-button type="primary" @click="addApplyTravelForm">立即上传</el-button>
      </span>
    </el-dialog>
    <!-- 提交审核对话框 -->
    <el-dialog title="提交审核" :visible.sync="submitAuditDialog" width="50%" :before-close="submitAuditClose">
      <el-form ref="submitFormRef" :model="submitForm" :label-position="submitFormposition">
        <el-form-item label="申请人" label-width="80px">
          <el-input v-model="submitForm.entname" disabled></el-input>
        </el-form-item>
        <el-form-item label="分管校长" label-width="80px">
          <el-select v-model="submitValue" placeholder="请选择分管校长" @change="submitFormChange">
            <el-option v-for="item in rectorList" :key="item.empcard" :label="item.empname" :value="item.empcard">
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
    <el-dialog title="报销信息查看" :visible.sync="transacTdialog" width="70%">
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="基础信息" name="1">
          <div v-for="item in travelData">
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
              <el-col :span="24">
                <div style='display: flex;'>
                  <div style="border: none;" class="travel_box travel_box_img" v-for="items in item.expendReceiptlist">
                    <p>发票编码：{{items.receiptcode}}</p>
                    <img class="travel_box_img" :src="imgURL + items.picpath" alt="">
                  </div>
                </div>
              </el-col>
            </el-row>
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
        <el-collapse-item title="付款凭证" name="4" v-if="cashier == '待付款' ? true : false">
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
    <!-- 查看审批意见 -->
    <el-dialog title="查看办理进度" :visible.sync="lookTransacDialog" width="60%">
      <div>
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item title="基础信息" name="1">
            <div v-for="item in travelData">
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
                <el-col :span="24">
                  <div style='display: flex;'>
                    <div style="border: none;" class="travel_box travel_box_img"
                         v-for="items in item.expendReceiptlist">
                      <p>发票编码：{{items.receiptcode}}</p>
                      <img class="travel_box_img" :src="imgURL + items.picpath" alt="">
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
          <el-collapse-item title="审批流程" name="3">
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
          <el-collapse-item title="付款凭证" name="4">
            <div style='display: flex;'>
              <div class="travel_box travel_box_img" v-for="item in pzlistData">
                <img class="travel_box_img" :src="imgURL + item.picpath" alt="">
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
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
        activeTravelNames: ['1'],
        isLoading: false,
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
        pzlistData: [],
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
          mxid: "",
          costtype: "",
          expendtype: "",
          expendnum: "",
          expendday: "",
          expendlevel: "",
          pagenum: "",
          expendmoney: "",
          expendReceiptlist: [{
            recid: '',
            expendid: '',
            receiptcode: '',
            picpath: '',
            isflag: '0',
          }]
        }],
        activeName: "first",
        tabPosition: "left",
        labelPosition: "left",
        tableForm: {},
        value1: "",

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
        trafficvalue: "",
        cashier: '',
        // 付款凭证预览临时路径
        dialogImageUrl: '',
        // 付款凭证预览对话框隐藏
        dialogVisible: false,
        // 付款凭证数据
        voucherList: [],
        postidBtn: ''
      };
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
      this.postidBtn = userInfoData.postid
    },
    methods: {
      handleClick(tab) {
        console.log(tab.name);
      },
      addApplyTravel() {
        this.xcdata.push({
          mxid: "",
          costtype: "",
          expendtype: "",
          expendnum: "",
          expendday: "",
          expendlevel: "",
          pagenum: "",
          expendmoney: "",
          expendReceiptlist: [{
            recid: '',
            expendid: '',
            receiptcode: '',
            picpath: '',
            isflag: '0',
          }]
        });
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
        console.log('travelList', this.travelList);

      },

      // 项目选择事件
      handleProList(val) {
        console.log(val)
      },
      // 行程信息填写按钮对话框事件
      applyTravelBtn(row) {
        this.applyTravelDialog = true;
        this.traid = row.travelid
        let traid = row.travelid
        this.getTravelInfo(traid)
      },
      // 票据上传对话框事件
      noteUploadBtn(row) {
        this.noteUploadDialog = true;
        this.traid = row.travelid
      },
      // 行程数据提交
      addApplyTravelForm() {
        console.log(this.xcdata)
        let expendTravelmx = this.xcdata
        this.xcdata.forEach(e => {
          if (!e.costtype && !e.expendnum && !e.expendday && !e.expendlevel && !e.pagenum && !e
            .expendmoney) {
            this.applyTravelDialog = false
            this.$message.error('未填写提交信息！')
            return false;
          } else {
            let traid = this.traid
            this.$axios.post('/expendTravelmx/webSaveMxRec', {
              expendTravelmx,
              traid
            })
            this.getTravelList()
            this.applyTravelDialog = false
            this.$message.success('行程单及发票上传成功！')
          }
          console.log('tijiao')
        });

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
        } = await this.$axios.post('/employee/queryFg')
        this.rectorList = JSON.parse(res)
      },
      // 分管校长选择
      submitFormChange() {
        this.submitForm.fgxz = this.submitValue
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
          this.getTravelList()
          this.$message.error('提交审核失败！');
          this.isLoading = false
        } else if (submitData.retCode == '0') {
          this.getTravelList()
          this.getYesApproveList()
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
        console.log('yesApproveDataList', this.yesApproveDataList)
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
      addNoteList(index) {
        // console.log(scope)
        this.xcdata[index].expendReceiptlist.push({
          recid: '',
          expendid: '',
          receiptcode: '',
          picpath: '',
          isflag: '0',
        })
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
      transactBtn(row) {
        console.log('流程办理', row)
        this.cashier = row.desc
        this.expendTravel.traid = row.travelid
        this.expendTravel.taskID = row.taskID
        let traid = row.travelid
        this.getTravelInfo(traid)
        this.transacTdialog = true
        this.getCommentLists(traid)
      },
      async getTravelInfo(traid) {
        const {
          data: res
        } = await this.$axios.post('/expendTravel/queryOneTravel', {
          traid
        })
        console.log(JSON.parse(res))
        let transactData = JSON.parse(res)
        this.travelData = transactData.travel
        this.mxlistData = transactData.mxlist
        this.fplistData = transactData.expendReceiptlist
        this.pzlistData = transactData.pzlist
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
            _this.opinionForm.opinion = ''
            _this.transacTdialog = false
            _this.getYesApproveList()
            _this.getNoApproveList()
            _this.getTravelList()

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
        this.opinionForm.opinion = ''
        this.getYesApproveList()
        this.getNoApproveList()
        this.getTravelList()
      },
      // 查看流程事件
      lookTransacBtn(row) {
        let traid = row.travelid
        this.getTravelInfo(traid)
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
      // 获取部门数据
      async getPostList() {
        const res = await this.$axios.post('/department/queryListallnew', {
          deptid: 0
        })
        this.allPostList = JSON.parse(res.data)
        console.log(this.allPostList)
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
        this.$axios.post('/expendTravel/exportExcel', {
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
            const fileName = '差旅报销文件.xls'
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
      editDataBtn(row) {
        let id = row.travelid
        this.$router.push({
          path: "/expendTavel/editTravel",
          query: {
            id: id
          }
        })
      },
      async handleEditPassBtn(row) {
        console.log(row);

        let empcard = sessionStorage.getItem('ulogin')
        let expendTravel = [{
          traid: row.travelid,
          taskID: row.taskID
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
        this.getYesApproveList()
        this.getNoApproveList()
        this.getTravelList()
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
