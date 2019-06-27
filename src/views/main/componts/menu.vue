<template>
  <div class="menu">
    <div class="userinfobox">
      <span>
        <img src="static/img/loginbj.jpg" alt>
        <input type="file" @change="changeImage">
      </span>
      <div>{{ user.name }}</div>
      <p>{{ user.phone }}</p>
      <div>
        <el-button plain size="mini" @click="LoginOut">退出登录</el-button>
      </div>
    </div>
    <el-menu
      default-active="2"
      class="el-menu-vertical"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
      v-if="user.school_id > 0"
    >
      <div v-for="(item,index) in menu" :key="index">
        <el-menu-item v-if="item.children.length == 0" :index="item.path">
          <i :class="item.icon"></i>
          <span :class="{activestyle: $route.path.indexOf(item.keyword) != -1}">{{ item.label }}</span>
        </el-menu-item>
        <el-submenu :index="item.path" v-if="item.children.length > 0">
          <template slot="title">
            <i class="item.icon"></i>
            <span>{{ item.text }}</span>
          </template>
          <div v-for="(list,ids) in item.children" :key="ids">
            <el-menu-item style="padding-left:50px" :index="list.path">
              <span :class="{activestyle: $route.path.indexOf(list.keyword) != -1}">{{ list.label }}</span>
            </el-menu-item>
          </div>
        </el-submenu>
      </div>
    </el-menu>

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
import menu from "@/common/menu.js";
import token from "../../../plugin/token/index";
export default {
  data() {
    return {
      menu,
      txfileshow: false,
      txloading: false,
      loadingtext:"上传中...",
      face_url:""
    };
  },
  computed: {
    user() {
      return this.$store.state.userInfo;
    }
  },

  methods: {
    LoginOut() {
      token.removeToken("token");
      window.location = "/#/Login";
    },

    changeImage() {
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

      setTimeout(() => {
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
      }, 0);
    },

    uploadfilefunc(fileObj) {
      this._NET
        .fileUpload({
          type: "face",
          file: fileObj
        })
        .then(data => {
          this.txloading = false;
          if (data.code == "1") {
            this.face_url = data.data.url;
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
          face_url: this.face_url
        })
        .then(data => {
          this.txloading = false;
          if (data.code == "ok") {
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
  }
};
</script>


<style lang="less" scoped>
@import "../../../less/style";

.menu {
  width: 200px;
  background-color: @menu_bj;
  overflow: hidden;
  .userinfobox {
    width: 100%;
    height: 230px;
    padding-top: 30px;
    box-sizing: border-box;
    > span {
      display: block;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto;
      margin-bottom: 12px;
      position: relative;
      input {
        width: 100%;
        height: 100%;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        cursor: pointer;
        opacity: 0;
      }
      img {
        display: block;
        width: 100%;
        min-height: 100%;
      }
    }
    > div {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      color: #fff;
      line-height: 1.5;
    }
    > p {
      font-size: 14px;
      text-align: center;
      color: #fff;
      line-height: 1;
      margin: 0;
      margin-bottom: 8px;
    }
  }

  .el-menu-vertical {
    width: 200px;
  }
}
</style>
