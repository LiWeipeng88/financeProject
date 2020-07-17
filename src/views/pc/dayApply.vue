<template>
  <div class="day_apply">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销系统</el-breadcrumb-item>
      <el-breadcrumb-item>日常报销</el-breadcrumb-item>
      <el-breadcrumb-item>申请填写</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form :model="everydayForm" ref="everydayFormRef" :rules="everydayFormRules">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="deptid" label="部门名称:" style="width: 100%;">
              <el-input v-model="everydayForm.deptname" placeholder="请输入部门名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报销金额:" prop="paymoney">
              <el-input type="number" v-model="everydayForm.paymoney" placeholder="请输入报销金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报销标识:" prop="isflag">
              <el-select v-model="everydayForm.isflag" placeholder="请选择" @change="isflagchange" style="width: 100%;">
                <el-option v-for="(item, index) in isflagoptions" :key="item.index" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报销要求:" prop="paydemand">
              <el-input v-model="everydayForm.paydemand" placeholder="请输入报销要求"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="内容摘要:" prop="expendcontent">
              <el-input v-model="everydayForm.expendcontent" placeholder="请输入内容摘要"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="描述:" prop="dailydesc">
              <el-input v-model="everydayForm.dailydesc" placeholder="请输入描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目选择:">
              <el-cascader-panel @change="changeProList" :props="defaultData" :options="chooseProList">
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
            <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                       :before-remove="beforeRemove" multiple :limit="6" :on-exceed="handleExceed"
                       :on-success="uploadFileSuccess" :file-list="fileDataList">
              <el-button size="mini" type="primary"><i class="el-icon-plus"></i> 添加附件</el-button> <span slot="tip"
                    class="el-upload__tip"> 只能上传jpg/png/pdf文件</span>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
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
        " style="margin-right: 50px; margin-top: 10px;" @click="addEverydayForm">提交申请
        </el-button>
      </div>
    </el-card>
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
        // 附件数据暂存
        fileDataList: [],
        // 发票上传地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        chooseProList: [],
        defaultData: { //联级选择
          value: 'protypeid',
          label: 'proname',
          children: 'children'
        },
        ProDraList: {
          year: '2020',
          isflag: '2',
          pagenum: '0',
          proid: ''
        },
        // 报销申请参数校验规则
        everydayFormRules: {
          deptid: [{
            required: true,
            message: '请输入部门编号',
            trigger: 'blur'
          }],
          protypeid: [{
            required: true,
            message: '请输入项目编号',
            trigger: 'blur'
          }],
          paymoney: [{
            required: true,
            message: '请输入报销金额',
            trigger: 'blur'
          }],
          paydemand: [{
            required: true,
            message: '请输入报销要求',
            trigger: 'blur'
          }],
          isflag: [{
            required: true,
            message: '请选择报销标识',
            trigger: 'change'
          }],
          expendcontent: [{
            required: true,
            message: '请输入内容摘要',
            trigger: 'blur'
          }],
          dailydesc: [{
            required: true,
            message: '请输入描述',
            trigger: 'blur'
          }]
        },
        // 报销申请参数填写
        everydayForm: {
          protypeid: [],
          deptid: '',
          deptname: '',
          expendcontent: '',
          paymoney: '',
          dailydesc: '',
          paydemand: '',
          isflag: '',
        },
        // 标识选择数据
        isflagoptions: [{
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
      };
    },
    created() {
      this.getChooseProList()
      let userInfo = sessionStorage.getItem('userInfo')
      let userInfoData = JSON.parse(userInfo)
      this.everydayForm.deptid = userInfoData.deptid
      this.everydayForm.deptname = userInfoData.deptname
    },
    mounted() {

    },
    methods: {
      // 报销申请入口按钮事件
      async getChooseProList() {
        let userInfo = sessionStorage.getItem('userInfo')
        let userInfoData = JSON.parse(userInfo)
        let deptid = userInfoData.deptid
        // 获取部门项目层级列表
        const result = await this.$axios.post('/department/queryDeptPro', {
          deptid
        })
        this.chooseProList = JSON.parse(result.data)
        console.log(this.chooseProList)
      },
      // 项目选择事件
      handleProList(val) {
        console.log(val)
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
      // 标识选择事件
      isflagchange() {},
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
        let deptid = this.everydayForm.deptid
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
      // 报销申请对话框确认按钮事件
      addEverydayForm() {
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
        this.$refs.everydayFormRef.validate(async valid => {
          if (this.selectlist.length == 0) return this.$message.error('请选择预算部门！');
          let prodraid = this.selectlist[0].proid
          if (!valid) return this.$message.error('请完善申请信息！');
          let expendDaily = [{
            formcode: '',
            dailyid: "",
            prodraid: prodraid,
            dept: {
              deptid: this.everydayForm.deptid
            },
            expendcontent: this.everydayForm.expendcontent,
            paymoney: this.everydayForm.paymoney,
            dailydesc: this.everydayForm.dailydesc,
            paydemand: this.everydayForm.paydemand,
            isflag: this.everydayForm.isflag,
            expendReceiptlist: this.fileListS
          }];
          if (Number(this.everydayForm.paymoney) <= Number(this.selectlist[0].probalance)) {
            let empcard = sessionStorage.getItem('ulogin')
            const {
              data: res
            } = await this.$axios.post('/expendDaily/webSaveDaily', {
              expendDaily,
              empcard,
            })
            this.$message.success('申请信息填写成功！');
            this.$router.push({
              path: '/expendDaily/queryPage'
            })
          } else {
            this.$message.error('请修改报销金额');
          }

        })
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

    }
  }

</script>

<style scoped>
  .el-select {
    width: 100%;
  }

</style>
