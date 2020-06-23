<template>
  <div class="department_list">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button style="margin-bottom: 16px;" type="primary" size="medium" icon="el-icon-plus" @click="proAddTopBtn">
        新增部门
      </el-button>
      <!-- 表格区域 -->
      <tree-table :data="dataList" :columns="columns" :selection-type="false" :expand-type="false" border
                  :show-row-hover="false">
        <template slot="project" slot-scope="scope">
          <el-button size="mini" plain type="info" icon="el-icon-view" @click="proLookBtn(scope.row.deptid)">查看
          </el-button>
        </template>
        <!-- 自定义印章插槽 -->
        <template slot="deptseal" slot-scope="scope">
          <img :src="scope.row.deptseal" alt="" style="width: 60px; height: 60px;">
        </template>
        <!-- 操作自定义插槽 -->
        <template slot="operation" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="proEditBtn(scope.row)">编辑</el-button>
        </template>
      </tree-table>
    </el-card>
    <!-- 添加部门对话框 -->
    <el-dialog title="添加部门" :visible.sync="addDepartmentDialogVisible" width="50%">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="部门编码" prop="deptcode">
          <el-input v-model="addForm.deptcode" placeholder="请输入部门编码"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptname">
          <el-input v-model="addForm.deptname" placeholder="请输入部门名称"></el-input>
        </el-form-item>

        <el-form-item label="部门项目" prop="ptlist">
          <el-cascader placeholder="请选择部门项目" v-model="addForm.ptlist" :options="allProList" :props="optionProps"
                       :show-all-levels="false" clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="addForm.remark" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item label="部门印章" prop="deptseal">
          <el-upload class="avatar-uploader" :action="uploadURL" :show-file-list="false"
                     :on-success="handleAvatarSuccess">
            <img v-if="this.addForm.deptseal" :src="this.addForm.deptseal" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDepartmentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDepartmentBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑部门对话框 -->
    <el-dialog title="修改部门信息" :visible.sync="editDeptDialog" width="50%" :before-close="handleEditDeptDialog">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">

        <el-form-item label="部门排序" prop="dicsort">
          <el-input v-model="editForm.dicsort"></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="deptcode">
          <el-input v-model="editForm.deptcode"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptname">
          <el-input v-model="editForm.deptname"></el-input>
        </el-form-item>
        <el-form-item label="部门项目" prop="ptlist">
          <el-cascader placeholder="请选择部门项目" v-model="editForm.ptlist" :options="allProList" :props="optionProps"
                       :show-all-levels="false" clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="部门印章">
          <el-upload class="avatar-uploader" :action="uploadURL" :show-file-list="false"
                     :on-success="handleEditAvatarSuccess">
            <img v-if="this.editForm.deptseal" :src="this.editForm.deptseal" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditDeptDialog">取 消</el-button>
        <el-button type="primary" @click="editDeptDataBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看部门项目 -->
    <el-dialog title="部门项目" :visible.sync="lookProDialog" width="30%">
      <el-tree :data="lookLists" :props="defaultProps"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookProDialog=false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import GLOBAL from '../../api/global_path'
  export default {
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'proname'
        },
        lookLists: [],
        lookProDialog: false,
        optionProps: {
          value: 'protypeid',
          label: 'proname',
          children: 'children',
          multiple: true,
        },
        // 所有部门列表数据
        allProList: [],
        // 编辑对话框隐藏
        editDeptDialog: false,
        // 发票上传地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        dataList: [],
        addDepartmentDialogVisible: false,
        addForm: {
          deptcode: "",
          deptname: "",
          deptseal: "",
          remark: '',
          ptlist: []
        },
        addFormRules: {
          deptcode: [{
            required: true,
            message: "请输入部门编码",
            trigger: "blur"
          }],
          deptname: [{
            required: true,
            message: "请输入部门名称",
            trigger: "blur"
          }],
          deptseal: [{
            required: true,
            message: "请上传部门印章",
            trigger: "change"
          }],
          ptlist: [{
            required: true,
            message: "请选择部门项目",
            trigger: "change"
          }],
        },
        editForm: {
          deptid: '',
          deptcode: "",
          deptname: "",
          deptseal: "",
          remark: '',
          dicsort: '',
          ptlist: [
            // ["652ef31194ea46c9b513540f7c3e7528", "c23dd0dc893f4a5a83a91cad36d5a8a9"]
          ]
        },
        editFormRules: {
          deptcode: [{
            required: true,
            message: "请输入部门编码",
            trigger: "blur"
          }],
          deptname: [{
            required: true,
            message: "请输入部门名称",
            trigger: "blur"
          }],
        },
        //表格标题数据
        columns: [{
            label: "排序",
            prop: "dicsort",
            width: '120',
            headerAlign: 'center',
            align: 'center'
          }, {
            label: "编码",
            prop: "deptcode",
            width: '260',
            headerAlign: 'center',
            align: 'center'
          }, , {
            label: "名称",
            prop: "deptname",
            width: '260',
            headerAlign: 'center',
            align: 'center'
          },

          {
            label: "印章",
            // 表示当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'deptseal',
            headerAlign: 'center',
            align: 'center'
          },
          {
            label: "备注",
            prop: "remark",
          },
          {
            label: '项目',
            type: "template",
            template: "project",
            headerAlign: 'center',
            align: 'center'
          },
          {
            label: '操作',
            // 表示当前列定义为模板列
            type: 'template',
            // 表示当前这一列使用模板名称
            template: 'operation',
            width: '200',
            headerAlign: 'center',
            align: 'center'
          }
        ],
      };
    },
    created() {
      this.getQueryList();
    },
    methods: {
      // 点击添加部门的弹框
      showAdd() {
        this.addDepartmentDialogVisible = true;
      },
      // 获取一级数据列表
      getQueryList() {
        let deptid = {
          deptid: 0
        };
        this.$axios.post("/department/queryListallnew", deptid).then(res => {
          let data = JSON.parse(res.data);
          this.dataList = data;
          console.log(this.dataList);
        });
      },
      // 部门新增按钮
      proAddTopBtn() {
        this.getAllProList()
        this.addDepartmentDialogVisible = true
      },
      // 获取所有项目列表
      async getAllProList() {
        const {
          data
        } = await this.$axios.post('/projectType/queryAllProList')
        this.allProList = JSON.parse(data)
      },
      // 部门编辑按钮
      proEditDialog(row) {
        console.log(row);

      },
      // 印章上传成功的回调
      handleAvatarSuccess(res, file) {
        this.addForm.deptseal = this.imgURL + JSON.parse(res).relationPath
        console.log(this.addForm.deptseal);
      },
      // 部门添加确定按钮
      addDepartmentBtn() {
        this.$refs.addFormRef.validate((valid) => {
          if (!valid) return this.$message.error('请先填写部门信息！')
          let protypeidList = []
          this.addForm.ptlist.forEach(r => {
            r.forEach(e => {
              protypeidList.push(e)
            })
          })
          var ListArr = protypeidList.filter(function (element, index, self) {
            return self.indexOf(element) === index;
          });
          let ptlist = []
          ListArr.map(v => ptlist.push({
            protypeid: v
          }))
          console.log(ptlist);
          let department = [{
            deptid: "",
            deptcode: this.addForm.deptcode,
            deptname: this.addForm.deptname,
            deptseal: this.addForm.deptseal,
            parentcode: "0",
            diclevel: "1",
            dicsort: "",
            isflag: "0",
            remark: this.addForm.remark,
            ptlist
          }]
          this.$axios.post('/department/webDeptSave', {
            department
          }).then(res => {
            console.log(res.data)
            const data = JSON.parse(res.data)
            if (data.retCode == 0) {
              this.addDepartmentDialogVisible = false
              this.$message.success('部门添加成功！')
              this.getQueryList()
            } else {
              this.addDepartmentDialogVisible = false
              this.$message.error('部门添加失败！')
            }
          })
        })
      },
      proEditBtn(row) {
        console.log(row);
        this.getAllProList()
        this.getProLists(row.deptid)
        this.editForm.deptcode = row.deptcode
        this.editForm.deptid = row.deptid
        this.editForm.deptname = row.deptname
        this.editForm.deptseal = row.deptseal
        this.editForm.remark = row.remark
        this.editForm.dicsort = row.dicsort
        this.editDeptDialog = true
      },
      handleEditDeptDialog() {
        this.editDeptDialog = false
        this.$refs.editFormRef.resetFields();
      },
      // 编辑印章上传成功的回调
      handleEditAvatarSuccess(res, file) {
        this.editForm.deptseal = this.imgURL + JSON.parse(res).relationPath
        console.log(this.editForm.deptseal);
      },
      editDeptDataBtn() {
        console.log(this.editForm);

        let protypeidList = []
        this.editForm.ptlist.forEach(r => {
          r.forEach(e => {
            protypeidList.push(e)
          })
        })
        var ListArr = protypeidList.filter(function (element, index, self) {
          return self.indexOf(element) === index;
        });
        let ptlist = []
        ListArr.map(v => ptlist.push({
          protypeid: v
        }))
        console.log(ptlist);
        let department = [{
          deptid: this.editForm.deptid,
          deptcode: this.editForm.deptcode,
          deptname: this.editForm.deptname,
          deptseal: this.editForm.deptseal,
          parentcode: "0",
          diclevel: "1",
          dicsort: this.editForm.dicsort,
          isflag: "0",
          remark: this.editForm.remark,
          ptlist
        }]
        this.$axios.post('/department/webDeptSave', {
          department
        }).then(res => {
          console.log(res.data)
          const data = JSON.parse(res.data)
          if (data.retCode == 0) {
            this.editDeptDialog = false
            this.$message.success('部门信息修改成功！')
            this.getQueryList()
          } else {
            this.editDeptDialog = false
            this.$message.error('部门信息修改失败！')
          }
        })
      },
      proLookBtn(deptid) {
        this.getProLists(deptid)
        this.lookProDialog = true
      },
      async getProLists(deptid) {
        const {
          data
        } = await this.$axios.post('/department/queryDeptPro', {
          deptid
        })
        this.lookLists = JSON.parse(data);
        let lookArr = []
        this.lookLists.map(e => {
          e.children.map(v => {
            lookArr.push(v.protypeid)
          })
        })
        let Array = lookArr.toString().split(',')
        console.log(Array);

        function group(array, subGroupLength) {
          let index = 0;
          let newArray = [];
          while (index < array.length) {
            newArray.push(array.slice(index, index += subGroupLength));
          }
          return newArray;
        }
        var groupedArray = group(Array, 1);
        console.log(groupedArray);

        this.editForm.ptlist = groupedArray
        console.log(this.editForm.ptlist);

      }
    }
  };

</script>

<style scoped>
  .zk-table {
    font-size: 14px !important;
    color: #606266 !important;
  }

  .zk-table__cell-inner {
    padding: 10px 12px !important;
  }

  .avatar-uploader-icon[data-v-1acda202] {
    border: 1px dashed #eee;
  }

  .avatar-uploader-icon[data-v-1acda202]:hover {
    border-color: #409EFF;
  }

  .el-cascader {
    width: 100%;
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
