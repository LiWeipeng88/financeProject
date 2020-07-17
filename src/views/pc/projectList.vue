<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-button style="margin-bottom: 16px;" type="primary" size="medium" icon="el-icon-plus" @click="proAddTopBtn">
        新增项目
      </el-button>
      <!-- 表格区域 -->
      <tree-table :data="projectAllList" :columns="columns" :selection-type="false" index-text="#" :expand-type="false"
                  :show-index="true" border :show-row-hover="false">
        <!-- 级别自定义插槽 -->
        <template slot="grade" slot-scope="scope">
          <el-tag v-if="scope.row.ptlevel === '1'">一级</el-tag>
          <el-tag v-else-if="scope.row.ptlevel === '2'" type="success">二级</el-tag>
          <el-tag v-else-if="scope.row.ptlevel === '3'" type="warning">三级</el-tag>
          <el-tag v-else="scope.row.ptlevel === '4'" type="danger">四级</el-tag>
        </template>
        <!-- 操作自定义插槽 -->
        <template slot="operation" slot-scope="scope">

          <el-button size="mini" type="primary" icon="el-icon-plus" v-if="scope.row.parentcode == 0"
                     @click="proAddDialog(scope.row)">添加子级</el-button>
          <el-button size="mini" type="warning" icon="el-icon-edit" @click="proEditDialog(scope.row)">编辑
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="proDeleteBtn(scope.row.protypeid)">删除
          </el-button>
        </template>
      </tree-table>
    </el-card>
    <!-- 添加一级项目分类 -->
    <el-dialog title="提示" :visible.sync="proAddTopDialog" width="40%" :before-close="handleproAddTop">
      <el-form style="padding: 0px 40px;" :model="proAddTopForm" :rules="proAddTopFormRules" ref="proAddTopFormRef">
        <el-form-item label="项目名称" prop="proname">
          <el-input v-model="proAddTopForm.proname"></el-input>
        </el-form-item>
        <el-form-item label="项目编码" prop="procode">
          <el-input v-model="proAddTopForm.procode"></el-input>
        </el-form-item>
        <el-form-item label="是否末级" prop="isflag">
          <el-select v-model="proAddTopForm.isflag" placeholder="请选择">
            <el-option v-for="item in isFlagOptios" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleproAddTop">取 消</el-button>
        <el-button type="primary" @click="proAddTopFormBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加子级项目对话框 -->
    <el-dialog title="添加项目" :visible.sync="proAddDialogVisible" width="40%" :before-close="handleProAddClose">
      <el-form style="padding: 0px 40px;" :model="proAddForm" :rules="proAddFormRules" ref="proAddFormRef">
        <el-form-item label="上级分类" prop="name">
          <el-input v-model="proAddForm.topProname" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="proname">
          <el-input v-model="proAddForm.proname"></el-input>
        </el-form-item>
        <el-form-item label="项目编码" prop="procode">
          <el-input v-model="proAddForm.procode"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="proAddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="proAddFormBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑项目对话框 -->
    <el-dialog title="提示" :visible.sync="proEditDialogVisible" width="50%" :before-close="handleProEditClose">
      <el-form :model="proEditForm" :rules="proEditFormRules" ref="proEditFormRef" label-width="100px">
        <el-form-item label="项目名称" prop="proname">
          <el-input v-model="proEditForm.proname"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleProEditClose">取 消</el-button>
        <el-button type="primary" @click="proEditFormBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        isFlagOptios: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        proAddTopForm: {
          proname: '',
          procode: '',
          isflag: ''
        },
        proAddTopFormRules: {
          proname: [{
            required: true,
            message: '请输入项目名称',
            trigger: 'blur'
          }],
          procode: [{
            required: true,
            message: '请输入项目编码',
            trigger: 'blur'
          }],
          isflag: [{
            required: true,
            message: '请选择是否末级',
            trigger: 'change'
          }],
        },
        // 添加一级项目对话框隐藏
        proAddTopDialog: false,
        // 添加对话框隐藏
        proAddDialogVisible: false,
        // 添加子级项目参数配置
        proAddForm: {
          topProname: '',
          deptname: '',
          deptid: '',
          procode: "",
          proname: "",
          parentcode: "0",
          ptlevel: "1",
          ptsort: "",
          isflag: "",
          state: ""
        },
        // 添加子级项目选择父级ID数组
        proAddFormKeys: [],
        // 添加子级项目参数校验配置
        proAddFormRules: {
          proname: [{
            required: true,
            message: '请输入项目名称',
            trigger: 'blur'
          }],
          procode: [{
            required: true,
            message: '请输入项目编码',
            trigger: 'blur'
          }],
        },
        proAddProps: {
          value: 'protypeid',
          label: 'proname',
          children: 'children',
          checkStrictly: true,
        },
        // 编辑对话框隐藏
        proEditDialogVisible: false,
        // 编辑子级项目参数配置
        proEditForm: {
          proname: '',
          protypeid: '',
        },
        // 编辑项目参数校验配置
        proEditFormRules: {
          proname: [{
            required: true,
            message: '请输入项目名称',
            trigger: 'blur'
          }],
        },
        protypeid: '',
        // 项目数据列表
        projectAllList: [],
        //表格标题数据
        columns: [{
            label: "项目编号",
            prop: "procode",
          }, {
            label: "项目名称",
            prop: "proname",
            headerAlign: 'center',
            align: 'center'
          },
          {
            label: "创建人",
            prop: "creatby",
            headerAlign: 'center',
            align: 'center'
          },
          {
            label: "级别",
            // 表示当前列定义为模板列
            type: "template",
            // 表示当前这一列使用模板名称
            template: "grade",
            headerAlign: 'center',
            align: 'center'
          },
          {
            label: '操作',
            type: 'template',
            template: 'operation',
            width: '300px'
          }
        ],
      }
    },
    computed: {},
    created() {
      this.getProjectAllList()
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.proAddForm.deptid = userInfo.deptid
      this.proAddForm.deptname = userInfo.deptname
    },
    methods: {
      getProjectAllList() {
        this.$axios.post('/projectType/queryAllProList').then(res => {
          this.projectAllList = JSON.parse(res.data)
          console.log(this.projectAllList)
        })
      },
      // 编辑对话框按钮事件
      proEditDialog(row) {
        console.log(row)
        this.proEditForm.proname = row.proname
        this.proEditForm.protypeid = row.protypeid
        this.proEditDialogVisible = true
      },
      // 编辑对话框关闭事件
      handleProEditClose() {
        this.proEditDialogVisible = false
      },
      // 添加一级项目分类
      proAddTopBtn() {
        this.proAddTopDialog = true
      },
      // 添加一级项目分类对话框关闭事件
      handleproAddTop() {
        this.$refs.proAddTopFormRef.resetFields()
        this.proAddTopDialog = false
      },
      proAddTopFormBtn() {
        this.$refs.proAddTopFormRef.validate(valid => {
          if (!valid) return this.$message.error('请先完善信息！')
          let project = [{
              protypeid: "",
              dept: {
                deptid: ''
              },
              procode: this.proAddTopForm.procode,
              proname: this.proAddTopForm.proname,
              parentcode: '0',
              ptlevel: '1',
              ptsort: '0',
              isflag: this.proAddTopForm.isflag,
              remark: '',
              state: "1",
            }],
            empcard = sessionStorage.getItem('ulogin')
          console.log(project)
          this.$axios.post('/projectType/webProjectSave', {
            project,
            empcard
          }).then(res => {
            const data = JSON.parse(res.data)
            if (data.retCode == 0) {
              this.$message.success('项目添加成功！')
              this.getProjectAllList()
              this.proAddTopDialog = false
            } else if (data.retCode == 1) {
              this.$message.success('项目添加失败！')
              this.proAddTopDialog = false
            } else if (data.retCode == 2) {
              this.$message.success('项目编码重复！')
            }
          }).catch(err => {
            this.$message.error('项目添加失败！')
          })

        })
      },
      // 添加子级项目分类按钮事件
      proAddDialog(row) {
        this.proAddForm.topProname = row.proname
        this.proAddForm.parentcode = row.protypeid
        console.log(row)
        this.proAddDialogVisible = true
        console.log(this.isParentcode)
      },
      // 添加子级项目对话框关闭事件
      handleProAddClose() {
        this.isParentcode = 1
        this.$refs.proAddFormRef.resetFields();
        this.proAddDialogVisible = false

      },
      // 添加子级项目选择事件
      handleProAddChange() {
        console.log(this.proAddFormKeys)
      },
      // 添加子级项目对象框确认事件
      proAddFormBtn() {
        this.isParentcode = 1
        console.log(this.proAddFormKeys)
        if (this.proAddFormKeys.length === 0) {
          this.proAddForm.ptlevel = 1
        } else {
          this.proAddForm.ptlevel = this.proAddFormKeys.length + 1
        }
        this.$refs.proAddFormRef.validate(valid => {
          if (!valid) return this.$message.error('请先完善信息！')
          let project = [{
              protypeid: "",
              dept: {
                deptid: ''
              },
              procode: this.proAddForm.procode,
              proname: this.proAddForm.proname,
              parentcode: this.proAddForm.parentcode,
              ptlevel: '2',
              ptsort: '0',
              isflag: this.proAddForm.isflag,
              remark: '',
              state: "1",
            }],
            empcard = sessionStorage.getItem('ulogin')
          console.log(project)
          this.$axios.post('/projectType/webProjectSave', {
            project,
            empcard
          }).then(res => {
            const data = JSON.parse(res.data)
            if (data.retCode == 0) {
              this.$message.success('项目添加成功！')
              this.getProjectAllList()
              this.proAddDialogVisible = false
            } else if (data.retCode == 1) {
              this.$message.error('项目添加失败！')
              this.proAddDialogVisible = false
            } else if (data.retCode == 2) {
              this.$message.error('项目编码重复！')
            }
          }).catch(err => {
            this.$message.error('项目添加失败！')
          })
        })
      },
      async proDeleteBtn(protypeid) {
        this.$confirm('此操作将永久删除该项目, 是否继续?', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {
            data
          } = await this.$axios.post('/projectType/webProjectRemove', {
            protypeid
          })
          const InfoData = JSON.parse(data)
          console.log(InfoData);
          if (InfoData.retCode == 0) {
            this.$message.success('项目删除成功！')
            this.getProjectAllList()
          } else if (InfoData.retCode == 1) {
            this.$message.error('项目删除失败！')
          } else if (InfoData.retCode == 2) {
            this.$message.error('有子级不能删除！')
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      // 修改项目名称确认事件
      async proEditFormBtn() {
        let proname = this.proEditForm.proname
        let protypeid = this.proEditForm.protypeid
        const {
          data
        } = await this.$axios.post('/projectType/webProjectEdit', {
          proname,
          protypeid
        })
        const dataInfo = JSON.parse(data)
        if (dataInfo.retCode == 0) {
          this.$message.success('项目名称修改成功！')
          this.getProjectAllList()
          this.proEditDialogVisible = false
        } else if (dataInfo.retCode == 1) {
          this.$message.error('项目名称修改失败！')
          this.proEditDialogVisible = false
        } else {
          this.$message.error('修改失败！')
        }

      }
    },
  }

</script>
<style scoped>
  .el-cascader,
  .el-select {
    width: 100%;
  }

  .zk-table {
    font-size: 14px !important;
    color: #606266 !important;
  }

  .zk-table__cell-inner {
    padding: 10px 12px !important;
  }

</style>
