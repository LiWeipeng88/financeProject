<template>
  <div class="edit_day">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销系统</el-breadcrumb-item>
      <el-breadcrumb-item>日常报销</el-breadcrumb-item>
      <el-breadcrumb-item>申请修改</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-form ref="form" :model="editInfoForm">
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item title="基础信息" name="1">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="申报Id：">
                  <el-input v-model="editInfoForm.dailyid" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="项目分类：">
                  <el-input v-model="editInfoForm.protypename" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="表单编号：">
                  <el-input v-model="editInfoForm.formcode" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="部门：">
                  <el-input v-model="editInfoForm.deptname" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="报销金额：">
                  <el-input v-model="editInfoForm.paymoney" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="报销人：">
                  <el-input v-model="editInfoForm.createbyname" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="申请时间：">
                  <el-input v-model="editInfoForm.createtime" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="报销标识：">
                  <el-select v-model="editInfoForm.isflag" placeholder="请选择" style="width: 100%;" disabled>
                    <el-option v-for="(item, index) in isflagoptions" :key="item.index" :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="内容摘要：">
                  <el-input v-model="editInfoForm.expendcontent"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="报销要求：">
                  <el-input v-model="editInfoForm.paydemand"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="报销描述：">
                  <el-input v-model="editInfoForm.dailydesc"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                           :before-remove="beforeRemove" multiple :limit="6" :on-exceed="handleExceed"
                           :on-success="uploadFileSuccess" :file-list="dayfJlists">
                  <el-button size="mini" type="primary"><i class="el-icon-plus"></i> 添加附件</el-button> <span slot="tip"
                        class="el-upload__tip"> 只能上传jpg/png/pdf文件</span>
                </el-upload>
                <div style='display: flex;'>
                  <div class="travel_box travel_box_img" v-for="(item, index) in dayfJlist"
                       style="display: flex; align-items: center;">
                    <a :href="imgURL + item.picpath" target="_block">
                      <p>附件名称：{{item.recname}}(点击查看详情)</p>
                    </a>
                    <el-button @click="detelefJlist(index)" size="mini" icon="el-icon-delete"
                               style=" margin-left: 16px;">
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
              <el-button type="primary" @click="addEverydayForm">保存修改</el-button>
            </div>
          </el-collapse-item>
          <el-collapse-item title="发票信息" name="2">
            <el-button @click="addNoteData" type="primary" size="mini">
              <i class="el-icon-plus"> 添加发票</i>
            </el-button>
            <el-row type="flex" style="display: flex; flex-wrap: wrap;" :gutter="40">
              <el-col :span="4" v-for="(item, i) in dayFpList" :key='i'>
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
                  <!-- <el-form-item label="　　">
                    <el-button @click="deleteNoteData(i)" type="danger" size="mini" icon="el-icon-delete">
                      删除
                    </el-button>
                  </el-form-item> -->
                </el-form>
              </el-col>
            </el-row>
            <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
              <el-button type="primary" @click="addDayNoteBtn">保存修改</el-button>
            </div>
          </el-collapse-item>
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
        </el-collapse>
      </el-form>
      <!-- <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <el-button type="primary" @click="addDayNoteBtn">返回提交</el-button>
      </div> -->
    </el-card>
  </div>
</template>

