<template>
  <div class="travel_apply">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>报销系统</el-breadcrumb-item>
      <el-breadcrumb-item>差旅报销</el-breadcrumb-item>
      <el-breadcrumb-item>申请填写</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-form :model="travelTableForm" ref="travelTableRef" :rules="travelTableFormRules">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="deptid" label="部门名称:">
              <el-input v-model="travelTableForm.deptname" placeholder="请输入部门编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报销金额:" prop="paymoney">
              <el-input type="number" v-model="travelTableForm.paymoney" placeholder="请输入报销金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报销标识:" prop="isflagvalue">
              <el-select v-model="travelTableForm.isflagvalue" placeholder="请选择" @change="isflagchange">
                <el-option v-for="(item, index) in isflagoptions" :key="item.index" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出差时间:" prop="valueTime">
              <el-date-picker v-model="travelTableForm.valueTime" type="daterange" range-separator="至"
                              start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="出差人:" prop="traname">
              <el-select v-model="travelTableForm.traname" multiple placeholder="请选择出差人" @visible-change="changeEmpname"
                         @remove-tag="changeEmpname">
                <el-option v-for="item in chooseInfoList" :key="item.empid" :label="item.empname" :value="item.empid">
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
              <el-input v-model="travelTableForm.traaddr" placeholder="请输入出差地点"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出差事由:" prop="tracause">
              <el-input v-model="travelTableForm.tracause" placeholder="请输入出差事由"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注信息:">
              <el-input v-model="travelTableForm.memo" placeholder="请输入备注信息"></el-input>
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
                <el-option label="未完结" value="0"></el-option>
              </el-select>
            </el-form-item>
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
" style="margin-right: 50px; margin-top: 10px;" @click="addTravelForm">提交申请
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
        psotId: [],
        postnames: [],
        keyWordForm: {
          empid: '',
          empname: '',
          deptid: '',
          postid: '',
          state: '',
          pagenum: '0'
        },
        selectlist: [],
        ProDraListData: [],
        total: '0',
        ProDraList: {
          year: '2020',
          isflag: '0',
          pagenum: '0',
          proid: '',
          deptid: '',
          deptname: ''
        },
        chooseProList: [],
        isflagvalue: "",
        defaultData: { //联级选择
          value: 'protypeid',
          label: 'proname',
          children: 'children'
        },
        // 图片上传URL地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        travelTableForm: {
          deptid: "",
          protypeid: "",
          entname: '',
          paymoney: "",
          traname: [],
          postid: "",
          tranum: "",
          traaddr: "",
          tracause: "",
          memo: "",
          valueTime: "",
          isflagvalue: ""
        },
        // 出差人员信息
        chooseInfoList: [],
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
          traname: [{
            required: true,
            message: "请输入出差人",
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
            message: "请选择出差时间",
            trigger: "change"
          }]
        },
        isflagoptions: [{
            value: "0",
            label: "二级院办公项目"
          },
          {
            value: "0",
            label: "行政部门"
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
            label: "教改项目"
          }
        ],
      };
    },
    computed: {
      tranameNum() {
        return this.travelTableForm.traname.length
      }
    },
    created() {
      this.getApplyInBtn()
      let userInfo = sessionStorage.getItem('userInfo')
      let userInfoData = JSON.parse(userInfo)
      this.travelTableForm.deptid = userInfoData.deptid
      this.travelTableForm.deptname = userInfoData.deptname
    },
    mounted() {

    },
    methods: {
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
        console.log(this.personLists);
        this.postnames.push(this.personLists[0].postname)
        this.psotId.push(this.personLists[0].postid)
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
        console.log(this.chooseInfoList)
        // 获取部门项目层级列表
        const result = await this.$axios.post('/projectType/queryDeptProList', {
          deptid
        })
        this.chooseProList = JSON.parse(result.data)
        console.log(this.chooseProList)
      },

      // 选择出差人改变事件
      changeEmpname() {
        this.travelTableForm.traname.forEach(e => {
          console.log(e);
          this.postnames = []
          this.queryInfoBtn(e)
        })
      },
      isflagchange() {
        console.log("isflagvalue", this.isflagvalue);
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

      // 明细信息数据提交
      addTravelForm() {
        this.$refs.travelTableRef.validate(async valid => {
          if (this.selectlist.length == 0) return this.$message.error('请选择预算部门！');
          let prodraid = this.selectlist[0].proid
          if (valid) {
            let expendTravel = [{
              traid: "",
              prodraid: prodraid,
              dept: {
                deptid: this.travelTableForm.deptid
              },
              starttime: this.travelTableForm.valueTime[0],
              endtime: this.travelTableForm.valueTime[1],
              tracause: this.travelTableForm.tracause,
              traaddr: this.travelTableForm.traaddr,
              traname: this.travelTableForm.traname.join(','),
              tranum: this.tranameNum,
              postid: this.psotId.join(','),
              paymoney: this.travelTableForm.paymoney,
              memo: this.travelTableForm.memo,
              isflag: this.travelTableForm.isflagvalue
            }];
            console.log(expendTravel)
            if (Number(this.travelTableForm.paymoney) <= Number(this.selectlist[0].probalance)) {
              let empcard = sessionStorage.getItem("ulogin");
              const {
                data: res
              } = await this.$axios.post(
                "/expendTravel/webSaveTravel", {
                  expendTravel,
                  empcard
                }
              );
              let traidData = JSON.parse(res);
              console.log(traidData);
              if (traidData.retCode == 0) {
                this.$message.success("申请信息填写成功");
                this.$router.push({
                  path: '/expendTavel/queryPage'
                })
              } else {
                this.$message.error('申请信息填写失败');
              }
            }
          } else {
            this.$message.error("请修改报销金额");
          }

        });
      },
    },
  }

</script>

<style scoped>
  .el-select {
    width: 100%;
  }

  .el-range-editor.el-input__inner {
    width: 100%;
  }

</style>
