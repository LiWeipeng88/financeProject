<template>
  <div class="duty_list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>职务管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addPost">添加职务</el-button>
        </el-col>
      </el-row>
      <!-- 职务表格区域 -->
      <el-table :data="postList" border style="width: 100%">
        <el-table-column label="序号" align="center" width="100">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="postname" label="职务名称" align="center">
        </el-table-column>
        <el-table-column label="是否显示" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isflag == 1">是</el-tag>
            <el-tag v-if="scope.row.isflag == 0" type="danger">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注" align="center">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editPostData(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @current-change="handleCurrentChange" :page-sizes="[5]" :page-size="5"
                     layout="total, sizes, prev, pager, next, jumper" :total="+total">
      </el-pagination>
    </el-card>
    <!-- 添加职务对话框 -->
    <el-dialog title="添加职务" :visible.sync="addPostdialog" width="50%" :before-close="handleaddPostClose">
      <el-form :model="addPostForm" :rules="addPostFormRules" ref="addPostFormRef" label-width="100px">
        <el-form-item label="职位名称" prop="postname">
          <el-input v-model="addPostForm.postname"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="addPostForm.memo"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isflag">
          <el-select v-model="addPostForm.isflag" placeholder="是否显示职务" style="width: 100%;">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleaddPostClose">取 消</el-button>
        <el-button type="primary" @click="addPostData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 职务信息修改对话框 -->
    <el-dialog title="职务信息" :visible.sync="editPostDataDialog" width="50%" :before-close="editPostDataDialogClose">
      <el-form :model="editPostForm" label-width="100px">
        <el-form-item label="职位名称" prop="postname">
          <el-input v-model="editPostForm.postname"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input v-model="editPostForm.memo"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isflag">
          <el-select v-model="editPostForm.isflag" placeholder="是否显示职务" style="width: 100%;">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPostDataDialogClose">取 消</el-button>
        <el-button type="primary" @click="editPostDataBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        // 职务修改对话框隐藏
        editPostDataDialog: false,
        // 添加职位数据校验规则
        addPostFormRules: {
          postname: [{
            required: true,
            message: '请输入职位名称',
            trigger: 'blur'
          }],
          memo: [{
            required: true,
            message: '请输入备注信息',
            trigger: 'blur'
          }],
          isflag: [{
            required: true,
            message: '请选择是否显示职务',
            trigger: 'change'
          }]
        },
        // 添加职务对话框参数配置
        addPostForm: {
          postname: "",
          memo: "",
          isflag: "",
          postid: ""
        },
        // 修改职务对话框参数配置
        editPostForm: {
          postname: "",
          memo: "",
          isflag: "",
          postid: ""
        },
        // 控制添加职务对话框的显示
        addPostdialog: false,
        // 职务列表总条数
        total: "",
        // 职务列表数据
        postList: [],
        // 请求参数配置
        jobpost: [{
          postid: "",
          postname: "",
          dept: {
            deptid: ""
          },
          isflag: "1"
        }],
        // 分页数
        pagenum: "0"
      };
    },
    created() {
      // 职位函数的调用
      this.getPostList();
    },
    methods: {
      // 获取职务的事件
      async getPostList() {
        let jobpost = this.jobpost;
        let pagenum = this.pagenum;
        const {
          data: res
        } = await this.$axios.post("/jobpost/querybyparam", {
          jobpost,
          pagenum
        });
        const data = JSON.parse(res);
        console.log("PostList", data);
        this.postList = data.jobpost;
        this.total = data.pagetotal;
      },
      // 分页页码改变的事件
      handleCurrentChange(newPage) {
        this.pagenum = newPage - 1;
        this.getPostList();
      },
      // 添加职务按钮事件
      addPost() {
        this.addPostdialog = true;
      },
      // 提交添加职务的数据
      addPostData() {
        this.$refs.addPostFormRef.validate(async valid => {
          if (!valid) return this.$message.error('请填写职务信息！')
          let jobpost = [{
            postid: this.addPostForm.postid,
            postname: this.addPostForm.postname,
            isflag: this.addPostForm.isflag,
            dept: {
              deptid: ""
            },
            memo: this.addPostForm.memo
          }];
          console.log(jobpost)
          const {
            data: res
          } = await this.$axios.post("/jobpost/webSave", {
            jobpost
          });
          console.log("this.addPostForm", res);
          this.addPostdialog = false;
          this.$message.success('职务添加成功！')
          this.getPostList();
        })
      },
      // 添加职位对话框关闭事件
      handleaddPostClose() {
        this.$refs.addPostFormRef.resetFields();
        this.addPostdialog = false
      },
      // 职务编辑按钮事件
      editPostData(row) {
        console.log(row);
        this.editPostForm.postid = row.postid
        this.editPostForm.postname = row.postname
        this.editPostForm.memo = row.memo
        this.editPostForm.isflag = row.isflag
        this.editPostDataDialog = true
      },
      // 职务编辑对话框关闭事件
      editPostDataDialogClose() {
        this.editPostDataDialog = false
      },
      async editPostDataBtn() {
        let jobpost = [{
          postid: this.editPostForm.postid,
          postname: this.editPostForm.postname,
          isflag: this.editPostForm.isflag,
          dept: {
            deptid: ""
          },
          memo: this.editPostForm.memo
        }];
        console.log(jobpost)
        const {
          data: res
        } = await this.$axios.post("/jobpost/webSave", {
          jobpost
        });
        console.log("this.editPostForm", res);
        this.$message.success('职务修改成功！')
        this.getPostList();
        this.editPostDataDialog = false
      }
    }
  };

</script>
