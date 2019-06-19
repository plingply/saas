<template>
  <div class="login">
    <div class="bannder_home">
      <a href="https://www.imxyb.com">
        <img src="static/img/logo_new.png" alt>
      </a>
    </div>
    <div class="login-con">
      <div class="left">
        <img src="static/img/loginbj.jpg" alt>
      </div>
      <div class="right" v-loading="autoloading" element-loading-text="注册成功，自动登录中">
        <div class="zhuce">
          <div class="lgbox">
            <div class="menutext">
              <router-link
                tag="span"
                :to="{name:'register'}"
                class="active"
              >注册</router-link>
            </div>
            <div class="rowinput phoneinput">
              <em>
                <img src="static/img/name.png" alt>
              </em>
              <el-input v-model="register.name" placeholder="姓名" maxlength="10"></el-input>
            </div>
            <div class="rowinput phoneinput">
              <em>
                <img src="static/img/phone.png" alt>
              </em>
              <el-input v-model="register.phone" placeholder="手机号码" maxlength="11"></el-input>
            </div>
            <div class="rowinputx phoneinput">
              <em>
                <img src="static/img/yzm.png" alt>
              </em>
              <el-input v-model="register.vcode" placeholder="验证码"  maxlength="4"></el-input>
              <el-button plain style="width: 128px;margin-left: 12px" @click="getVcode" :disabled="disabled">{{ btntext }}</el-button>
            </div>
            <div class="rowinput phoneinput">
              <em>
                <img src="static/img/suo.png" alt>
              </em>
              <el-input
                v-model="register.password"
                placeholder="设置账号密码"
                type="password"
                maxlength="20"
                minlength="6"
              ></el-input>
            </div>
            <div class="rowinput phoneinput">
              <em>
                <img src="static/img/suo.png" alt>
              </em>
              <el-input
                v-model="register.password1"
                placeholder="确认账号密码"
                type="password"
                maxlength="20"
                minlength="6"
              ></el-input>
            </div>

            <div class="wxloginbox">
              <span>
                已有账号？
                <router-link :to="{name:'login'}">立即登录</router-link>
              </span>
            </div>

            <div class="rowinput2">
              <el-button
                type="primary"
                style="width:100%"
                @click="zhuceFun"
                :loading="loading"
              >{{ zctext }}</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="copyright">
      <p>蝉鸣科技（西安）有限公司</p>
      <p>Copyright © imxyb.com. All rights reserved I 京ICP备14061569号</p>
    </div>
  </div>
</template>

<script>
// import Cookies from 'js-cookie';
import tokenFun from "@/plugin/token/index.js";
export default {
  data() {
    return {
      loading: false,
      disabled: false,
      btntext: "获取验证码",
      interval: "",
      register: {
        phone: "",
        name: "",
        password: "",
        password1: "",
        vcode: ""
      },

      autoloading: false,

      checked: true,
      zctext: "下一步"
    };
  },
  watch: {
    checked(v) {
      this.zctext = v ? "下一步" : "立即注册";
    }
  },
  methods: {
    // 获取验证码
    getVcode() {
      if (this.disabled) {
        return;
      }
      if (this.register.phone == "") {
        this._alert({
          msg: "请输入手机号"
        });
        return;
      }
      if (!this.phoneReg.test(this.register.phone)) {
        this._alert({
          msg: "手机号格式不正确"
        });
        return;
      }
      this.disabled = true;
      this._NET
        .getVcode(
          {
            phone: this.register.phone
          },
          true
        )
        .then(data => {
          if (data.code == "1") {

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
            this._alert({
              type: "warning",
              msg: data.msg
            });
          }
        })
        .catch(err => {
          this.disabled = false;
        });
    },
    // 注册
    zhuceFun() {
      if (this.register.name.trim() == "") {
        this._alert({
          msg: "请输入姓名"
        });
        return;
      }
      if (this.register.name.trim().length > 10) {
        this._alert({
          msg: "姓名长度超过10位"
        });
        return;
      }

      if (this.register.phone == "") {
        this._alert({
          msg: "请输入手机号码"
        });
        return;
      }
      if (!this.phoneReg.test(this.register.phone)) {
        this._alert({
          msg: "请输入正确的手机号"
        });
        return;
      }

      if (this.register.vcode.length == "") {
        this._alert({
          msg: "验证码不能为空"
        });
        return;
      }

      if (this.register.vcode.length != 4) {
        this._alert({
          msg: "验证码不正确"
        });
        return;
      }

      if (this.register.password.length == "") {
        this._alert({
          msg: "请输入密码"
        });
        return;
      }

      if (
        this.register.password.length < 6 ||
        this.register.password.length > 20
      ) {
        this._alert({
          msg: "手机号码或密码输入错误"
        });
        return;
      }

      if (this.register.password != this.register.password1) {
        this._alert({
          msg: "两次密码输入不一致"
        });
        return;
      }

      this.loading = true;
      this._NET.register(this.register).then(data => {
        this.loading = false;
        if (data.code == "1") {
          if (this.checked) {
            this.autologinFun();
          } else {
            this.activeName = "a";
          }

          this._alert({
            type: "success",
            msg: data.msg
          });
        }
      });
    },
    // 登录
    autologinFun() {
      this.autoloading = true;
      this._NET
        .authLogin({
          phone: this.register.phone,
          password: this.register.password
        })
        .then(data => {
          if (data.code == "1") {
            this.$router.push({ name: "home" });
            this.autoloading = false;
          } else {
            this.loading = false;
          }
        });
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style lang="less" scoped>
@import "./com.less";

.rowinput2 {
  padding-top: 24px;
  button {
    height: 44px;
  }
}
</style>
