<template>
  <el-dialog title="找回密码" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false">
    <el-form ref="form" :model="form" label-width="80px">
      <div>
        <el-form-item label="登录账号">
          <el-input v-model="form.phone" maxlength="11" placeholder="手机号码" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="form.vcode" maxlength="4" style="width:100px;margin-right:5px"></el-input>
          <el-button
            type="primary"
            style="width:140px"
            :disabled="disabled"
            plain
            @click="huoquyanzhengma"
          >{{ btntext }}</el-button>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="新密码">
          <el-input
            v-model="form.password"
            type="password"
            maxlength="20"
            placeholder="6-20位新密码"
            style="width:250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="form.password1"
            type="password"
            maxlength="20"
            style="width:250px"
            placeholder="确认新密码"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="postNewPassword" :loading="xgloading">确认修改</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: ["show"],
  watch: {
    show(v) {
      this.dialogVisible = true;
      this.form = {
        phone: "",
        vcode: "",
        password: "",
        passworld1: ""
      };
    }
  },
  data() {
    return {
      dialogVisible: false,
      btntext: "获取验证码",
      disabled: false,
      interval: "",
      xgloading: false,
      form: {
        phone: "",
        vcode: "",
        password: "",
        passworld1: ""
      }
    };
  },
  methods: {
    // 重新新密码
    postNewPassword() {
      if (this.form.phone == "") {
        this._alert({
          type: "warning",
          msg: "请输入手机号"
        });
        return;
      }

      if (!this.phoneReg.test(this.form.phone)) {
        this._alert({
          msg: "手机号格式不正确"
        });
        return;
      }

      if (this.form.vcode == "") {
        this._alert({
          type: "warning",
          msg: "验证码不能为空"
        });
        return;
      }

      if (this.form.vcode.length != 4) {
        this._alert({
          type: "warning",
          msg: "验证码长度超出限制"
        });
        return;
      }

      if (this.form.password == "") {
        this._alert({
          type: "warning",
          msg: "密码不能为空"
        });
        return;
      }

      if (this.form.password.length < 6 || this.form.password.length > 20) {
        this._alert({
          type: "warning",
          msg: "请输入6-20位密码"
        });
        return;
      }

      if (this.form.password != this.form.password1) {
        this._alert({
          type: "warning",
          msg: "两次密码不一致"
        });
        return;
      }

      this.xgloading = true;

      this._NET
        .forgot({
          phone: this.form.phone,
          new_password: this.form.password,
          vcode: this.form.vcode
        })
        .then(data => {
          this.xgloading = false;
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "密码修改成功，请重新登录"
            });
            this.dialogVisible = false;
          }
        })
        .catch(err => {
          this.xgloading = false;
        });
    },
    // 获取验证码
    huoquyanzhengma() {
      if (this.form.phone == "") {
        this._alert({
          type: "warning",
          msg: "请输入手机号"
        });
        return;
      }

      if (!this.phoneReg.test(this.form.phone)) {
        this._alert({
          msg: "手机号格式不正确"
        });
        return;
      }

      this.disabled = true;
      this._NET
        .forgotVcode({
          phone: this.form.phone
        })
        .then(data => {
          if (data.status == "ok") {
            this.form.vcode = data.data;
            this.btntext = "60s后再次发送";
            let count = 60;
            this.interval = setInterval(() => {
              if (count <= 0) {
                clearInterval(this.interval);
                this.disabled = false;
                this.btntext = "获取验证码";
                return;
              }
              count--;
              this.btntext = count + "s后再次发送";
            }, 1000);
          } else {
            this.disabled = false;
          }
        })
        .catch(err => {
          this.disabled = false;
        });
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

