<template>
  <div class="edit_travel">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销系统</el-breadcrumb-item>
      <el-breadcrumb-item>差旅报销</el-breadcrumb-item>
      <el-breadcrumb-item>申请修改</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="基础信息" name="1">
          <el-form :model="travelInfo">
            <el-row :gutter="20">
              <el-col :span="5">
                <el-form-item prop="deptid" label="部门名称:">
                  <el-input v-model="travelInfo.deptname" placeholder="请输入部门编号" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item prop="deptid" label="项目名称:">
                  <el-input v-model="travelInfo.protypename" placeholder="请输入部门编号" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="报销金额:" prop="paymoney">
                  <el-input type="number" v-model="travelInfo.paymoney" placeholder="请输入报销金额" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="报销标识:" prop="isflagvalue">
                  <el-select v-model="travelInfo.isflag" placeholder="请选择" disabled>
                    <el-option v-for="(item, index) in isflagoptions" :key="item.index" :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="出差时间:" prop="starttime">
                  <el-date-picker v-model="editTime" type="daterange" disabled range-separator="至"
                                  start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="出差人:" prop="traname">
                  <el-select v-model="travelInfo.traname" multiple placeholder="请选择出差人" @visible-change="changeEmpname"
                             @remove-tag="changeEmpname">
                    <el-option v-for="item in chooseInfoList" :key="item.empid" :label="item.empname"
                               :value="item.empid">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出差人职务:" prop="postid" style="width: 100%; margin-bottom:0px">
                </el-form-item>
                <div
                     style="display: flex; border: 1px solid #DCDFE6;height: 40px; border-radius: 4px;align-items: center; overflow: hidden;">
                  <el-tag style="margin: 6px;" v-for="(item, index) in postnames" :key="index" type="info" size="mini">
                    {{item}}</el-tag>
                </div>
              </el-col>
              <el-col :span="6">
                <el-form-item label="人数:" prop="tranum">
                  <el-input v-model="tranameNum" placeholder="请输入人数"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出差地点:" prop="traaddr">
                  <el-input v-model="travelInfo.traaddr" placeholder="请输入出差地点"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="出差事由:" prop="tracause">
                  <el-input v-model="travelInfo.tracause" placeholder="请输入出差事由"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注信息:">
                  <el-input v-model="travelInfo.memo" placeholder="请输入备注信息"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
            <el-button type="primary" @click="editTravelForm">保存修改</el-button>
          </div>
        </el-collapse-item>
        <el-collapse-item title="发票信息" name="2">
          <div>
            <el-button @click="addApplyTravel" type="primary" size="mini">添加行程表单</el-button>
            <el-table :data="mxlistInfo" :default-expand-all="false">
              <el-table-column type="expand" label="发票上传" width="80">
                <template slot-scope="scope">
                  <el-button @click="addNoteList(scope.$index)" type="primary" size="mini"><i class="el-icon-plus"></i>
                    添加发票
                  </el-button>
                  <el-row type="flex" style="flex-wrap: wrap;" :gutter="40">
                    <el-col :md="6" v-for="(item, i) in mxlistInfo[scope.$index].expendReceiptlist" :key="i">
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
                  <el-select v-model="mxlistInfo[scope.$index].costtype" placeholder="请选择" @change="costchange">
                    <el-option v-for="item in costoptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="traffic" label="报销类型">
                <template slot-scope="scope">
                  <el-input v-model="mxlistInfo[scope.$index].expendtype" placeholder="请输入费用用途"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="people" label="人数">
                <template slot-scope="scope">
                  <el-input v-model="mxlistInfo[scope.$index].expendnum" placeholder="请输入人数"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="days" label="天数">
                <template slot-scope="scope">
                  <el-input v-model="mxlistInfo[scope.$index].expendday" placeholder="请输入天数"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="standard" label="费用标准">
                <template slot-scope="scope">
                  <el-input v-model="mxlistInfo[scope.$index].expendlevel" placeholder="请输入费用标准"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="money" label="金额">
                <template slot-scope="scope">
                  <el-input v-model="mxlistInfo[scope.$index].expendmoney" placeholder="请输入报销金额"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="money" label="票据">
                <template slot-scope="scope">
                  <el-input v-model="mxlistInfo[scope.$index].pagenum" placeholder="请输入票据张数"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="deleteRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
            <el-button type="primary" @click="editFpInfoBtn">保存修改</el-button>
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
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
  import GLOBAL from '../../api/global_path'
  export default {
    data() {
      return {
        reverse: true,
        CommentLists: [],
        // 图片上传URL地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        travelId: '',
        activeName: '1',
        travelInfo: {},
        mxlistInfo: [],
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
        psotId: [],
        postnames: [],
        editTime: [],
        // 出差人员信息
        chooseInfoList: [],
        keyWordForm: {
          empid: '',
          empname: '',
          deptid: '',
          postid: '',
          state: '',
          pagenum: '0'
        },
      };
    },
    computed: {
      tranameNum() {
        return this.postnames.length
      }
    },
    created() {
      console.log(this.$route.query.id);
      this.travelId = this.$route.query.id
      this.getOneTravelInfo(this.travelId)
      this.getApplyInBtn()
      this.getCommentLists()
    },
    mounted() {

    },
    methods: {
      costchange() {},
      // 获取审批意见数据
      async getCommentLists() {
        let traid = this.travelId
        const {
          data: res
        } = await this.$axios.post('/expendTravel/findComment', {
          traid
        })
        if (!res.length > 0) return this.$message.error('获取办理信息失败！')
        const data = JSON.parse(res)
        this.CommentLists = data
      },
      deleteRow(index) {
        this.xcdata.splice(index, 1);
      },
      addApplyTravel() {
        this.mxlistInfo.push({
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
      // 添加发票按钮事件
      addNoteList(index) {
        // console.log(scope)
        this.mxlistInfo[index].expendReceiptlist.push({
          recid: '',
          expendid: this.travelId,
          receiptcode: '',
          picpath: '',
          isflag: '0',
        })
      },
      async getOneTravelInfo(traid) {
        const {
          data: res
        } = await this.$axios.post('/expendTravel/queryOneTravel', {
          traid
        })
        let dataInfo = JSON.parse(res)
        this.travelInfo = dataInfo.travel[0]
        this.mxlistInfo = dataInfo.mxlist
        console.log(this.travelInfo);
        this.editTime.push(this.travelInfo.starttime)
        this.editTime.push(this.travelInfo.endtime)
        this.travelInfo.traname = this.travelInfo.traname.split(',')
        this.changeEmpname()
      },
      // 报销申请入口按钮事件
      async getApplyInBtn() {
        this.applyInDialog = true;
        let userInfo = sessionStorage.getItem('userInfo')
        let userInfoData = JSON.parse(userInfo)
        let deptid = userInfoData.deptid
        let employee = [{
          dept: {
            deptid
          },
          jobpost: {
            postid: ''
          }
        }]
        // 获取部门人员列表
        const res = await this.$axios.post('/employee/querybyDept', {
          employee
        })
        this.chooseInfoList = JSON.parse(res.data)
      },
      // 选择出差人改变事件
      changeEmpname() {
        this.travelInfo.traname.forEach(e => {
          this.postnames = []
          this.psotId = []
          this.queryInfoBtn(e)
        })
      },
      async queryInfoBtn(empid) {
        let employee = [{
          empid: empid,
          empname: '',
          dept: {
            deptid: ''
          },
          jobpost: {
            postid: ''
          },
          state: ''
        }]
        let pagenum = this.keyWordForm.pagenum;
        const {
          data: res
        } = await this.$axios.post("/employee/querybyparm", {
          employee,
          pagenum
        });
        if (res.length < 0) return;
        const data = JSON.parse(res);
        this.personLists = data.emp
        console.log('personLists', this.personLists)
        this.postnames.push(this.personLists[0].postname)
        this.psotId.push(this.personLists[0].postid)
      },
      // 基础信息修改保存事件
      async editTravelForm() {
        let expendTravel = [{
          formcode: this.travelInfo.formcode,
          traid: this.travelInfo.travelid,
          prodraid: this.travelInfo.prodraid,
          dept: {
            deptid: this.travelInfo.deptid
          },
          starttime: this.travelInfo.starttime,
          endtime: this.travelInfo.endtime,
          tracause: this.travelInfo.tracause,
          traaddr: this.travelInfo.traaddr,
          traname: this.travelInfo.traname.join(','),
          tranum: this.tranameNum,
          postid: this.psotId.join(','),
          paymoney: this.travelInfo.paymoney,
          memo: this.travelInfo.memo,
          isflag: this.travelInfo.isflag
        }];
        console.log(expendTravel)
        let empcard = sessionStorage.getItem("ulogin");
        const {
          data: res
        } = await this.$axios.post("/expendTravel/webSaveTravel", {
          expendTravel,
          empcard
        });
        let traidData = JSON.parse(res);
        console.log(traidData);
        if (traidData.retCode == 0) {
          this.$message.success("申请信息修改成功");
        } else {
          this.$message.error("申请信息修改失败");
        }
      },
      deleteRow(index) {
        this.mxlistInfo.splice(index, 1);
      },
      async editFpInfoBtn() {
        let expendTravelmx = this.mxlistInfo
        let traid = this.travelId
        const {
          data: res
        } = await this.$axios.post('/expendTravelmx/webSaveMxRec', {
          expendTravelmx,
          traid
        })
        console.log('行程单及发票', res)
        const infoData = JSON.parse(res)
        if (infoData.retCode == 0) {
          this.$message.success('行程单及发票修改成功！')
        } else {
          this.$message.error('行程单及发票修改失败！')
        }
      }
    },
  }

</script>

<style scoped>
  .el-select {
    width: 100%;
  }

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

</style>
