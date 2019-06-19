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
      <div class="right">
        <div class="loginbox">
          <div class="lgbox">
            <div class="menutext">
              <span :class="{ active: tabindex == 1 }" @click="tabClick(1)">密码登录</span>
              <span :class="{ active: tabindex == 2 }" @click="tabClick(2)">验证码登录</span>
            </div>
            <div class="rowinput phoneinput" style="margin-top:60px">
              <em>
                <img src="static/img/phone.png" alt>
              </em>
              <el-input v-model="login.phone" placeholder="手机号码" maxlength="11"></el-input>
            </div>
            <!-- 密码登录 -->
            <div class="rowinput last phoneinput" v-show="tabindex == 1">
              <em>
                <img src="static/img/suo.png" alt>
              </em>
              <el-input
                v-model="login.password"
                placeholder="密码"
                maxlength="20"
                minlength="6"
                type="password"
                @keyup.enter.native="loginFun"
              ></el-input>
            </div>
            <!-- 验证码登录 -->
            <div class="rowinput last phoneinput" v-show="tabindex == 2">
              <em>
                <img src="static/img/suo.png" alt>
              </em>
              <div>
                <el-input
                  v-model="login.code"
                  placeholder="验证码"
                  maxlength="6"
                  minlength="4"
                  type="text"
                  @keyup.enter.native="loginFun"
                ></el-input>
                <el-button
                  plain
                  style="min-width: 150px"
                  @click="getYzCode"
                  :disabled="count > 0"
                >{{ btntxt }}</el-button>
              </div>
            </div>
            <div class="wxloginbox">
              <span>
                没有账号？
                <router-link :to="{name:'register',query:{pid:invite_code}}">立即注册</router-link>
              </span>
              <span class="text" @click="openforgetpassword">忘记密码?</span>
            </div>
            <div class="rowinput1">
              <el-button
                type="primary"
                style="width:100%"
                @click="loginFun"
                :loading="loading"
              >登录</el-button>
            </div>

            <div class="othenlogin">
              <em>其他登录方式</em>
              <span><img src="static/img/wxlogin.png" @click="wxlogin"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="copyright">
      <p>蝉鸣科技（西安）有限公司</p>
      <p>Copyright © imxyb.com. All rights reserved I 京ICP备14061569号</p>
    </div>

    <!-- 忘记密码   -->
    <wjmm :show="forgetpassword"></wjmm>
  </div>
</template>

<script>
import tokenFun from "@/plugin/token/index.js";
import wjmm from "./wjmm";

export default {
  data() {
    return {
      loading: false,
      tabindex: 1,
      count: 0,
      inteval: "",
      btntxt: "获取验证码",
      login: {
        phone: "",
        password: "",
        code: ""
      },
      forgetpassword: 0,
      invite_code: ""
    };
  },
  components: {
    wjmm
  },
  methods: {
    tabClick(index) {
      this.tabindex = index;
    },
    // 获取验证码
    getYzCode() {
      this.getVcode();
    },

    intevalFun() {
      this.count = 60;
      this.btntxt = `重新发送${this.count}S`;
      clearInterval(this.inteval);
      this.inteval = setInterval(() => {
        this.count--;
        if (this.count <= 0) {
          clearInterval(this.inteval);
          this.btntxt = `获取验证码`;
          return;
        }
        this.btntxt = `重新发送${this.count}S`;
      }, 1000);
    },

    // 打开忘记密码
    openforgetpassword() {
      this.forgetpassword = Date.now();
    },
    //wx登录
    wxlogin() {
      let url = "https://api.imxyb.com" + gethosturl();
      window.location =
        "https://open.weixin.qq.com/connect/qrconnect?appid=wxeb0cd3bad24086a3&redirect_uri=" +
        url +
        "&response_type=code&scope=snsapi_login&state=wxlogin#wechat_redirect";
    },
    // 登录
    loginFun() {
      if (this.login.phone == "") {
        this._alert({
          msg: "请输入手机号码"
        });
        return;
      }
      if (!this.phoneReg.test(this.login.phone)) {
        this._alert({
          msg: "请输入正确的手机号"
        });
        return;
      }

      // 密码登录
      if (this.tabindex == 1) {
        if (this.login.password == "") {
          this._alert({
            msg: "密码不能为空"
          });
          return;
        }
        if (this.login.password.length < 6 || this.login.password.length > 20) {
          this._alert({
            msg: "手机号码或密码输入错误"
          });
          return;
        }
        this.passwordLogin();
      }

      if (this.tabindex == 2) {
        if (!this.login.code || this.login.code.trim() == "") {
          this._alert({
            msg: "请输入验证码"
          });
          return;
        }
        if (this.login.code.length < 4 ) {
          this._alert({
            msg: "验证码错误"
          });
          return;
        }
        this.codeLogin();
      }
    },

    passwordLogin() {
      this.loading = true;
      let dataObj = {
        phone: this.login.phone,
        password: this.login.password
      };
      this._NET.authLogin(dataObj).then(data => {
        this.loading = false;
        if (data.code == "1") {
          this.$router.push({ name: "home" });
        }
      });
    },

    getVcode() {
      if (this.login.phone == "") {
        this._alert({
          msg: "请输入手机号码"
        });
        return;
      }
      if (!this.phoneReg.test(this.login.phone)) {
        this._alert({
          msg: "请输入正确的手机号"
        });
        return;
      }

      this.count = 60;
      this.btntxt = `发送中...`;

      this._NET
        .getVcode({
          phone: this.login.phone
        })
        .then(data => {
          if (data.code == "1") {
            this._alert({
              type: "success",
              msg: "验证码已发送，请注意查收"
            });
            this.intevalFun()
          } else {
            clearInterval(this.inteval);
            this.btntxt = `获取验证码`;
            this.count = 0;
          }
        });
    },

    codeLogin() {
      this.loading = true;
      let dataObj = {
        phone: this.login.phone,
        vcode: this.login.code
      };
      this._NET.codeAuthLogin(dataObj).then(data => {
        this.loading = false;
        if (data.code == "1") {
          this.$router.push({ name: "home" });
        }
      });
    }
  },
  created() {
    this.invite_code = this.$route.query.pid ? this.$route.query.pid : "";
  },

  destroyed() {
    clearInterval(this.inteval);
  }
};
</script>

<style lang="less" scoped>
@import "./com.less";

.wxloginbox {
  margin-bottom: 20px;
  line-height: 30px;
}

.othenlogin {
  display: flex;
  align-items: center;
  height: 27px;
  em{
    font-style: normal;
  }
  img{
    height: 27px;
    margin-left: 8px;
    cursor: pointer;
  }
}

.rowinput1 {
  margin-bottom: 14px;
  button {
    height: 44px;
  }
}

</style>
