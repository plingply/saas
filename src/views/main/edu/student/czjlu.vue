<template>
  <div style="width: 630px;">
    <div class="textarea">
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6 }"
        maxlength="200"
        placeholder="请输入学员成长记录"
        v-model="gValue"
      ></el-input>
      <span>{{ gValue.length }}/200</span>
    </div>
    <div class="stu_imgbox">
      <ul v-loading="uploading">
        <li
          v-for="(item,index) in imglist"
          :key="index"
          :style="{ backgroundImage:'url('+ item +')' }"
        >
          <span @click="delimg(index)">-</span>
        </li>
        <li class="uploadstyle" v-show="imglist.length < 9">
          <img src="static/img/xmp/addicon.png" alt>
          <input type="file" ref="xfiles" @change="filechange" multiple="multiple">
        </li>
      </ul>
      <p class="tishi">选择成长照片，最多9张。</p>
    </div>
    <div class="btnbox">
      <el-button type="primary" @click="addfunc">添加成长记录</el-button>
    </div>

    <ul class="lylist" v-loading="loading">
      <li v-for="(item,index) in list" :key="index">
        <div class="left">
          <span>
            <span>
              <img v-show="item.avatar" :src="item.avatar" alt>
            </span>
          </span>
        </div>
        <div class="right">
          <div class="gjtitle">
            <em>{{ item.create_user }}</em>
            <time>{{ item.updated_at | yyyy_mm_dd_H_M }}</time>
            <el-button style="float:right" type="text" @click="delfun(item)">删除</el-button>
          </div>
          <div class="gj_content">{{ item.content }}</div>
          <div class="gj_imglist" v-if="item.picturelist.length > 0">
            <span
              @click="showimg(list)"
              v-for="(list,index) in item.picturelist"
              :key="index"
              :style="{ backgroundImage:'url('+ list +')' }"
            ></span>
          </div>
        </div>
      </li>
    </ul>

    <!-- 显示大图 -->
    <album :list="imgArrays" :change="showAlbum"></album>
  </div>
</template>

<script>
import album from "../../../componts/Album";
export default {
  data() {
    return {
      loading: false,
      uploading: false,
      gValue: "",
      imglist: [],
      list: [],

      imgArrays: [],
      showAlbum: 0
    };
  },

  components: {
    album
  },

  methods: {
    showimg(url) {
      this.showAlbum = +new Date();
      this.imgArrays = [url];
      this.list.forEach(item => {
        if (url != item.picture && item.picture) {
          this.imgArrays.push(item.picture);
        }
      });
    },

    delimg(index) {
      this.imglist.splice(index, 1);
    },

    delfun(item) {

      this.$confirm("是否确认删除此记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._NET
            .jw_student_bringdelete({
              campus_id: this.campus_id,
              member_id: item.member_id,
              id: item.id
            })
            .then(data => {
              if (data.status == "ok") {
                this._alert({
                  type: "success",
                  msg: "删除成功"
                });
                this.getlist();
              }
            });
        })
        .catch(() => {});
    },

    addfunc() {

      if (this.gValue == "") {
        this._alert({
          type: "warning",
          msg: "请输入内容"
        });
        return;
      }

      if (this.imglist.length > 9) {
        this._alert({
          type: "warning",
          msg: "图片最大9张"
        });
        return;
      }

      this._NET
        .jw_student_bringadd({
          member_id: this.$route.params.id,
          campus_id: this.campus_id,
          content: this.gValue,
          picture: this.imglist.join(",")
        })
        .then(data => {
          if (data.status == "ok") {
            this.gValue = "";
            this.imglist = [];
            this._alert({
              type: "success",
              msg: "添加成功"
            });
            this.getlist();
          }
        });
    },

    getlist() {
      this.loading = true;
      this._NET
        .jw_student_bringlist({
          member_id: this.$route.params.id,
          campus_id: this.campus_id,
        })
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            data.data.item.map(item => {
              item.picturelist = [];
              if (item.picture != "") {
                item.picturelist = item.picture.split(",");
              }
            });
            this.list = data.data.item;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    filechange(event) {

      let files = event.target.files;
      let len = this.imglist.length;

      if (files.length > 9) {
        this._alert({
          type: "warning",
          msg: "一次最多只能上传9张图片"
        });
        this.$refs.xfiles.value = "";
        return;
      }

      if (len + files.length > 9) {
        this._alert({
          type: "warning",
          msg: "最多只能上传9张图片，剩余" + (9 - len) + "张"
        });
        this.$refs.xfiles.value = "";
        return;
      }

      for (let i = 0; i < files.length; i++) {
        let fileType = files[i].type;
        if (fileType != "image/png" && fileType != "image/jpeg") {
          this._alert({
            type: "warning",
            msg: "只能上传png、jpg格式的图片"
          });
          this.$refs.xfiles.value = "";
          return;
        }
      }

      for (let k = 0; k < files.length; k++) {
        this.uploadfun(files[k])
      }

    },

    uploadfun(file) {

      this.uploading = true;
      this._NET
        .fileUpload({
          type: "czjlu",
          file: file
        })
        .then(data => {
          this.uploading = false;
          if (data.status == "ok") {
            this.imglist.push(data.data.url);
          }
        })
        .catch(err => {
          this.uploading = false;
        });
    }
  },

  created() {
    this.getlist();
  }
};
</script>

<style lang="less" scoped>
@import "../../../../less/style.less";
.textarea {
  position: relative;
  > span {
    position: absolute;
    right: 12px;
    bottom: 8px;
    color: @c3;
  }
}

.btnbox {
  text-align: right;
}

.stu_imgbox {
  padding-top: 20px;
  margin-bottom: 20px;
  .tishi {
    font-size: 14px;
    color: @c3;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 100px;
      height: 100px;
      background-position: center center;
      background-size: cover;
      border-radius: 4px;
      margin-right: 20px;
      margin-bottom: 20px;
      position: relative;
      > span {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: @c;
        line-height: 20px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        position: absolute;
        top: -8px;
        right: -8px;
        cursor: pointer;
      }
      &.uploadstyle {
        border: 1px solid @bd1;
        text-align: center;
        position: relative;
        background: none;
        img {
          width: 30px;
          height: 30px;
          position: relative;
          padding-top: 35px;
        }

        input {
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          cursor: pointer;
          opacity: 0;
        }
      }
    }
  }
}
</style>
