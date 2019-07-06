<template>
  <div>

    <div class="banner_title">
      <span>用户资料</span>
    </div>

    <div class="tablebox">
      <div class="avtorbox">
        <span>
          <em><img v-if="!userInfo.face_url" src="static/img/mrtx.png" alt="">
            <img v-if="userInfo.face_url" :src="userInfo.face_url" alt=""></em>
        </span>
        <s>
          <input type="file" name="file" ref="txfile" @change="imgchange">
          <el-button size="small" type="text" >更换头像</el-button>
        </s>
      </div>
      <div class="userinfobox">
        <el-form ref="form" :model="form" label-width="110px" label-position="left">
          <el-form-item label="登录账号">
            <span>{{ form.phone | format }}</span>
            <el-button v-show="editor" type="primary" style="float:right" plain @click="replacePhoneOpen">更改登录手机号</el-button>
          </el-form-item>
          <el-form-item label="姓名">
            <p v-show="!editor">{{ form.name }}</p>
            <el-input v-show="editor" size="medium" placeholder="请输入姓名" v-model="form.name" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <p v-show="!editor">{{ userInfo.sex }}</p>
            <el-radio-group v-model="form.sex" v-show="editor">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
              <el-radio label="保密">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="微信授权登录">
            <!-- <el-tag type="success" size="small">已绑定</el-tag> -->
            <p v-if="!userInfo.unionid || userInfo.unionid == ''">
              <el-button type="danger" plain @click="bingwxFun">未绑定，立即绑定</el-button>
            </p>
            <p v-if="userInfo.unionid && userInfo.unionid != ''">
              <el-button type="success" plain @click="unbingwxFun" :loading="unbingloading">已绑定，立即解绑</el-button>
            </p>
          </el-form-item>
          <div class="btnbox_bottom">
            <el-button type="primary" size="medium" style="width:100%;padding:12px 20px" @click="editor=true" v-show="!editor">更新资料</el-button>
          </div>
          <div class="btnbox_bottom">
            <el-button type="primary" size="medium" style="width:100%;padding:12px 20px" @click="saveMyinfo" v-show="editor" :loading="saveLoading">保存</el-button>
          </div>
          <div class="btnbox_bottom">
            <el-button plain size="medium" style="width:100%;padding:12px 20px" @click="editorClose" v-show="editor">取消</el-button>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 更换手机号 -->
    <el-dialog title="更改登录手机号" :visible.sync="replacePhoneshow" width="400px">
      <div class="accountbox">
        <el-form ref="form" :model="account" label-width="120px" label-position="right">
          <el-form-item label="原始密码">
            <el-input v-model="account.password" size="medium" type="password" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="新手机号(账号)">
            <el-input v-model="account.phone" placeholder="手机号码" size="medium" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="account.vcode" size="medium" maxlength="4" style="width:85px"></el-input>
            <el-button type="primary" size="medium" style="width:130px" :disabled="disabled" plain @click="huoquyanzhengma">{{ btntext }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="replacePhoneshow = false">取 消</el-button>
        <el-button type="primary" @click="updatePhone" :loading="accountLoading">确认更换</el-button>
      </span>
    </el-dialog>

    <!-- 绑定微信 -->
    <el-dialog title="绑定微信" :visible.sync="bingwxshow" width="400px">
      <div class="accountbox" id="login_container">
      </div>
    </el-dialog>

    <!-- 更换头像 -->
    <el-dialog
      title="更换头像"
      :visible.sync="txfileshow"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div
        class="cutboxstyle"
        id="fileElement"
        v-loading="txloading"
        :element-loading-text="loadingtext"
      ></div>
    </el-dialog>
  </div>
</template>

<script>
import gethosturl from "@/util/gethost"
export default {
  data() {
    return {
      editor: false,
      replacePhoneshow: false,
      step: 1,
      btntext: "获取验证码",
      disabled: false,
      accountLoading: false,
      saveLoading: false,
      interval: "",
      // 绑定wx 相关
      bingwxshow: false,
      wxurl: null,
      unbingloading: false,

      account: {
        password: "",
        phone: "",
        vcode: ""
      },
      form: {
        face_url: "",
        name: "",
        phone: "",
        sex: ""
      },

      //上传头像
      txfileshow: false,
      txloading: false,
      loadingtext: ''
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  watch: {
    userInfo() {
      this.form.name = this.userInfo.name;
      this.form.phone = this.userInfo.phone;
      this.form.sex = this.userInfo.sex;
      this.form.face_url = this.userInfo.face_url;
    }
  },
  methods: {
    // 微信解绑
    unbingwxFun() {
      this.$confirm("解除微信绑定后，将不能使用微信登录，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.unbingloading = true;
          this._NET
            .unBinding()
            .then(data => {
              this.unbingloading = false;
              if (data.status == "ok") {
                this._alert({
                  type: "success",
                  msg: "解绑成功"
                });
                this.$store.dispatch("getUserInfo");
              }
            })
            .catch(err => {
              this.unbingloading = false;
            });
        })
        .catch(() => {});
    },
    // 绑定wx
    bingwxFun() {
      let url = "https://api.imxyb.com" + gethosturl();
      window.location =
        "https://open.weixin.qq.com/connect/qrconnect?appid=wxeb0cd3bad24086a3&redirect_uri=" +
        url +
        "&response_type=code&scope=snsapi_login&state=wxbinding#wechat_redirect";
    },
    // 图片更改
    imgchange(event) {

      let fileType = event.target.files[0].type;
      if (fileType != "image/png" && fileType != "image/jpeg") {
        this._alert({
          type: "warning",
          msg: "只能上传png、jpg格式的图片"
        });
        return;
      }

      let self = this;
      this.txfileshow = true;

      let compress = false;
      if (event.target.files[0].size > this.imgsize * 1024 * 1024) {
        compress = true;
      }

      console.log(document.getElementById("fileElement"))

      setTimeout(() => {
        console.log(document.getElementById("fileElement"))
        this.clip(event, {
          aspectRatio: 1,
          element: document.getElementById("fileElement"),
          upload: self.uploadfilefunc,
          loadingfunc: self.loadingfunc,
          cancelfun: self.cancelfun,
          loadImgfun: self.loadImgfun,
          loadImgComplete: self.loadImgComplete,
          compress: compress,
          maxwidth: 200
        });
      }, 1000);
    },

    uploadfilefunc(fileObj) {
      this._NET
        .fileUpload({
          type: "face",
          file: fileObj
        })
        .then(data => {
          this.txloading = false;
          if (data.status == "ok") {
            this.form.face_url = data.data.url;
            this.txfileshow = false;
            this.updateface();
          }
        })
        .catch(err => {
          this.txloading = false;
        });
    },
    loadingfunc() {
      this.txloading = true;
    },
    cancelfun() {
      this.txfileshow = false;
    },
    loadImgfun() {
      this.loadingtext = "图片加载中...";
      this.txloading = true;
    },
    loadImgComplete() {
      this.loadingtext = "图片上传中...";
      this.txloading = false;
    },

    // 头像上传成功
    updateface() {
      this._NET
        .updateface({
          face_url: this.form.face_url
        })
        .then(data => {
          this.txloading = false;
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "头像已更新"
            });
            this.$refs.txfile.value = "";
            this.$store.dispatch("getUserInfo");
          }
        })
        .catch(err => {
          this.txloading = false;
        });
    },
    // 更新个人资料
    saveMyinfo() {
      if (this.form.name == "") {
        this._alert({
          type: "warning",
          msg: "请输入姓名"
        });
        return;
      }
      this.saveLoading = true;
      this._NET
        .saveMyinfo({
          name: this.form.name,
          sex: this.form.sex
        })
        .then(data => {
          this.saveLoading = false;
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "个人资料已更新"
            });
            this.$store.dispatch("getUserInfo");
            this.editor = false;
          }
        })
        .catch(err => {
          this.saveLoading = false;
        });
    },
    // 更新手机号
    updatePhone() {
      if (this.account.password == "") {
        this._alert({
          type: "warning",
          msg: "请输入原始密码"
        });
        return;
      }

      if (
        this.account.password.length < 6 ||
        this.account.password.length > 20
      ) {
        this._alert({
          type: "warning",
          msg: "密码不正确"
        });
        return;
      }

      if (this.account.phone == "") {
        this._alert({
          type: "warning",
          msg: "请输入手机号"
        });
        return;
      }

      if (!this.phoneReg.test(this.account.phone)) {
        this._alert({
          msg: "手机号格式不正确"
        });
        return;
      }

      if (this.account.vcode == "") {
        this._alert({
          type: "warning",
          msg: "验证码不能为空"
        });
        return;
      }

      if (this.account.vcode.length != 4) {
        this._alert({
          type: "warning",
          msg: "验证码不正确"
        });
        return;
      }
      this.accountLoading = true;
      this._NET
        .updatePhone(this.account)
        .then(data => {
          this.accountLoading = false;
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "手机号修改成功"
            });
            this.$store.dispatch("getUserInfo");
            this.replacePhoneshow = false;
            this.editor = false;
          }
        })
        .catch(err => {
          this.accountLoading = false;
        });
    },
    // 取消编辑
    editorClose() {
      this.editor = false;
      this.form.name = this.userInfo.name;
      this.form.phone = this.userInfo.phone;
      this.form.sex = this.userInfo.sex;
      this.form.face_url = this.userInfo.face_url;
    },
    // 获取验证码
    huoquyanzhengma() {
      if (this.account.phone == "") {
        this._alert({
          type: "warning",
          msg: "请输入手机号"
        });
        return;
      }

      if (!this.phoneReg.test(this.account.phone)) {
        this._alert({
          msg: "手机号格式不正确"
        });
        return;
      }

      this.disabled = true;
      this._NET
        .getPhoneVcode({
          phone: this.account.phone
        })
        .then(data => {
          if (data.status == "ok") {
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
    },

    // 打开更换手机号
    replacePhoneOpen() {
      this.account = {
        password: "",
        phone: "",
        vcode: ""
      };
      this.replacePhoneshow = true;
    }
  },
  created() {
    this.form.name = this.userInfo.name;
    this.form.phone = this.userInfo.phone;
    this.form.sex = this.userInfo.sex;
    this.form.face_url = this.userInfo.face_url;
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>



<style lang="less" scoped>
@import "../../../less/style.less.less";

.tablebox {
  background: #fff;
  margin-top: 20px;
  padding: 20px;
  padding-top: 80px;
  padding-bottom: 80px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .avtorbox {
    width: 126px;
    margin-bottom: 20px;
    > span {
      display: block;
      width: 106px;
      height: 106px;
      overflow: hidden;
      border-radius: 50%;
      position: relative;
      background-color: #f7f7f7;
      padding: 10px;
      margin-bottom: 20px;
      em {
        display: block;
        width: 106px;
        height: 106px;
        border-radius: 50%;
        overflow: hidden;
        img {
          display: block;
          width: 106px;
          min-height: 100%;
        }
      }
    }
    > s {
      display: block;
      width: 100%;
      text-decoration: none;
      position: relative;
      margin-top: 15px;
      cursor: pointer;
      &:hover {
        button {
          color: fade(@c, 80%);
        }
      }
      button {
        display: block;
        margin: 0 auto;
      }
      input {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 200px;
        height: 32px;
        opacity: 0;
        cursor: pointer;
        z-index: 10;
      }
    }
  }
  .userinfobox {
    width: 345px;
  }
}

.btnbox_bottom {
  margin-bottom: 14px;
}

.accountbox {
  width: 340px;
}

.tishi {
  font-size: 12px;
  color: @error;
}

.cutboxstyle {
  position: relative;
  width: 550px;
  height: 400px;
}
</style>

