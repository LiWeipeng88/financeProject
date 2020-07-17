<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>预算通知</el-breadcrumb-item>
      <el-breadcrumb-item>通知</el-breadcrumb-item>
      <el-breadcrumb-item>{{ addFrom.notitle == '' ? '新增' : '修改' }}通知</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item label="通知标题：" prop="notitle">
          <el-input v-model="addFrom.notitle" placeholder="请输入通知标题"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <!-- <el-col :span="6">
            <el-form-item label="日期状态：" prop="isflag">
              <el-select v-model="addFrom.isflag" placeholder="请选择日期状态">
                <el-option label="未过期" value="0"></el-option>
                <el-option label="已过期"" value=" 1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发布状态：" prop="pubstate">
              <el-select v-model="addFrom.pubstate" placeholder="请选择发布状态">
                <el-option label="未发布" value="0"></el-option>
                <el-option label="已发布" value=" 1"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="开始时间：" prop="starttime">
              <el-date-picker v-model="addFrom.starttime" type="datetime" placeholder="请选择开始时间"
                              value-format='yyyy-MM-dd hh:mm:ss'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束时间：" prop="endtime">
              <el-date-picker v-model="addFrom.endtime" type="datetime" placeholder="请选择结束时间"
                              value-format='yyyy-MM-dd hh:mm:ss'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年度：" prop="starttime">
              <el-date-picker v-model="addFrom.year" type="year" placeholder="请选择年度" value-format='yyyy'>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="通知内容：" prop="nocontent">
          <el-input type="textarea" v-model="addFrom.nocontent" placeholder="请输入通知内容" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="备注信息：" prop="memo">
          <el-input type="textarea" v-model="addFrom.memo" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addNoticeForm()">保 存</el-button>
          <el-button @click="resetNoticeForm()">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        noid: '',
        createby: '',
        addFrom: {
          noid: '',
          notitle: "",
          nocontent: "",
          starttime: "",
          endtime: "",
          year: "",
          pubstate: "",
          pubtime: "",
          isflag: "",
          memo: ""
        },
        addFromRules: {
          notitle: [{
            required: true,
            message: '请输入通知标题',
            trigger: 'blur'
          }],
          starttime: [{
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }],
          endtime: [{
            required: true,
            message: '请选择结束时间',
            trigger: 'change'
          }],
          nocontent: [{
            required: true,
            message: '请输入通知内容',
            trigger: 'blur'
          }, ]
        }
      };
    },
    created() {
      this.noid = this.$route.query.id
      if (!this.noid == '') {
        this.getOneNotice(this.noid)
      }
      this.createby = sessionStorage.getItem('ulogin')
    },
    mounted() {

    },
    methods: {
      async getOneNotice(noid) {
        const res = await this.$axios.post('/notice/getOneNotice', {
          noid
        })
        console.log(res)
        if (res.status === 200) {
          this.addFrom = JSON.parse(res.data)[0]
          console.log(this.addFrom)
        }
      },
      // 添加通知列表数据
      addNoticeForm() {
        this.$refs.addFromRef.validate(async (valid) => {
          if (!valid) return this.$message.error('请完善新增通知数据！')
          let notice = [{
            noid: this.noid,
            notitle: this.addFrom.notitle,
            nocontent: this.addFrom.nocontent,
            starttime: this.addFrom.starttime,
            endtime: this.addFrom.endtime,
            year: this.addFrom.year,
            createby: this.createby,
            pubstate: 0,
            pubtime: this.addFrom.pubtime,
            isflag: 0,
            memo: this.addFrom.memo,
          }]
          console.log(notice)
          const res = await this.$axios.post('/notice/webSave', {
            notice
          })
          console.log(res);
          if (res.status === 200) {
            this.$message.success('通知数据保存成功！')
            this.$router.push({
              path: '/notice/queryPage'
            })
          } else {
            this.$message.error('通知数据保存失败！')
          }
        })
      },
      // 重置表单为空
      resetNoticeForm() {
        this.addFrom = {
          notitle: "",
          nocontent: "",
          starttime: "",
          endtime: "",
          createby: "",
          pubstate: "",
          pubtime: "",
          isflag: "",
          memo: ""
        }
      }
    },
  }

</script>

<style scoped>
  .el-select {
    width: 100%;
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }

</style>
