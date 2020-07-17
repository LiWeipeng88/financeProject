<template>
  <div class="notice">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预算通知</el-breadcrumb-item>
      <el-breadcrumb-item>通知</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 增加按钮和查询条件 -->
      <el-form :model="noticeParams" label-width="100px" :inline="true">
        <el-button type="primary" icon="el-icon-plus" @click="addNoticeBtn()">新增通知</el-button>
        <el-form-item label="通知标题：">
          <el-input placeholder="请输入通知标题" v-model="noticeParams.notitle" class="input-with-select" clearable
                    @clear='clearFrom()'>
            <el-button slot="append" icon="el-icon-search" @click='searchBtn()'></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="日期状态：">
          <el-select v-model="noticeParams.isflag" placeholder="请选择日期状态" @change='changeisflag()'>
            <el-option label="未过期" value="0"></el-option>
            <el-option label="已过期" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态：">
          <el-select v-model="noticeParams.pubstate" placeholder="请选择发布状态" @change='changepubstate()'>
            <el-option label="未发布" value="0"></el-option>
            <el-option label="已发布" value="1"></el-option>
            <el-option label="取消" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年度：">
          <el-date-picker v-model="noticeParams.year" type="year" placeholder="请选择年度" value-format='yyyy'
                          @change='changeYear'>
          </el-date-picker>
        </el-form-item>
      </el-form>

      <!-- 数据列表 -->
      <el-table :data="noticeLists" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <h2>通知内容：</h2>
            <p>{{props.row.nocontent}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="notitle" label="通知标题" align='center'>
        </el-table-column>
        <el-table-column prop="starttime" label="开始时间" align='center'>
        </el-table-column>
        <el-table-column prop="endtime" label="结束时间" align='center'>
        </el-table-column>
        <el-table-column prop="createby" label="发布人" width="80" align='center'>
        </el-table-column>
        <el-table-column prop="year" label="年度" width="80" align='center'>
        </el-table-column>
        <el-table-column label="发布状态" align='center'>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pubstate == 0">未发布</el-tag>
            <el-tag v-if="scope.row.pubstate == 1" type="warning">已发布</el-tag>
            <el-tag v-if="scope.row.pubstate == 2" type="danger">取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="日期状态" align='center'>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isflag == 0">未过期</el-tag>
            <el-tag v-if="scope.row.isflag == 1" type="warning">已过期</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align='center' width="280">
          <template slot-scope="scope">
            <el-button size="small" type="success" icon="el-icon-finished" @click="putNoticeBtn(scope.row)">发布
            </el-button>
            <el-button v-if="scope.row.pubstate == 0 || scope.row.pubstate == 2" size="small" type="primary"
                       icon="el-icon-edit" @click="addNoticeBtn(scope.row.noid)">修改</el-button>
            <el-button v-if="scope.row.pubstate == 0 || scope.row.pubstate == 2" size="small" type="danger"
                       icon="el-icon-delete" @click='removeNoticeId(scope.row.noid)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @current-change="handleTravelCurrentChange" :page-sizes="[5]" :page-size="5"
                     layout="total, sizes, prev, pager, next, jumper" :total="+pagetotal">
      </el-pagination>
    </el-card>
    <!-- 发布对话框 -->
    <el-dialog title="提示" :visible.sync="putNoticeDialog" width="50%" :before-close="handleClosePutForm">
      <el-form :model="putForm" :rules="putFormRules" ref="putFormRef" label-width="100px">
        <el-form-item label="通知标题：" prop="notitle">
          <el-input v-model="notitle" disabled></el-input>
        </el-form-item>
        <el-form-item label="发布状态：" prop="pubstate">
          <el-select v-model="putForm.pubstate" placeholder="请选择发布状态">
            <el-option label="未发布" value="0"></el-option>
            <el-option label="已发布" value="1"></el-option>
            <el-option label="取消发布" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClosePutForm()">取 消</el-button>
        <el-button type="primary" @click="putBtn()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        notitle: '',
        noticeParams: {
          notitle: '',
          pubstate: '0',
          isflag: '0',
          year: '',
          pagenum: '0'
        },
        noticeLists: [],
        putNoticeDialog: false,
        pagetotal: 0,
        putForm: {
          noid: '',
          pubstate: ''
        },
        putFormRules: {
          pubstate: [{
            required: true,
            message: '请选择发布状态',
            trigger: 'change'
          }],
        }
      };
    },
    created() {
      this.getNoticeLits()
    },
    mounted() {

    },
    methods: {
      // 获取通知列表
      async getNoticeLits() {
        if (this.noticeParams.year == null) {
          this.noticeParams.year = ''
        }
        let notitle = this.noticeParams.notitle
        let pubstate = this.noticeParams.pubstate
        let isflag = this.noticeParams.isflag
        let year = this.noticeParams.year
        let pagenum = this.noticeParams.pagenum
        const res = await this.$axios.post('/notice/getlistbyparm', {
          notitle,
          pubstate,
          isflag,
          year,
          pagenum
        })
        if (res.status === 200) {
          const data = JSON.parse(res.data)
          this.noticeLists = data.notice
          this.pagetotal = data.pagetotal
        } else {
          this.$message.error('获取通知列表数据失败！')
        }
        console.log(this.noticeLists);

      },
      // 通知列表数据分页
      handleTravelCurrentChange(newPage) {
        this.noticeParams.pagenum = newPage - 1
        this.getNoticeLits()
      },
      // 新曾按钮跳转事件
      addNoticeBtn(id) {
        this.$router.push({
          path: '/addNotice',
          query: {
            id
          }
        })
      },
      // 发布对话框事件
      putNoticeBtn(row) {
        this.putForm.noid = row.noid
        this.notitle = row.notitle
        this.putNoticeDialog = true
      },
      // 发布对话框关闭事件
      handleClosePutForm() {
        this.putNoticeDialog = false,
          this.putForm.pubstate = ''
      },
      // 发布对话框确定按钮
      putBtn() {
        this.$refs.putFormRef.validate(async (valid) => {
          if (!valid) return this.$message.error('请选择发布状态！')
          const res = await this.$axios.post('/notice/webEditParam', this.putForm)
          console.log(res)
          if (res.status === 200) {
            this.$message.success('发布状态更改成功！')
            this.putNoticeDialog = false,
              this.getNoticeLits()
          } else {
            this.$message.error('发布状态更改失败！')
          }
        })
      },
      removeNoticeId(noid) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$axios.post('/notice/webRemove', {
            noid
          })
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getNoticeLits()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      searchBtn() {
        this.getNoticeLits()
      },
      clearFrom() {
        this.getNoticeLits()
      },
      changeisflag() {
        this.getNoticeLits()
      },
      changepubstate() {
        this.getNoticeLits()
      },
      changeYear(value) {
        this.getNoticeLits()
      },
    },
  }

</script>

<style scoped>
  h2 {
    padding: 0;
    margin: 0;
  }

</style>
