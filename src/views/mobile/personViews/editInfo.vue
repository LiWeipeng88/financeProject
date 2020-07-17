<template>
  <div class="edit_info">
    <el-form ref="personInfoRef" :rules="personInfoRules" :model="personInfo">
      <el-form-item label="姓名" prop="entname">
        <el-input v-model="personInfo.entname"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="empsex">
        <el-select v-model="personInfo.empsex" placeholder="请选择性别">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="empcode">
        <el-input v-model="personInfo.empcode" disabled></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="deptid">
        <el-select v-model="personInfo.deptid" placeholder="请选择部门">
          <el-option v-for="item in deptDataList" :key="item.deptid" :label="item.deptname" :value="item.deptid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="银行卡号" prop="bankcard">
        <el-input v-model="personInfo.bankcard"></el-input>
      </el-form-item>
      <el-form-item label="开户行" prop="bankname">
        <el-input v-model="personInfo.bankname"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="empcard">
        <el-input v-model="personInfo.empcard" disabled></el-input>
      </el-form-item>
      <el-form-item label="职务" prop="postid">
        <el-select v-model="personInfo.postid" placeholder="请选择职务">
          <el-option v-for="item in postLists" :key="item.postid" :label="item.postname" :value="item.postid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职称" prop="posttitle">
        <el-input v-model="personInfo.posttitle"></el-input>
      </el-form-item>
      <el-form-item label="学历" prop="edubg">
        <el-input v-model="personInfo.edubg"></el-input>
      </el-form-item>
      <el-form-item label="学位" prop="edudegree">
        <el-input v-model="personInfo.edudegree"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="emptel">
        <el-input v-model="personInfo.emptel" disabled></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="personInfo.state" placeholder="请选择状态">
          <el-option label="在职" value="1"></el-option>
          <el-option label="离职" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门负责人" prop="isflag">
        <el-select v-model="personInfo.isflag" placeholder="请选择部门负责人">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="个人签名">
        <el-upload class="avatar-uploader" :action="uploadURL" :show-file-list="false"
                   :on-success="handlePreAvatarSuccess">
          <img v-if="personInfo.signature" :src="personInfo.signature" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div style="margin: 16px auto; width: 60%;">
      <van-button round block type="primary" size="normal" @click="prePersonInfoBtn"
                  style="background-color: #1989fa; border-color:#1989fa;">
        提 交
      </van-button>
    </div>
  </div>
</template>

<script>
  import GLOBAL from '../../../api/global_path'
  import {
    Toast,
    Notify
  } from 'vant';
  import tokenUtils from '../../../../utils/cookieToken'
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
        // 图片上传URL地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
      };
    },
    created() {
      let empcard = sessionStorage.getItem('ulogin')
      this.getPerson(empcard)
      this.getPostList();
      this.getDeptList()
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
      // 完善个人签名图片上传
      handlePreAvatarSuccess(res) {
        this.personInfo.signature = this.imgURL + JSON.parse(res).relationPath
      },
      // 完善提交事件
      prePersonInfoBtn() {
        this.$refs.personInfoRef.validate(valid => {
          if (!valid) {
            return Toast({
              message: '请先完善人事信息！',
              icon: 'close',
            })
          }
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
              Toast({
                message: '人员信息修改成功！',
                icon: 'warning-o',
              })
              setTimeout(() => {
                this.$router.push('/employee/queryOne')
              }, 800)
            } else if (data.retCode == 2) {
              Toast({
                message: '人员信息身份证号重复！',
                icon: 'close',
              })
            } else if (data.retCode == 3) {
              Toast({
                message: '本部门已有负责人！',
                icon: 'close',
              })

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
  .el-breadcrumb {
    padding: .875rem;
  }

  .edit_info {
    padding: 20px;
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

</style>
