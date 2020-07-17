<template>
  <div class="borrow_apply">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销系统</el-breadcrumb-item>
      <el-breadcrumb-item>借款</el-breadcrumb-item>
      <el-breadcrumb-item>申请填写</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-form :model="borrowMoneyForm" ref="borrowMoneyFormRef" :rules="borrowMoneyFormRules">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item prop="deptid" label="部门名称:" style="width: 100%;">
              <el-input v-model="borrowMoneyForm.deptname" placeholder="请输入部门编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="借款金额:" prop="loanpay">
              <el-input type="number" v-model="borrowMoneyForm.loanpay" placeholder="请输入报销金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="报销标识:" prop="isflag">
              <el-select v-model="borrowMoneyForm.isflag" placeholder="请选择报销标识" style="width: 100%;">
                <el-option v-for="(item, index) in flagOptions" :key="item.index" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="预报销日期:" prop="expecttime">
              <el-date-picker v-model="borrowMoneyForm.expecttime" type="date" placeholder="请选择预报销日期"
                              style="width: 100%;" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="借款用途:" prop="loanusefor">
              <el-select v-model="borrowMoneyForm.loanusefor" placeholder="请选择借款用途" style="width: 100%;"
                         @change="changeLoan">
                <el-option v-for="(item, index) in loanOptions" :key="item.index" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 出差人数，天数，地点的显示隐藏 -->
        <el-row :gutter="20" :class="[loanOptionsVal == '1' ? 'display' : '']">
          <el-col :span="8">
            <el-form-item label="出差人数:" prop="tranum">
              <el-input v-model="borrowMoneyForm.tranum" placeholder="请输入出差人数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出差天数:" prop="tradays">
              <el-input v-model="borrowMoneyForm.tradays" placeholder="请输入出差天数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出差地点:" prop="traadd">
              <el-input v-model="borrowMoneyForm.traadd" placeholder="请输入出差地点"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="支付方式:" prop="payway">
              <el-select v-model="borrowMoneyForm.payway" placeholder="请选择支付方式" style="width: 100%;"
                         @change="changePublic">
                <el-option v-for="(item, index) in payWayOptions" :key="item.index" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 对公账户显示隐藏 -->
          <div :class="[isPublicVal == '0' ? '' : 'display']">
            <el-col :span="6">
              <el-form-item label="公司名称:" prop="payname">
                <el-input v-model="borrowMoneyForm.payname" placeholder="请输入公司名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司账号:" prop="payacc">
                <el-input v-model="borrowMoneyForm.payacc" placeholder="请输入公司账号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开户行:" prop="paybank">
                <el-input v-model="borrowMoneyForm.paybank" placeholder="请输入开户行名称"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <!-- 对私账户显示隐藏 -->
          <div :class="[isPublicVal == '1' ? '' : 'display']">
            <el-col :span="6" class="info_name" style="display: flex;">
              <el-form-item label="个人姓名:" prop="payname" style="flex: 5;">
                <el-input v-model="borrowMoneyForm.payname" placeholder="请输入个人姓名"></el-input>
              </el-form-item>
              <el-form-item label="　　　　" style="flex: 1; margin-left: 10px;">
                <el-button type="primary" @click="editInfoBtn">修改</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="6" class="chooseInfo" v-if="isChoose">
              <ul v-for=" item in chooseInfoList">
                <li @click="clickInfo(item)">{{item.empname}}</li>
              </ul>
            </el-col>
            <el-col :span="6">
              <el-form-item label="个人账号:" prop="payacc">
                <el-input v-model="borrowMoneyForm.payacc" placeholder="请输入个人账号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开户行名称:" prop="paybank">
                <el-input v-model="borrowMoneyForm.paybank" placeholder="请输入开户行名称"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="借款事由:" prop="loancause">
              <el-input v-model="borrowMoneyForm.loancause" placeholder="请输入内容摘要"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注:" prop="memo">
              <el-input v-model="borrowMoneyForm.memo" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目选择">
              <el-cascader-panel @change="changeProList" :options="chooseProList" :props="defaultData">
              </el-cascader-panel>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="年度选择:">
              <el-date-picker value-format="yyyy" style="width: 100%;" v-model="ProDraList.year" type="year"
                              placeholder="选择年" @change="changeyear">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="是否完结:">
              <el-select v-model="ProDraList.isflag" placeholder="请选择状态" @change="changeisflag">
                <el-option label="已完结" value="1"></el-option>
                <el-option label="未完结" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="附件上传:" style="margin-bottom: 4px;">
            </el-form-item>
            <div class="upload_img">
              <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                         :before-remove="beforeRemove" multiple :limit="6" :on-exceed="handleExceed"
                         :on-success="uploadFileSuccess" :file-list="fileDataList">
                <el-button size="mini" type="primary"><i class="el-icon-plus"></i> 添加附件</el-button> <span slot="tip"
                      class="el-upload__tip"> 只能上传jpg/png/pdf文件</span>
              </el-upload>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-table ref="multipleTable" border :data="ProDraListData" tooltip-effect="dark" @selection-change="selectItem"
              @row-click="onSelectOp" style="width: 100%">
      <el-table-column type="selection" width="55" :reserve-selection="false">
      </el-table-column>
      <el-table-column label="部门" prop="deptname">
      </el-table-column>
      <el-table-column prop="createby" label="姓名">
      </el-table-column>
      <el-table-column prop="protname" label="项目">
      </el-table-column>
      <el-table-column prop="probalance" label="预算金额">
      </el-table-column>
      <el-table-column prop="applytime" label="时间">
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: space-between; align-items:center">

      <el-pagination @current-change="handleCurrentChange" :page-sizes="[5]" :page-size="100"
                     layout="total, sizes, pager" :total="+total">
      </el-pagination>
      <el-button type="primary" icon="el-icon-success
