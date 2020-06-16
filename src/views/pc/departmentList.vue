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
          <el-input v-model="addForm.deptcode"></el-input>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptname">
          <el-input v-model="addForm.deptname"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="部门印章">
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
    <el-dialog title="提示" :visible.sync="editDeptDialog" width="50%" :before-close="handleEditDeptDialog">
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
        <el-form-item label="备注" prop="remark">
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

  </div>
</template>

<script>
  import GLOBAL from '../../api/global_path'
  export default {
    data() {
      return {
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
          remark: ''
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
            message: "请输入部门简介",
            trigger: "blur"
          }],
        },
        editForm: {
          deptid: '',
          deptcode: "",
          deptname: "",
          deptseal: "",
          remark: '',
          dicsort: '',
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
          remark: [{
            required: true,
            message: "请输入备注信息",
            trigger: "blur"
          }],
          dicsort: [{
            required: true,
            message: "请输入部门排序",
            trigger: "blur"
          }]
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
        this.addDepartmentDialogVisible = true
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
        let department = [{
          deptid: "",
          deptcode: this.addForm.deptcode,
          deptname: this.addForm.deptname,
          deptseal: this.addForm.deptseal,
          parentcode: "0",
          diclevel: "1",
          dicsort: "",
          isflag: "0",
          remark: this.addForm.remark
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
      },
      proEditBtn(row) {
        console.log(row);
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
        let department = [{
          deptid: this.editForm.deptid,
          deptcode: this.editForm.deptcode,
          deptname: this.editForm.deptname,
          deptseal: this.editForm.deptseal,
          parentcode: "0",
          diclevel: "1",
          dicsort: this.editForm.dicsort,
          isflag: "0",
          remark: this.editForm.remark
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
