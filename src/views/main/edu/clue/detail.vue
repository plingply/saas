<template>
  <div>
    <div class="banner_title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'edu_clue_home' }">线索管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="infobox" v-loading="loading">
      <div class="topbox">
        <div class="left">
          <div class="actor_box">
            <em>
              <img v-if="info.avatar" :src="info.avatar" alt>
            </em>
          </div>
          <div class="clue_upload">
            <span>更新头像</span>
            <input type="file" ref="txfile" @change="txchange">
          </div>
        </div>
        <div class="right">
          <div>
            <span class="note">{{ info.name }}</span>
            <span class="note">{{ info.phone }}</span>
          </div>
          <div style="margin:0">
            <em style="margin-right:8px">意向级别</em>
            <el-select
              v-model="yxjb"
              placeholder="请选择"
              @change="yxjbChange"
              style="width:120px"
            >
              <el-option
                :label="item"
                :value="key"
                v-for="(item,key) in yx_config.intention_config"
                :key="key"
              ></el-option>
            </el-select>
            <em style="margin-right:8px;margin-left:32px">跟进状态</em>
            <el-select
              v-model="gjzt"
              placeholder="请选择"
              @change="gjztChange"
              style="width:120px"
            >
              <el-option
                :label="item"
                :value="key"
                v-for="(item,key) in yx_config.follow_config"
                :key="key"
              ></el-option>
            </el-select>
            <span
              style="margin-right:8px;margin-left:32px"
            >录入人：{{ info.create_user?info.create_user:'--' }}</span>
            <span
              style="margin-right:8px;margin-left:32px"
            >课程顾问：{{ info.course_consultant_name?info.course_consultant_name:'--' }}</span>
          </div>

          <div class="btnbox_right_bottom">
            <span
              class="y_link"
              @click="$router.push({ name: 'edu_clue_home',query:{ callback: true } })"
            >返回上一层</span>
            <el-button type="text" @click="zhuanzhengfun" v-if="info.type != '1'">转为正式学员</el-button>
          </div>
        </div>
      </div>

      <tabs>
        <template #head>
          <router-link
            tag="span"
            :to="{ name:'edu_clue_Follow',params:{ id: $route.params.id } }"
            :class="{active:$route.name == 'edu_clue_Follow' }"
          >跟进记录</router-link>
          <router-link
            tag="span"
            :to="{ name:'edu_clue_info',params:{ id: $route.params.id } }"
            :class="{ active:$route.name == 'edu_clue_info' }"
          >学员详情</router-link>
        </template>
        <template #main>
          <router-view :info="info" @editorcallback="getinfo"></router-view>
        </template>
      </tabs>
    </div>

    <!-- 更换头像 -->
    <el-dialog
      title="更新头像"
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
export default {
  data() {
    return {
      title: "跟进记录",
      info: {},
      yxjb: "",
      gjzt: "",
      loading: false,
      canEditor: false,

      txfileshow: false,
      txloading: false,
      loadingtext: ""
    };
  },

  watch: {
    $route() {
      if (this.$route.name == "edu_clue_Follow") {
        this.title = "跟进记录";
      }
      if (this.$route.name == "edu_clue_info") {
        this.title = "学员详情";
      }
    }
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    }
  },

  methods: {
    /**
     * 上传头像
     */
    txchange(event) {

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
            this.txfileshow = false;
            this.updateface(data.data.url);
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
    updateface(url) {
      this._NET
        .jw_yx_editor({
          campus_id: this.campus_id,
          member_id: this.$route.params.id,
          avatar: url
        })
        .then(data => {
          if (data.code == "1") {
            this._alert({
              type: "success",
              msg: "头像已更新"
            });
            this.$refs.txfile.value = "";
            this.getinfo();
          }
        });
    },

    /**
     * 转正
     */
    zhuanzhengfun() {
      this.$confirm("是否将此学员转为正式学员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {


          this._NET
            .yw_yz_zhuanzheng({
              merchant_id: this.mymange,
              member_id: this.$route.params.id,
              type: "1"
            })
            .then(data => {
              if (data.code == "1") {
                this._alert({
                  type: "success",
                  msg: "转正成功"
                });

                this.$router.push({ name: "edu_clue_home" });
              }
            });
        })
        .catch(() => {});
    },
    /**
     *  意向级别修改
     */

    yxjbChange() {

      this._NET
        .jw_yx_editor({
          id: this.info.id,
          intention_level: this.yxjb
        })
        .then(data => {
          if (data.code == "1") {
            this._alert({
              type: "success",
              msg: "意向级别修改成功"
            });
            this.getinfo();
          }
        });
    },

    /**
     * 跟进状态
     */
    gjztChange() {

      this._NET
        .jw_yx_editor({
          campus_id: this.campus_id,
          id: this.info.id,
          follow_status: this.gjzt
        })
        .then(data => {
          if (data.code == "1") {
            this._alert({
              type: "success",
              msg: "跟进状态已更新"
            });
            this.getinfo();
          }
        });
    },

    /**
     * 详情
     */
    getinfo() {
      this.loading = true;
      this._NET
        .jw_yx_info({
          campus_id: this.campus_id,
          id: this.$route.params.id
        })
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            data.data.birthday =
              data.data.birthday == "0" ? "" : data.data.birthday;
            data.data.birthday_time = data.data.birthday
              ? new Date(data.data.birthday * 1000)
              : "";
            this.info = data.data;
            this.yxjb = data.data.intention_level;
            this.gjzt = data.data.follow_status;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },

  created() {
    this.getinfo();

    if (this.$route.name == "edu_clue_Follow") {
      this.title = "跟进记录";
    }
    if (this.$route.name == "edu_clue_info") {
      this.title = "学员详情";
    }
  }
};
</script>


<style lang="less" scoped>
@import "../../../../less/style.less";

.clue_upload {
  text-align: center;
  padding-top: 10px;
  position: relative;
  > span {
    color: @c;
  }

  input {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }
}

.cutboxstyle {
  position: relative;
  width: 550px;
  height: 400px;
}
</style>
