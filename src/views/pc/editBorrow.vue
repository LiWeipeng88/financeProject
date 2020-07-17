<template>
  <div class="edit_borrow">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销系统</el-breadcrumb-item>
      <el-breadcrumb-item>借款</el-breadcrumb-item>
      <el-breadcrumb-item>申请修改</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-form :model="borrowList">
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item title="基础信息" name="1">
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="部门名称:" style="width: 100%;">
                  <el-input v-model="borrowList.deptname" placeholder="请输入部门编号" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="项目名称:" style="width: 100%;">
                  <el-input v-model="borrowList.protypename" placeholder="请输入部门编号" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="借款金额:">
                  <el-input type="number" v-model="borrowList.loanpay" placeholder="请输入报销金额" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="报销标识:">
                  <el-select v-model="borrowList.isflag" placeholder="请选择报销标识" style="width: 100%;" disabled>
                    <el-option v-for="(item, index) in flagOptions" :key="item.index" :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="报销人:" style="width: 100%;">
                  <el-input v-model="borrowList.createbyname" placeholder="请输入部门编号" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="报销时间:" style="width: 100%;">
                  <el-input v-model="borrowList.createtime" placeholder="请输入部门编号" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="预报销日期:">
                  <el-date-picker v-model="borrowList.expecttime" type="date" placeholder="请选择预报销日期" disabled
                                  style="width: 100%;" value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="借款用途:">
                  <el-select v-model="borrowList.loanusefor" placeholder="请选择借款用途" disabled style="width: 100%;">
                    <el-option v-for="(item, index) in loanOptions" :key="item.index" :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 出差人数，天数，地点的显示隐藏 -->
            <el-row :gutter="20" :class="[borrowList.loanusefor == '1' ? 'display' : '']">
              <el-col :span="8">
                <el-form-item label="出差人数:">
                  <el-input v-model="borrowList.tranum" placeholder="请输入出差人数" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出差天数:">
                  <el-input v-model="borrowList.tradays" placeholder="请输入出差天数" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出差地点:">
                  <el-input v-model="borrowList.traadd" placeholder="请输入出差地点" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item label="支付方式:">
                  <el-select v-model="borrowList.payway" placeholder="请选择支付方式" disabled style="width: 100%;">
                    <el-option v-for="(item, index) in payWayOptions" :key="item.index" :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 对公账户显示隐藏 -->
              <div :class="[borrowList.payway == '0' ? '' : 'display']">
                <el-col :span="6">
                  <el-form-item label="公司名称:">
                    <el-input v-model="borrowList.payname" placeholder="请输入公司名称" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="公司账号:">
                    <el-input v-model="borrowList.payacc" placeholder="请输入公司账号" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="开户行:">
                    <el-input v-model="borrowList.paybank" placeholder="请输入开户行名称" disabled></el-input>
                  </el-form-item>
                </el-col>
              </div>
              <!-- 对私账户显示隐藏 -->
              <div :class="[borrowList.payway == '1' ? '' : 'display']">
                <el-col :span="6" class="info_name">
                  <el-form-item label="个人姓名:">
                    <el-input v-model="borrowList.payname" placeholder="请输入个人姓名" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="个人账号:">
                    <el-input v-model="borrowList.payacc" placeholder="请输入个人账号" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="开户行名称:">
                    <el-input v-model="borrowList.paybank" placeholder="请输入开户行名称" disabled></el-input>
                  </el-form-item>
                </el-col>
              </div>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="借款事由:">
                  <el-input v-model="borrowList.loancause" placeholder="请输入内容摘要"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注:">
                  <el-input v-model="borrowList.memo" placeholder="请输入备注"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col>
                <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                           :before-remove="beforeRemove" multiple :limit="6" :on-exceed="handleExceed"
                           :on-success="uploadFileSuccess" :file-list="borrowFJlists">
                  <el-button size="mini" type="primary"><i class="el-icon-plus"></i> 添加附件</el-button> <span slot="tip"
                        class="el-upload__tip"> 只能上传jpg/png/pdf文件</span>
                </el-upload>
                <div style='display: flex;'>
                  <div class="travel_box travel_box_img" v-for="(item, index) in borrowFJlist"
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
              <el-button type="primary" @click="editBorrowMoneyForm">保存修改</el-button>
            </div>
          </el-collapse-item>
          <el-collapse-item title="审批流程" name="2">
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
    </el-card>
  </div>
</template>

<script>
  import GLOBAL from '../../api/global_path'
  export default {
    data() {
      return {
        reverse: true,
        activeNames: ['1'],
        CommentLists: [],
        fileDataList: [],
        // 附件数组
        fileListS: [],
        loanid: '',
        // 发票上传地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        borrowList: {},
        borrowFJlist: [],
        borrowFJlists: [],
        // 报销标识数据
        flagOptions: [{
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
        // 借款选择数据
        loanOptions: [{
            value: "0",
            label: "差旅借款"
          },
          {
            value: "1",
            label: "普通借款"
          }
        ],
        // 支付方式选择数据
        payWayOptions: [{
            value: "0",
            label: "对公"
          },
          {
            value: "1",
            label: "对私"
          }
        ],
      };
    },
    created() {
      this.loanid = this.$route.query.id
      this.getOneBorrowInfo(this.$route.query.id)
      this.getFindCommentList(this.$route.query.id)
    },
    mounted() {

    },
    methods: {
      async getOneBorrowInfo(id) {
        let loanid = id
        const {
          data: res
        } = await this.$axios.post('/expendLoan/queryOneLoan', {
          loanid
        })
        let borrowInfo = JSON.parse(res);
        console.log(borrowInfo);
        this.borrowList = borrowInfo.loan[0]
        this.borrowFJlist = borrowInfo.fjlist
      },
      // 查询审批意见
      async getFindCommentList(id) {
        let loanid = id
        const {
          data: res
        } = await this.$axios.post('/expendLoan/findComment', {
          loanid
        })
        this.CommentLists = JSON.parse(res)
        console.log(this.CommentLists)
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
      detelefJlist(index) {
        this.borrowFJlist.splice(index, 1)
      },
      // 借款信息修改按钮
      async editBorrowMoneyForm() {
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
        let expendLoan = [{
            formcode: this.borrowList.formcode,
            loanid: this.borrowList.Loanid,
            prodraid: this.borrowList.prodraid,
            dept: {
              deptid: this.borrowList.deptid
            },
            loancause: this.borrowList.loancause,
            loanusefor: this.borrowList.loanusefor,
            tranum: this.borrowList.tranum,
            traadd: this.borrowList.traadd,
            tradays: this.borrowList.tradays,
            loanpay: this.borrowList.loanpay,
            expecttime: this.borrowList.expecttime,
            payway: this.borrowList.payway,
            memo: this.borrowList.memo,
            isflag: this.borrowList.isflag,
            payname: this.borrowList.payname,
            payacc: this.borrowList.payacc,
            paybank: this.borrowList.paybank,
            expendReceiptlist: this.fileListS.concat(this.borrowFJlist)
          }],
          empcard = sessionStorage.getItem('ulogin')
        console.log(expendLoan)
        const {
          data: res
        } = await this.$axios.post('/expendLoan/webSaveLoan', {
          expendLoan,
          empcard
        })
        const data = JSON.parse(res)
        if (data.retCode == '0') {
          this.$message.success('申请信息修改成功');
          this.$router.push({
            path: "/expendLoan/queryPage"
          })
        } else {
          this.$message.error('申请信息修改失败');
        }
      },
    },
  }

</script>

<style scoped>
  .display {
    display: none;
  }

  a {
    color: #333;
    text-decoration: none;
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