" style="margin-right: 50px; margin-top: 10px;" @click="addborrowMoneyForm">提交申请
      </el-button>
    </div>
  </div>
</template>

<script>
  import GLOBAL from '../../api/global_path'
  export default {
    data() {
      return {
        selectlist: [],
        ProDraListData: [],
        total: '0',
        ProDraList: {
          year: '2020',
          isflag: '2',
          pagenum: '0',
          proid: '',
          deptid: '',
          deptname: ''
        },
        // 发票上传地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        // 附件数组
        fileListS: [],
        // 附件数据暂存
        fileDataList: [],
        // 对私人员信息
        chooseInfoList: [],
        isChoose: false,
        // 借款申请数据填写的校验规则
        borrowMoneyFormRules: {
          protypeid: [{
            required: true,
            message: '请输入项目id',
            trigger: 'change'
          }, ],
          deptid: [{
            required: true,
            message: '请输入部门id',
            trigger: 'blur'
          }, ],
          loanpay: [{
            required: true,
            message: '请输入报销金额',
            trigger: 'blur'
          }, ],
          loanusefor: [{
            required: true,
            message: '请选择借款用途',
            trigger: 'change'
          }, ],
          hedgenum: [{
            required: true,
            message: '请输入对冲号',
            trigger: 'blur'
          }, ],
          payway: [{
            required: true,
            message: '请选择支付方式',
            trigger: 'change'
          }, ],
          isflag: [{
            required: true,
            message: '请选择报销标识',
            trigger: 'change'
          }, ],
          expecttime: [{
            required: true,
            message: '请选择预报销日期',
            trigger: 'change'
          }, ],
          loancause: [{
            required: true,
            message: '请输入借款事由',
            trigger: 'blur'
          }, ],
          payname: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }, ],
          payacc: [{
            required: true,
            message: '请输入卡号',
            trigger: 'blur'
          }, ],
          paybank: [{
            required: true,
            message: '请输入开户行',
            trigger: 'blur'
          }, ],
        },
        // 借款申请填写参数项
        borrowMoneyForm: {
          protypeid: '',
          deptid: '',
          deptname: '',
          loanpay: '',
          loanusefor: '',
          tranum: '',
          tradays: '',
          traadd: '',
          hedgenum: '',
          payway: '',
          isflag: '',
          expecttime: '',
          loancause: '',
          memo: '',
          payname: '',
          payacc: '',
          paybank: '',
        },
        defaultData: { //联级选择
          value: 'protypeid',
          label: 'proname',
          children: 'children'
        },
        chooseProList: [],
        isPublicVal: 0,
        // 报销标识数据
        flagOptions: [{
            value: "0",
            label: "办公项目"
          },
          {
            value: "1",
            label: "教学项目"
          },
          {
            value: "2",
            label: "学生项目"
          },
          {
            value: "3",
            label: "科研项目"
          },
          {
            value: "4",
            label: "教改项目"
          }
        ],
        // 借款用途的值控制人数，天数，地点是否显示的值
        loanOptionsVal: '1',
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
      this.getChooseProList()
      let userInfo = sessionStorage.getItem('userInfo')
      let userInfoData = JSON.parse(userInfo)
      this.ProDraList.deptid = userInfoData.deptid
      this.borrowMoneyForm.deptname = userInfoData.deptname
    },

    methods: {
      // 获取部门项目层级列表
      async getChooseProList() {
        let userInfo = sessionStorage.getItem('userInfo')
        let userInfoData = JSON.parse(userInfo)
        let deptid = userInfoData.deptid
        const result = await this.$axios.post('/projectType/queryDeptProList', {
          deptid
        })
        this.chooseProList = JSON.parse(result.data)
        console.log(this.chooseProList)
        this.borrowMoneyBtnDialog = true;
      },
      // 项目选择事件
      handleProList(val) {
        console.log(val)
      },
      // 借款用途改变事件
      changeLoan(val) {
        this.loanOptionsVal = val
      },
      // 对公对私事件改变
      changePublic(val) {
        this.isPublicVal = val
        if (val == 0) {
          this.borrowMoneyForm.payname = ''
          this.borrowMoneyForm.payacc = ''
          this.borrowMoneyForm.paybank = ''
        } else {
          let userInfo = sessionStorage.getItem('userInfo')
          let userInfoData = JSON.parse(userInfo)
          this.borrowMoneyForm.payname = userInfoData.empname
          this.borrowMoneyForm.payacc = userInfoData.bankcard
          this.borrowMoneyForm.paybank = userInfoData.bankname
          this.borrowMoneyForm.deptid = userInfoData.deptid
        }
      },
      // 修改对私信息按钮
      async editInfoBtn() {
        let userInfo = sessionStorage.getItem('userInfo')
        let userInfoData = JSON.parse(userInfo)
        let deptid = userInfoData.deptid
        let employee = [{
          dept: {
            deptid
          },
          jobpost: {
            postid: ""
          }
        }]
        const res = await this.$axios.post('/employee/querybyDept', {
          employee
        })
        this.chooseInfoList = JSON.parse(res.data)
        this.isChoose = true
      },
      // 点击选择人员信息
      clickInfo(item) {
        console.log(item)
        this.borrowMoneyForm.payname = item.empname
        this.borrowMoneyForm.payacc = item.bankcard
        this.borrowMoneyForm.paybank = item.bankname
        this.isChoose = false
      },
      // 图片预览事件
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
      // 附件移除事件
      handleRemove(file, fileList) {
        console.log(fileList)
        this.fileDataList = fileList
      },
      // 附件移除之前的回调函数
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      uploadFileSuccess(file, fileList) {
        console.log(fileList)
        this.fileDataList.push(fileList)
      },

      // 预算项目获取
      changeProList(val) {
        this.ProDraList.proid = val[val.length - 1]
        this.getProListData()
      },
      changeyear(val) {
        console.log(val);
        this.getProListData()
        this.ProDraList.year = val
      },
      changeisflag(val) {
        this.ProDraList.isflag = val
        this.getProListData()
      },
      async getProListData() {
        let proid = this.ProDraList.proid
        let deptid = this.ProDraList.deptid
        let pagenum = this.ProDraList.pagenum
        let year = this.ProDraList.year
        let isflag = this.ProDraList.isflag
        const {
          data
        } = await this.$axios.post('/projectDraft/queryProDraList', {
          deptid,
          proid,
          pagenum,
          year,
          isflag
        })
        const dataList = JSON.parse(data)
        console.log(dataList);
        this.ProDraListData = dataList.draftlist
        this.total = dataList.pagetotal
      },
      handleCurrentChange(newpage) {
        this.ProDraList.pagenum = newpage - 1
        this.getProListData()
      },
      onSelectAll() {
        this.$refs.multipleTable.clearSelection();
      },
      selectItem(rows) {
        if (rows.length > 1) {
          var newRows = rows.filter((it, index) => {
            if (index == rows.length - 1) {
              this.$refs.multipleTable.toggleRowSelection(it, true);
              return true;
            } else {
              this.$refs.multipleTable.toggleRowSelection(it, false);
              return false;
            }
          });
          this.selectlist = newRows;
        } else {
          this.selectlist = rows;
        }
        console.log(this.selectlist);

      },
      onSelectOp(row) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(row, true);
        this.selectlist = [];
        this.selectlist.push(row);
      },
      // 借款报销对话框确认按钮
      addborrowMoneyForm() {
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
        console.log('borrowMoneyForm', this.borrowMoneyForm)
        this.$refs.borrowMoneyFormRef.validate(async valid => {
          if (this.selectlist.length == 0) return this.$message.error('请选择预算部门！');
          let prodraid = this.selectlist[0].proid
          if (valid) {
            let expendLoan = [{
                loanid: "",
                prodraid: prodraid,
                dept: {
                  deptid: this.borrowMoneyForm.deptid
                },
                loancause: this.borrowMoneyForm.loancause,
                loanusefor: this.borrowMoneyForm.loanusefor,
                tranum: this.borrowMoneyForm.tranum,
                traadd: this.borrowMoneyForm.traadd,
                tradays: this.borrowMoneyForm.tradays,
                loanpay: this.borrowMoneyForm.loanpay,
                expecttime: this.borrowMoneyForm.expecttime,
                hedgenum: this.borrowMoneyForm.hedgenum,
                payway: this.borrowMoneyForm.payway,
                memo: this.borrowMoneyForm.memo,
                isflag: this.borrowMoneyForm.isflag,
                payname: this.borrowMoneyForm.payname,
                payacc: this.borrowMoneyForm.payacc,
                paybank: this.borrowMoneyForm.paybank,
                expendReceiptlist: this.fileListS
              }],
              empcard = sessionStorage.getItem('ulogin')
            console.log(expendLoan)
            if (Number(this.borrowMoneyForm.loanpay) <= Number(this.selectlist[0].probalance)) {
              const {
                data: res
              } = await this.$axios.post('/expendLoan/webSaveLoan', {
                expendLoan,
                empcard
              })
              const data = JSON.parse(res)
              if (data.retCode == '0') {
                this.$message.success('申请信息填写成功');
                this.$router.push({
                  path: "/expendLoan/queryPage"
                })
              } else {
                this.$message.error('申请信息填写失败');
              }
            } else {
              this.$message.error('请修改报销金额');
            }
          }
        })
      },
    },
  }

</script>

<style scoped>
  .display {
    display: none;
  }

  .info_name {
    position: relative;
  }

  .chooseInfo {
    position: absolute;
    top: 80px;
    left: 25.3%;
    background: #fff;
    z-index: 99;
  }

  .chooseInfo ul {
    margin: 0;
    padding: 0;
    display: block;
    padding-left: 12px;
  }

  .chooseInfo ul li {
    list-style: none;
    margin: 0;
    padding: 0;
    line-height: 30px;
    font-size: 13.3px;
  }

  .el-select {
    width: 100%;
  }

</style>