<script>
  import GLOBAL from '../../api/global_path'
  export default {
    data() {
      return {
        // 发票上传地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        // 修改基础信息表单
        editInfoForm: {},
        reverse: true,
        activeNames: ['1'],
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
        dayInfoList: [],
        dayFpList: [],
        dayfJlist: [],
        dayfJlists: [],
        CommentLists: [],
        fileDataList: [],
        // 附件数组
        fileListS: [],
        dayApplyId: ''
      };
    },
    created() {

      this.editDataBtn(this.$route.query.id)
      this.dayApplyId = this.$route.query.id
    },
    mounted() {

    },
    methods: {
      // 修改按钮事件
      async editDataBtn(id) {
        let dailyid = id
        const {
          data: res
        } = await this.$axios.post('/expendDaily/queryOneDaily', {
          dailyid
        })
        if (res.length > 0) {
          console.log(JSON.parse(res))
          const data = JSON.parse(res)
          this.dayInfoList = data.daily
          this.editInfoForm = data.daily[0]
          this.dayFpList = data.fplist
          this.dayfJlist = data.fjlist
          console.log('editInfoForm', this.editInfoForm)
        } else {
          this.$message.error('获取数据失败！');
        }
        this.getFindCommentList(dailyid)
        this.editDataDialog = true
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
      // 添加发票事件
      addNoteData() {
        this.dayFpList.push({})
      },
      detelefJlist(index) {
        this.dayfJlist.splice(index, 1)
      },
      deleteNoteData(index) {
        this.dayFpList.splice(index, 1)
        console.log(this.dayFpList);

      },
      handlePreview(file) {
        let res = JSON.parse(file.response)
        let filePath = res.relationPath
        let filePathR = res.filename
        console.log(filePath, filePathR);
        if (filePathR.includes('.pdf')) {
          const elink = document.createElement('a');
          elink.href = this.imgURL + filePath; //basePdfUrl pdf.js插件的预览
          elink.target = '_block';
          document.body.appendChild(elink);
          elink.click();
          document.body.removeChild(elink);
        } else {
          window.open(
            this.imgURL + filePath
          )
        }
      },
      handleRemove(file, fileList) {
        console.log(fileList)
        this.fileDataList = fileList
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      uploadFileSuccess(file, fileList) {
        console.log(fileList)
        this.fileDataList.push(fileList)
      },
      // 报销申请修改事件
      async addEverydayForm() {
        console.log(this.fileDataList)
        this.fileListS = []
        let fileDataList = this.fileDataList.map(e => {
          let obj = {}
          let res = JSON.parse(e.response)
          obj.picpath = res.relationPath
          obj.recname = res.filename
          obj.isflag = "1"
          obj.recid = ""
          obj.expendid = ""
          obj.receiptcode = ""
          this.fileListS.push(obj)
          console.log('obj', obj)
        })
        console.log('fileListS', this.fileListS)
        let expendDaily = [{
          formcode: this.editInfoForm.formcode,
          dailyid: this.editInfoForm.dailyid,
          prodraid: this.editInfoForm.prodraid,
          dept: {
            deptid: this.editInfoForm.deptid
          },
          expendcontent: this.editInfoForm.expendcontent,
          paymoney: this.editInfoForm.paymoney,
          dailydesc: this.editInfoForm.dailydesc,
          paydemand: this.editInfoForm.paydemand,
          isflag: this.editInfoForm.isflag,
          expendReceiptlist: this.fileListS.concat(this.dayfJlist)
        }];
        let empcard = sessionStorage.getItem('ulogin')
        const {
          data: res
        } = await this.$axios.post('/expendDaily/webSaveDaily', {
          expendDaily,
          empcard,
        })
        const infoData = JSON.parse(res)
        if (infoData.retCode == 0) {
          this.$message.success('申请信息修改成功！');
        } else {
          this.$message.error('申请信息修改失败！');
        }

      },
      // 修改上传发票确定按钮事件
      async addDayNoteBtn() {
        this.dayFpList.forEach(e => {
          e.recid = e.recid || ''
          e.expendid = this.dayApplyId,
            e.isflag = '0'
        })
        let empcard = sessionStorage.getItem('ulogin')
        let expendReceipt = this.dayFpList
        console.log(expendReceipt);
        const {
          data: res
        } = await this.$axios.post('/expendReceipt/webSaveReceipt', {
          expendReceipt,
          empcard
        })
        let noteData = JSON.parse(res)
        if (noteData.retCode == '1') {
          this.$message.error('发票信息保存失败！');
        } else {
          this.$message.success('发票信息保存成功！');
        }
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
