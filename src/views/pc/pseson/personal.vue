<template>
  <div class="person">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>个人资料</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="person_info">
        <div class="top">
          <div class="header">
            <img v-if="personInfo.signature" :src="personInfo.signature" alt="">
            <img v-else src="../../../assets/img/touxiang.jpg" alt="">
          </div>
          <div class="body_base">
            <p><span>姓名：</span>{{personInfo.entname}}</p>
            <p><span>性别：</span>{{personInfo.empsex}}</p>
            <p><span>电话：</span>{{personInfo.emptel}}</p>
          </div>
        </div>
        <div class="body_info">
          <div class="info">
            <div class="info_s">
              <p><span>工号：</span>{{personInfo.empcode}}</p>
              <p><span>部门：</span>{{personInfo.deptname}}</p>
              <p><span>职务：</span>{{personInfo.postname}}</p>
              <p><span>状态：</span>
                <span v-if="personInfo.state == 1">在职</span>
                <span v-else type="warning">离职</span>
              </p>
              <p><span>部门负责人：</span>
                <span v-if="personInfo.isflag == 1">是</span>
                <span v-else type="warning">否</span>
              </p>
            </div>
            <div class="info_s">
              <p><span>银行卡号：</span>{{personInfo.bankcard}}</p>
              <p><span>身份证号：</span>{{personInfo.empcard}}</p>
              <p><span>开户行：</span>{{personInfo.bankname}}</p>
              <p><span>学历：</span>{{personInfo.edubg}}</p>
              <p><span>学位：</span>{{personInfo.edudegree}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="handleEdit">
        <el-button type="primary" @click="handleEditDialog()" icon="el-icon-edit">修改信息</el-button>
      </div>
    </el-card>

    <!-- 完善人员信息 -->
    <el-dialog title="完善人员信息" :visible.sync="prePersonInfoDialog" width="60%" :before-close="handleprePersonInfoClose">
      <el-form ref="personInfoRef" :rules="personInfoRules" :model="personInfo">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名" prop="entname">
              <el-input v-model="personInfo.entname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" prop="empsex">
              <el-select v-model="personInfo.empsex" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工号" prop="empcode">
              <el-input v-model="personInfo.empcode" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门" prop="deptid">
              <el-select v-model="personInfo.deptid" placeholder="请选择部门">
                <el-option v-for="item in deptDataList" :key="item.deptid" :label="item.deptname" :value="item.deptid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="银行卡号" prop="bankcard">
              <el-input v-model="personInfo.bankcard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开户行" prop="bankname">
              <el-input v-model="personInfo.bankname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号" prop="empcard">
              <el-input v-model="personInfo.empcard" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职务" prop="postid">
              <el-select v-model="personInfo.postid" placeholder="请选择职务">
                <el-option v-for="item in postLists" :key="item.postid" :label="item.postname" :value="item.postid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="职称" prop="posttitle">
              <el-input v-model="personInfo.posttitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学历" prop="edubg">
              <el-input v-model="personInfo.edubg"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学位" prop="edudegree">
              <el-input v-model="personInfo.edudegree"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系电话" prop="emptel">
              <el-input v-model="personInfo.emptel" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="状态" prop="state">
              <el-select v-model="personInfo.state" placeholder="请选择状态">
                <el-option label="在职" value="1"></el-option>
                <el-option label="离职" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门负责人" prop="isflag">
              <el-select v-model="personInfo.isflag" placeholder="请选择部门负责人">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="个人签名">
          <el-upload class="avatar-uploader" :action="uploadURL" :show-file-list="false"
                     :on-success="handlePreAvatarSuccess">
            <img v-if="personInfo.signature" :src="personInfo.signature" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleprePersonInfoClose">取 消</el-button>
        <el-button type="primary" @click="prePersonInfoBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import GLOBAL from '../../../api/global_path'
  export default {
    data() {
      return {
        // 职务菜单数据
        postLists: [],
        // 部门数据列表
        deptDataList: [],
        personInfo: {},
        // 完善人员信息表单校验表单
        personInfoRules: {
          entname: {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          },
          empsex: {
            required: true,
            message: "请选择性别",
            trigger: "change"
          },
          empcard: {
            required: true,
            message: "请输入身份证号",
            trigger: "blur"
          },
          deptid: {
            required: true,
            message: "请选择部门",
            trigger: "change"
          },
          empcode: {
            required: true,
            message: "请输入工号",
            trigger: "blur"
          },
          bankcard: {
            required: true,
            message: "请输入银行卡号",
            trigger: "blur"
          },
          bankname: {
            required: true,
            message: "请输入开户行",
            trigger: "blur"
          },
          postid: {
            required: true,
            message: "请选择职务",
            trigger: "change"
          },
          posttitle: {
            required: true,
            message: "请输入职称",
            trigger: "blur"
          },
          edubg: {
            required: true,
            message: "请输入学历",
            trigger: "blur"
          },
          edudegree: {
            required: true,
            message: "请输入学位",
            trigger: "blur"
          },
          emptel: {
            required: true,
            message: "请输入联系电话",
            trigger: "blur"
          },
          state: {
            required: true,
            message: "请选择状态",
            trigger: "change"
          },
          isflag: {
            required: true,
            message: "请选择部门负责人",
            trigger: "change"
          }
        },
        // 完善人员信息对话框隐藏
        prePersonInfoDialog: false,
        // 图片上传URL地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
      };
    },
    created() {
      let empcard = sessionStorage.getItem('ulogin')
      this.getPerson(empcard)
    },
    mounted() {

    },
    methods: {
      async getPerson(empcard) {
        const res = await this.$axios.post('/employee/queryEmpbycard', {
          empcard
        })
        if (res.status === 200) {
          this.personInfo = JSON.parse(res.data)
        } else {
          this.$message.error('获取数据失败！')
        }
        console.log(this.personInfo);
      },
      // 完善信息对话框
      handleEditDialog() {
        this.prePersonInfoDialog = true;
        this.getPostList();
        this.getDeptList()
      },
      // 完善人员信息对话框关闭事件
      handleprePersonInfoClose() {
        this.prePersonInfoDialog = false
      },
      // 完善个人签名图片上传
      handlePreAvatarSuccess(res) {
        this.personInfo.signature = this.imgURL + JSON.parse(res).relationPath
      },
      // 完善提交事件
      prePersonInfoBtn() {
        this.$refs.personInfoRef.validate(valid => {
          if (!valid) return this.$message.error('请先完善人事信息！')
          let employee = [{
            empid: this.personInfo.empid,
            empname: this.personInfo.entname,
            empsex: this.personInfo.empsex,
            empcard: this.personInfo.empcard,
            dept: {
              deptid: this.personInfo.deptid
            },
            empcode: this.personInfo.empcode,
            jobpost: {
              postid: this.personInfo.postid
            },
            posttitle: this.personInfo.posttitle,
            bankcard: this.personInfo.bankcard,
            bankname: this.personInfo.bankname,
            edubg: this.personInfo.edubg,
            edudegree: this.personInfo.edudegree,
            emptel: this.personInfo.emptel,
            state: this.personInfo.state,
            isflag: this.personInfo.isflag,
            signature: this.personInfo.signature
          }]
          let webchatid = ''
          this.$axios.post('/employee/webEmpSave', {
            employee,
            webchatid
          }).then(res => {
            const data = JSON.parse(res.data)
            if (data.retCode == 0) {
              this.$message.success('人员信息修改成功！')
              this.prePersonInfoDialog = false
            } else if (data.retCode == 1) {
              this.$message.error('人员信息修改失败！')
              this.prePersonInfoDialog = false
            } else if (data.retCode == 2) {
              this.$message.error('人员信息身份证号重复！')
            } else if (data.retCode == 3) {
              this.$message.error('本部门已有负责人！')
            }
          })
        });
      },
      // 获取职务列表菜单
      async getPostList() {
        const {
          data: res
        } = await this.$axios.post("/jobpost/queryAllPost");
        const data = JSON.parse(res);
        this.postLists = data;
      },
      // 获取部门数据
      async getDeptList() {
        const {
          data
        } = await this.$axios.post('/department/queryListall')
        this.deptDataList = JSON.parse(data)
        console.log(this.deptDataList);

      },
    },
  }

</script>

<style scoped>
  .el-card {
    height: 85vh;
  }

  .person_info {
    margin-top: 2%;
    color: #666;
    font-size: 14px;
    position: relative;
  }

  .handleEdit {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .top {
    display: flex;
    justify-content: center;
    width: 400px;
    margin: 0 auto;
  }

  .header {
    width: 90px;
    height: 90px;
  }

  .header img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  .body_base {
    margin-left: 30px;
  }

  .body_base p {
    padding: 0;
    margin: 0;
    line-height: 2;
  }


  .body_info {
    margin-top: 26px;
    background-color: #f5f5f7;
  }

  .body_info .info {
    display: flex;
    justify-content: space-around;
    padding: 0px;
    width: 600px;
    margin: 0 auto;
  }

  .el-select {
    width: 100%;
  }

  .avatar-uploader-icon[data-v-62a9822e] {
    border: 1px dashed #eee;
  }

  .avatar-uploader-icon[data-v-62a9822e]:hover {
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

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

  .el-input-group__prepend {
    width: 130px;
  }

  .input-with-select .el-select {
    width: 110px;
  }


  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

</style>
