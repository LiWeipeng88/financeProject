<template>
  <div class="renshi">
    <!-- 页眉区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息</el-breadcrumb-item>
      <el-breadcrumb-item>人事管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->

    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-plus" size="medium" @click="addPersonInfoBtn">新增人员</el-button>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="keyWords" class="input-with-select" clearable @clear="clearSearch">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="身份证号" value="1"></el-option>
              <el-option label="手机号" value="2"></el-option>
            </el-select>
            <el-button type="primary" slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2" :offset="12">
          <el-button type="primary" plain icon="el-icon-search" size="medium" @click="condSearchBtn">多条件查询</el-button>
        </el-col>
      </el-row>
      <div class="info_table">
        <el-table :data="personLists" style="width: 100%" border stripe>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form class="demo-table-expand">
                <el-row :gutter="20">
                  <el-col :span="4">
                    <el-form-item label="银行卡号:">
                      <span>{{ props.row.bankcard }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="身份证号:">
                      <span>{{ props.row.empcard }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="开户行:">
                      <span>{{ props.row.bankname }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label="学历:">
                      <span>{{ props.row.edubg }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label="学位:">
                      <span>{{ props.row.edudegree }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="empname" label="姓名">
          </el-table-column>
          <el-table-column label="性别" prop="empsex">
          </el-table-column>
          <el-table-column label="工号" prop="empcode">
          </el-table-column>
          <el-table-column label="部门" prop="deptname">
          </el-table-column>
          <el-table-column label="职务" prop="postname">
          </el-table-column>
          <el-table-column label="联系电话" prop="emptel">
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state == 1">在职</el-tag>
              <el-tag v-else type="warning">离职</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="部门负责人" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isflag == 1">是</el-tag>
              <el-tag v-else type="warning">否</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="个人签名" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.signature" alt="" style="width: 60px; height: 60px;">
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleEditDialog(scope.row)" icon="el-icon-edit" size="mini">完善
              </el-button>
              <el-button type="danger" @click="handleDeleteDialog(scope.row)" icon="el-icon-delete" size="mini">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @current-change="handleCurrentChange" :page-sizes="[5]"
                       layout="total, sizes, prev, pager, next, jumper" :total="+totle">
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加人员对话框 -->
    <el-dialog title="新增人事信息" :visible.sync="addPersonInfoDialog" width="60%">
      <el-form ref="addFormDataRef" :rules="addFormDataRules" :model="addFormData">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名" prop="empname">
              <el-input v-model="addFormData.empname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" prop="empsex">
              <el-select v-model="addFormData.empsex" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工号" prop="empcode">
              <el-input v-model="addFormData.empcode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门" prop="deptid">
              <el-select v-model="addFormData.deptid" placeholder="请选择部门">
                <el-option v-for="item in deptDataList" :key="item.deptid" :label="item.deptname" :value="item.deptid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="银行卡号" prop="bankcard">
              <el-input v-model="addFormData.bankcard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开户行" prop="bankname">
              <el-input v-model="addFormData.bankname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号" prop="empcard">
              <el-input v-model="addFormData.empcard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职务" prop="postid">
              <el-select v-model="addFormData.postid" placeholder="请选择职务">
                <el-option v-for="item in postLists" :key="item.postid" :label="item.postname" :value="item.postid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="职称" prop="posttitle">
              <el-input v-model="addFormData.posttitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学历" prop="edubg">
              <el-input v-model="addFormData.edubg"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学位" prop="edudegree">
              <el-input v-model="addFormData.edudegree"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系电话" prop="emptel">
              <el-input v-model="addFormData.emptel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="状态" prop="state">
              <el-select v-model="addFormData.state" placeholder="请选择状态">
                <el-option label="在职" value="1"></el-option>
                <el-option label="离职" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门负责人" prop="isflag">
              <el-select v-model="addFormData.isflag" placeholder="请选择部门负责人">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="个人签名">
          <el-upload class="avatar-uploader" :action="uploadURL" :show-file-list="false"
                     :on-success="handleAvatarSuccess">
            <img v-if="addFormData.signature" :src="addFormData.signature" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPersonInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="hanldAddPersonForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 完善人员信息 -->
    <el-dialog title="完善人员信息" :visible.sync="prePersonInfoDialog" width="60%" :before-close="handleprePersonInfoClose">
      <el-form ref="editFormDataRef" :rules="editFormDataRules" :model="editFormData">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="姓名" prop="empname">
              <el-input v-model="editFormData.empname" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" prop="empsex">
              <el-select v-model="editFormData.empsex" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工号" prop="empcode">
              <el-input v-model="editFormData.empcode" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门" prop="deptid">
              <el-select v-model="editFormData.deptid" placeholder="请选择部门">
                <el-option v-for="item in deptDataList" :key="item.deptid" :label="item.deptname" :value="item.deptid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="银行卡号" prop="bankcard">
              <el-input v-model="editFormData.bankcard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开户行" prop="bankname">
              <el-input v-model="editFormData.bankname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号" prop="empcard">
              <el-input v-model="editFormData.empcard" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职务" prop="postid">
              <el-select v-model="editFormData.postid" placeholder="请选择职务">
                <el-option v-for="item in postLists" :key="item.postid" :label="item.postname" :value="item.postid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="职称" prop="posttitle">
              <el-input v-model="editFormData.posttitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学历" prop="edubg">
              <el-input v-model="editFormData.edubg"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学位" prop="edudegree">
              <el-input v-model="editFormData.edudegree"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系电话" prop="emptel">
              <el-input v-model="editFormData.emptel" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="状态" prop="state">
              <el-select v-model="editFormData.state" placeholder="请选择状态">
                <el-option label="在职" value="1"></el-option>
                <el-option label="离职" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门负责人" prop="isflag">
              <el-select v-model="editFormData.isflag" placeholder="请选择部门负责人">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="个人签名">
          <el-upload class="avatar-uploader" :action="uploadURL" :show-file-list="false"
                     :on-success="handlePreAvatarSuccess">
            <img v-if="editFormData.signature" :src="editFormData.signature" class="avatar">
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
  import GLOBAL from '../../api/global_path'
  export default {
    data() {
      return {
        keyWords: '',
        select: '',
        // 完善人员信息对话框隐藏
        prePersonInfoDialog: false,
        // 职务菜单数据
        postLists: [],
        // 部门数据列表
        deptDataList: [],
        // 图片上传URL地址
        uploadURL: GLOBAL.uploadURL,
        imgURL: GLOBAL.imgURL,
        // 添加人员信息对话框
        addPersonInfoDialog: false,
        // 添加人员信息表单
        addFormData: {
          empname: "",
          empsex: "",
          empcard: "",
          deptid: "",
          empcode: "",
          postid: "",
          posttitle: "",
          bankcard: "",
          bankname: "",
          edubg: "",
          edudegree: "",
          emptel: "",
          state: "",
          isflag: "",
          signature: ""
        },
        webchatid: "",
        // 添加人员信息表单校验表单
        addFormDataRules: {
          empname: {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          },
          empsex: {
            required: true,
            message: "请选择性别",
            trigger: "change"
          },
          empcard: [{
              required: true,
              message: "请输入身份证号",
              trigger: "blur"
            },
            {
              pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
              message: "请输入合法身份证号",
              trigger: "blur"
            }
          ],
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
          emptel: [{
              required: true,
              message: "请输入手机号",
              trigger: "blur"
            },
            // 这个只能验证手机号
            // { pattern:/^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/, message: "请输入合法手机号", trigger: "blur" }
            {
              pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
              message: "请输入合法手机号/电话号",
              trigger: "blur"
            }
          ],
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
        // 完善人员信息表单
        editFormData: {
          empid: '',
          empname: "",
          empsex: "",
          empcard: "",
          deptid: "",
          empcode: "",
          postid: "",
          posttitle: "",
          bankcard: "",
          bankname: "",
          edubg: "",
          edudegree: "",
          emptel: "",
          state: "",
          isflag: "",
          signature: ""
        },
        // 完善人员信息表单校验表单
        editFormDataRules: {
          empname: {
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
        // 职务列表数据
        personLists: [],
        // 总条数
        totle: "",
        // 请求参数配置
        employee: [{
          empid: "",
          empname: "",
          dept: {
            deptid: ""
          },
          jobpost: {
            postid: ""
          },
          state: "1"
        }],
        // 页码数
        pagenum: "0"
      };
    },
    created() {
      // 页面加载获取人事信息
      this.getPersonList();
    },
    methods: {
      // 获取人事列表数据
      async getPersonList() {
        let employee = this.employee;
        let pagenum = this.pagenum;
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

        console.log(this.personLists);
        this.totle = data.pagetotal;
      },
      // 分页事件
      handleCurrentChange(newPage) {
        this.pagenum = newPage - 1;
        this.getPersonList();
      },
      // 新增人员按钮
      addPersonInfoBtn() {
        this.getPostList();
        this.getDeptList()
        this.addPersonInfoDialog = true
      },
      // 完善信息对话框
      handleEditDialog(row) {
        this.empid = row.empid;
        this.editDialog = true;
        this.getPostList();
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
      },
      // 个人签名图片上传
      handleAvatarSuccess(res) {
        this.addFormData.signature = this.imgURL + JSON.parse(res).relationPath
      },
      // 添加人事信息
      hanldAddPersonForm() {
        let empcard = this.addFormData.empcard
        this.$axios.post('/employee/querybycard', {
          empcard
        }).then(res => {
          let infoData = JSON.parse(res.data)
          if (infoData.retCode == 2) {
            return this.$message.error('身份证号已存在！');
          } else if (infoData.retCode == 1) {
            return this.$message.error('身份证号有误！');
          } else {
            let emptel = this.addFormData.emptel
            this.$axios.post('/employee/querybytel', {
              emptel
            }).then(result => {
              console.log(result);
              let telData = JSON.parse(result.data)
              if (telData.retCode == 2) {
                return this.$message.error('手机号已存在！');
              } else if (telData.retCode == 1) {
                return this.$message.error('手机号有误！');
              } else {
                this.getPersonForm()
              }
            })
          }
        })
      },
      // 添加人事信息
      getPersonForm() {
        this.$refs.addFormDataRef.validate(valid => {
          if (!valid) return this.$message.error('请先完善人事信息！')
          let employee = [{
            empid: "",
            empname: this.addFormData.empname,
            empsex: this.addFormData.empsex,
            empcard: this.addFormData.empcard,
            dept: {
              deptid: this.addFormData.deptid
            },
            empcode: this.addFormData.empcode,
            jobpost: {
              postid: this.addFormData.postid
            },
            posttitle: this.addFormData.posttitle,
            bankcard: this.addFormData.bankcard,
            bankname: this.addFormData.bankname,
            edubg: this.addFormData.edubg,
            edudegree: this.addFormData.edudegree,
            emptel: this.addFormData.emptel,
            state: this.addFormData.state,
            isflag: this.addFormData.isflag,
            signature: this.addFormData.signature
          }]
          let webchatid = ''
          this.$axios.post('/employee/webEmpSave', {
            employee,
            webchatid
          }).then(res => {
            const data = JSON.parse(res.data)
            if (data.retCode == 0) {
              this.$message.success('人员信息新增成功！')
              this.getPersonList()
              this.addPersonInfoDialog = false
            } else if (data.retCode == 1) {
              this.$message.error('人员信息新增失败！')
              this.addPersonInfoDialog = false
            } else if (data.retCode == 2) {
              this.$message.error('人员信息身份证号重复！')
            } else if (data.retCode == 3) {
              this.$message.error('本部门已有负责人！')
            }
          })
        });
      },
      // 完善人员信息对话框关闭事件
      handleprePersonInfoClose() {
        this.prePersonInfoDialog = false
      },
      // 完善按钮事件
      handleEditDialog(row) {
        console.log(row)
        this.getPostList()
        this.getDeptList()
        this.editFormData.empid = row.empid
        this.editFormData.empname = row.empname
        this.editFormData.empsex = row.empsex
        this.editFormData.empcard = row.empcard
        this.editFormData.deptid = row.deptid
        this.editFormData.empcode = row.empcode
        this.editFormData.postid = row.postid
        this.editFormData.posttitle = row.posttitle
        this.editFormData.bankcard = row.bankcard
        this.editFormData.bankname = row.bankname
        this.editFormData.edubg = row.edubg
        this.editFormData.edudegree = row.edudegree
        this.editFormData.emptel = row.emptel
        this.editFormData.state = row.state
        this.editFormData.isflag = row.isflag
        this.editFormData.signature = row.signature
        this.prePersonInfoDialog = true
      },
      // 完善个人签名图片上传
      handlePreAvatarSuccess(res) {
        this.editFormData.signature = this.imgURL + JSON.parse(res).relationPath
      },
      // 完善提交事件
      prePersonInfoBtn() {
        this.$refs.editFormDataRef.validate(valid => {
          if (!valid) return this.$message.error('请先完善人事信息！')
          let employee = [{
            empid: this.editFormData.empid,
            empname: this.editFormData.empname,
            empsex: this.editFormData.empsex,
            empcard: this.editFormData.empcard,
            dept: {
              deptid: this.editFormData.deptid
            },
            empcode: this.editFormData.empcode,
            jobpost: {
              postid: this.editFormData.postid
            },
            posttitle: this.editFormData.posttitle,
            bankcard: this.editFormData.bankcard,
            bankname: this.editFormData.bankname,
            edubg: this.editFormData.edubg,
            edudegree: this.editFormData.edudegree,
            emptel: this.editFormData.emptel,
            state: this.editFormData.state,
            isflag: this.editFormData.isflag,
            signature: this.editFormData.signature
          }]
          let webchatid = ''
          this.$axios.post('/employee/webEmpSave', {
            employee,
            webchatid
          }).then(res => {
            const data = JSON.parse(res.data)
            if (data.retCode == 0) {
              this.$message.success('人员信息修改成功！')
              this.getPersonList()
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
      // 删除某个人信息
      handleDeleteDialog(row) {
        console.log(row)
        let empid = row.empid
        this.$confirm(`此操作将永久删除${row.empname}全部信息, 是否继续?`, '温馨提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {
            data
          } = await this.$axios.post('/employee/webRemove', {
            empid
          })
          console.log(data)
          this.getPersonList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 搜索按钮
      searchBtn() {
        console.log(this.keyWords)
        console.log(this.select)
        if (this.select == 1) {
          let empcard = this.keyWords
          this.$axios.post('/employee/queryEmpbycard', {
            empcard
          }).then((res) => {
            const data = JSON.parse(res.data)
            this.personLists = [data]
          })
        }
        if (this.select == 2) {
          let emptel = this.keyWords
          this.$axios.post('/employee/queryEmpByTel', {
            emptel
          }).then((res) => {
            const data = JSON.parse(res.data)
            this.personLists = [data]
          })
        }
      },
      clearSearch() {
        this.getPersonList()
      },
      condSearchBtn() {
        this.$router.push({
          path: "/condSearch"
        })
      }
    }
  };

</script>

<style scoped="scoped">
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
