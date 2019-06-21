<template>
  <el-dialog :title="title" :visible.sync="show" width="650px">
    <div class="addbox">
      <el-form ref="form" :model="{}" :rules="rules" label-width="150px" label-position="right">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="name" size="medium" placeholder="请输入姓名" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="phone"
            :disabled="editor"
            @input="phoneInput"
            size="medium"
            placeholder="手机号码"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="sex" label="男">男</el-radio>
          <el-radio v-model="sex" label="女">女</el-radio>
          <el-radio v-model="sex" label="保密">保密</el-radio>
        </el-form-item>

        <!-- 更多 -->
        <div v-show="more">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="entry_at"
              type="date"
              :picker-options="pickerOption"
              placeholder="选择日期"
              size="medium"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="证件">
            <div class="formRowFlex">
              <el-select
                v-model="certificate_type"
                size="medium"
                placeholder="请选择"
                style="width:90px;min-width:90px;margin-right:12px"
              >
                <el-option label="身份证" value="1"></el-option>
                <el-option label="护照" value="2"></el-option>
              </el-select>
              <el-input v-model="certificate_sn" maxlength="20" size="medium" placeholder="请输入证件号"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="紧急联系人">
            <div class="formRowFlex">
              <el-input
                style="margin-right:12px"
                v-model="contact_person_name"
                maxlength="10"
                size="medium"
                placeholder="联系人姓名"
              ></el-input>
              <el-input
                v-model="contact_person_phone"
                maxlength="11"
                size="medium"
                placeholder="联系人手机号"
                @input="phone1Input"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="微信">
            <el-input v-model="wechat_num" maxlength="40" size="medium" placeholder="请输入微信号"></el-input>
          </el-form-item>
        </div>

        <div class="morebtn" v-show="!editor">
          <button type="button" v-show="!more" @click="more = true">+更多</button>
          <button type="button" v-show="more" @click="more = false">收起</button>
        </div>

        <div class="bctitle"></div>

        <el-form-item label="权限" prop="role">
          <el-select v-model="role_id" size="medium" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.role_name"
              :value="item.id"
            ></el-option>
          </el-select>
          <p class="tishi">无系统使用需求的员工，可将权限设置为：无权限。</p>
        </el-form-item>

        <el-form-item label="是否授课/学管老师" prop="auth">
          <el-radio :disabled="powerid === '0'" v-model="role_type" label="1">是</el-radio>
          <el-radio :disabled="powerid === '0'" v-model="role_type" label="0">否</el-radio>
          <p class="tishi">设置授课/学管老师，便于设置班级和排课时选择老师。</p>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" v-if="!editor" @click="saveAndCreate('add')" :loading="loading">添 加</el-button>
      <el-button
        type="primary"
        v-if="editor"
        @click="saveAndCreate('editor')"
        :loading="loading"
      >修 改</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    showData: {
      type: Number,
      required: true
    },
    editor: false,
    info: {}
  },
  data() {
    return {
      show: false,
      title: "新增员工",
      loading: false,
      more: false,

      /**
       *  name                    备注姓名
       *  phone                   用户手机号
       *  sex                     性别 男 女 保密
       *  role_id                 权限组id
       *  entry_at                入职时间
       *  certificate_type        证件类型 1=>身份证,2=>护照
       *  certificate_sn          证件号码
       *  contact_person_name     联系人名字
       *  contact_person_phone    联系人电话
       *  wechat_num              微信号
       *  role_type               角色类型(1:老师)
       */
      name: "",
      phone: "",
      sex: "保密",
      role_id: "",
      entry_at: "",
      certificate_type: "1",
      certificate_sn: "",
      contact_person_name: "",
      contact_person_phone: "",
      wechat_num: "",
      role_type: "0",

      powerid: '',

      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        phone: [{ required: true, message: " ", trigger: "blur" }],
        sex: [{ required: true, message: " ", trigger: "blur" }],
        role: [{ required: true, message: " ", trigger: "blur" }],
        auth: [{ required: true, message: " ", trigger: "blur" }]
      },

      pickerOption: {
        disabledDate(v) {
          if (v.getTime() > new Date().getTime()) {
            return true;
          } else {
            return false;
          }
        }
      }
    };
  },
  computed: {
    roleList() {
      return this.$store.state.roleList;
    }
  },
  watch: {
    showData() {
      this.show = true;
      this.more = false;
      if (this.editor) {
        this.title = "编辑员工";
        this.name = this.info.user_remark;
        this.phone = this.info.phone;
        this.sex = this.info.sex;
        this.role_id = this.info.role_id;
        this.entry_at =
          this.info.entry_at > 0 ? new Date(this.info.entry_at * 1000) : "";
        this.certificate_type = this.info.certificate_type;
        this.certificate_sn = this.info.certificate_sn;
        this.contact_person_name = this.info.contact_person_name;
        this.contact_person_phone = this.info.contact_person_phone;
        this.wechat_num = this.info.wechat_num;
        this.role_type = this.info.role_type;
        this.more = true;
      } else {
        this.title = "新增员工";
        this.name = "";
        this.phone = "";
        this.sex = "保密";
        this.role_id = "";
        this.entry_at = "";
        this.certificate_type = "1";
        this.certificate_sn = "";
        this.contact_person_name = "";
        this.contact_person_phone = "";
        this.wechat_num = "";
        this.role_type = "0";
      }
    },

    role_id(v) {
      this.roleList.map(item => {
        if (v == item.id) {
          this.powerid = item.powerid;
        }
      });

      this.role_type = this.powerid === "0" ? "0" : this.role_type;
    }
  },
  methods: {
    phoneInput(v) {
      this.phone = this.$utils.formatphone(v);
    },

    phone1Input(v) {
      this.contact_person_phone = this.$utils.formatphone(v);
    },

    saveAndCreate(type) {
      if (this.name == "" || this.name.trim() == "") {
        this._alert({
          type: "warning",
          msg: "请输入姓名"
        });
        return;
      }

      if (this.phone == "") {
        this._alert({
          type: "warning",
          msg: "请输入手机号"
        });
        return;
      }

      if (!this.phoneReg.test(this.phone)) {
        this._alert({
          type: "warning",
          msg: "手机号码格式不正确"
        });
        return;
      }

      if (
        !this.sex ||
        (this.sex != "男" && this.sex != "女" && this.sex != "保密")
      ) {
        this._alert({
          type: "warning",
          msg: "请选择性别"
        });
        return;
      }

      if (
        (this.contact_person_name != "" && this.contact_person_phone == "") ||
        (this.contact_person_name == "" && this.contact_person_phone != "")
      ) {
        this._alert({
          type: "warning",
          msg: "联系人姓名和手机号必须同时填写"
        });
        return;
      }

      if (
        this.contact_person_name != "" &&
        !this.phoneReg.test(this.contact_person_phone)
      ) {
        this._alert({
          type: "warning",
          msg: "联系人手机号码格式不正确"
        });
        return;
      }

      if (this.role_id == "") {
        this._alert({
          type: "warning",
          msg: "请选择权限"
        });
        return;
      }

      if (type == "add") this.saveFunc();
      if (type == "editor") this.editorFunc(0);
    },

    saveFunc() {
      let entry_at = this.entry_at
        ? parseInt(this.entry_at.getTime() / 1000)
        : "";

      let data = {
        name: this.name,
        phone: this.phone,
        sex: this.sex,
        role_id: this.role_id,
        merchant_id: this.mymange,
        entry_at,
        certificate_type: this.certificate_type,
        certificate_sn: this.certificate_sn,
        contact_person_name: this.contact_person_name,
        contact_person_phone: this.contact_person_phone,
        wechat_num: this.wechat_num,
        role_type: this.role_type,
      };

      this.loading = true;
      this._NET
        .addRoleUser(data)
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this.show = false;
            this._alert({
              type: "success",
              msg: "添加成功"
            });
            this.$emit("success");
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    editorFunc(confirm) {
      let entry_at = this.entry_at
        ? parseInt(this.entry_at.getTime() / 1000)
        : "";

      let data = {
        user_id: this.info.user_id,
        name: this.name,
        phone: this.phone,
        sex: this.sex,
        role_id: this.role_id,
        merchant_id: this.mymange,
        entry_at,
        certificate_type: this.certificate_type,
        certificate_sn: this.certificate_sn,
        contact_person_name: this.contact_person_name,
        contact_person_phone: this.contact_person_phone,
        wechat_num: this.wechat_num,
        role_type: this.role_type,
        confirm
      };

      this.loading = true;
      this._NET
        .editorRoleUser(data, true)
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this.show = false;
            this._alert({
              type: "success",
              msg: "修改成功"
            });
            this.$emit("success");
          } else {
            if (data.code == 1000) {
              this.$confirm(data.msg, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  this.editorFunc(1);
                })
                .catch(() => {});
            } else {
              this._alert({
                type: "warning",
                msg: data.msg
              });
            }
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../../less/style.less";
.addbox {
  width: 500px;
  margin: 0 auto;
}

.bctitle {
  width: 100%;
  height: 0;
  margin-bottom: 24px;
  border-bottom: 1px solid @bd1;
}

.formRowFlex {
  display: flex;
}

.morebtn {
  font-size: 14px;
  text-align: right;
  margin-bottom: 16px;
  button {
    color: @info;
    border: none;
    outline: none;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
