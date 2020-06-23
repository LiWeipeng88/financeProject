<template>
  <div class="work_flow">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>流程设置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card 卡片视图区域 -->
    <el-card>
      <el-tabs type="border-card">
        <!-- 报销设置视图 -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-document-checked"></i> 日常报销设置</span>
          <el-table :data="dailybxData" border style="width: 100%">
            <el-table-column label="序号" align="center" width="100">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="pointname" label="流程节点">
            </el-table-column>
            <el-table-column prop="operator" label="办理人"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editApplyBox(scope.row.fid)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 差旅设置视图 -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-document-checked"></i> 差旅报销设置</span>
          <el-table :data="travelbxData" border style="width: 100%">
            <el-table-column label="序号" align="center" width="100">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="pointname" label="流程节点">
            </el-table-column>
            <el-table-column prop="operator" label="办理人"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editTravelBox(scope.row.fid)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 借款设置视图 -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-document"></i> 借款设置</span>
          <el-table :data="loanData" border style="width: 100%">
            <el-table-column label="序号" align="center" width="100">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="pointname" label="流程节点">
            </el-table-column>
            <el-table-column prop="operator" label="办理人"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editLoanBox(scope.row.fid)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 预算设置视图 -->
        <el-tab-pane>
          <span slot="label"><i class="el-icon-document"></i> 预算设置</span>
          <el-table :data="flowysData" border style="width: 100%">
            <el-table-column label="序号" align="center" width="100">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="pointname" label="流程节点">
            </el-table-column>
            <el-table-column prop="operator" label="办理人"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editBudgetBox(scope.row.fid)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 修改报销设置对话框 -->
    <el-dialog title="修改日常报销设置" :visible.sync="editApplyBoxDialog" width="40%" :before-close="handleEditApplyClose">
      <el-form ref="editApplyFormRef">
        <el-form-item label="选择职务">
          <el-select v-model="postValue" placeholder="请选择职务">
            <el-option v-for="item in postLists" :key="item.postid" :label="item.postname" :value="item.postid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditApplyClose">取 消</el-button>
        <el-button type="primary" @click="editApplyForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改差旅设置对话框 -->
    <el-dialog title="修改差旅报销设置" :visible.sync="editTravelBoxDialog" width="40%" :before-close="handleEditTravelClose">
      <el-form ref="editTravelFormRef">
        <el-form-item label="选择职务">
          <el-select v-model="postValue" placeholder="请选择职务">
            <el-option v-for="item in postLists" :key="item.postid" :label="item.postname" :value="item.postid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditTravelClose">取 消</el-button>
        <el-button type="primary" @click="editTravelBoxBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改借款设置对话框 -->
    <el-dialog title="修改借款设置" :visible.sync="editLoanBoxDialog" width="40%" :before-close="handleEditLoanClose">
      <el-form ref="editLoanFormRef">
        <el-form-item label="选择职务">
          <el-select v-model="postValue" placeholder="请选择职务">
            <el-option v-for="item in postLists" :key="item.postid" :label="item.postname" :value="item.postid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditLoanClose">取 消</el-button>
        <el-button type="primary" @click="editLoanBoxBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改预算设置对话框 -->
    <el-dialog title="修改预算设置" :visible.sync="editBudgetBoxDialog" width="50%" :before-close="handleEditBudgeClose">
      <el-form ref="editBudgetFormRef">
        <el-form-item label="选择职务">
          <el-select v-model="postValue" placeholder="请选择职务">
            <el-option v-for="item in postLists" :key="item.postid" :label="item.postname" :value="item.postid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditBudgeClose">取 消</el-button>
        <el-button type="primary" @click="editBudgetForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        // 报销主键id
        editApplyBoxId: "",
        // 报销修改的部门id
        postValue: '',
        // 职务菜单数据
        postLists: [],
        // 日常报销数据
        dailybxData: [],
        // 差旅报销数据
        travelbxData: [],
        editTravelBoxId: '',
        editTravelBoxDialog: false,
        // 预算
        flowysData: [],
        // 预算主键id
        editBudgetBoxId: "",
        // 借款
        loanData: [],
        editLoanBoxId: '',
        editLoanBoxDialog: false,
        // 报销对话框控制
        editApplyBoxDialog: false,
        // 预算对话框控制
        editBudgetBoxDialog: false
      };
    },
    created() {
      // 调用获取流程数据事件
      this.getWorkList();
      // 调用获取职务菜单事件
      this.getPostList();
    },
    methods: {
      // 获取流程数据事件
      async getWorkList() {
        const {
          data: res
        } = await this.$axios.post("/flowpost/queryList");
        const WorkData = JSON.parse(res);
        console.log(WorkData)
        this.dailybxData = WorkData.dailybx;
        this.flowysData = WorkData.flowys;
        this.travelbxData = WorkData.travelbx;
        this.loanData = WorkData.loan
      },
      // 获取职务列表菜单
      async getPostList() {
        const {
          data: res
        } = await this.$axios.post("/jobpost/queryAllPost");
        const data = JSON.parse(res);
        this.postLists = data;
      },
      // 报销修改按钮事件
      editApplyBox(id) {
        this.editApplyBoxId = id;
        this.editApplyBoxDialog = true;
      },

      // 报销对话框确定按钮事件
      async editApplyForm() {
        let flowpost = [{
          fid: this.editApplyBoxId,
          operator: this.postValue
        }];
        const {
          data: res
        } = await this.$axios.post("/flowpost/webEdit", {
          flowpost
        });
        this.$message.success('办理人修改成功！')
        this.editApplyBoxDialog = false;
        this.getWorkList();
      },
      // 报销对话框关闭事件
      handleEditApplyClose() {
        this.postValue = ''
        this.editApplyBoxDialog = false;
      },
      // 预算修改按钮事件
      editBudgetBox(id) {
        this.editBudgetBoxId = id;
        this.editBudgetBoxDialog = true;
      },

      // 预算对话框确定按钮
      async editBudgetForm() {
        let flowpost = [{
          fid: this.editBudgetBoxId,
          operator: this.postValue
        }];
        const {
          data: res
        } = await this.$axios.post("/flowpost/webEdit", {
          flowpost
        });
        this.$message.success('办理人修改成功！')
        this.editBudgetBoxDialog = false;
        this.getWorkList();
      },
      // 预算对话框关闭事件
      handleEditBudgeClose() {
        this.postValue = ''
        this.editBudgetBoxDialog = false;
      },
      // 差旅修改按钮
      editTravelBox(id) {
        this.editTravelBoxId = id;
        this.editTravelBoxDialog = true;
      },
      // 差旅修改对话框确定按钮
      async editTravelBoxBtn() {
        let flowpost = [{
          fid: this.editTravelBoxId,
          operator: this.postValue
        }];
        const {
          data: res
        } = await this.$axios.post("/flowpost/webEdit", {
          flowpost
        });
        this.$message.success('办理人修改成功！')
        this.editTravelBoxDialog = false;
        this.getWorkList();
      },
      // 差旅对话框关闭事件
      handleEditTravelClose() {
        this.postValue = ''
        this.editTravelBoxDialog = false;
      },
      // 修改借款按钮
      editLoanBox(id) {
        this.editLoanBoxId = id
        this.editLoanBoxDialog = true
      },
      // 修改借款对话框确认按钮
      async editLoanBoxBtn() {
        let flowpost = [{
          fid: this.editLoanBoxId,
          operator: this.postValue
        }];
        const {
          data: res
        } = await this.$axios.post("/flowpost/webEdit", {
          flowpost
        });
        this.$message.success('办理人修改成功！')
        this.editLoanBoxDialog = false;
        this.getWorkList();
      },
      // 借款对话框关闭事件
      handleEditLoanClose() {
        this.postValue = ''
        this.editLoanBoxDialog = false;
      },
    }
  };

</script>
<style scoped></style>
