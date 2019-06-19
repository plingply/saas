<template>
  <div class="box_info">
    <div class="topbox_1">
      <div class="left">
        <div class="actor_box">
          <div class="actor">
            <em>
              <img v-if="info.avatar" :src="info.avatar" alt>
            </em>
          </div>
          <div class="clue_upload">
            <span>更新头像</span>
            <input type="file" ref="txfile" @change="txchange">
          </div>
        </div>
        <div class="text">
          <span>{{ info.name }}</span>
          <span>{{ info.phone }}</span>
          <img v-if="info.sex == '女'" src="static/img/nv.png" alt>
          <img v-if="info.sex == '男'" src="static/img/nan.png" alt>
          <span v-if="info.sex == '其他'">其他</span>
        </div>
      </div>
      <div class="right">
        <span class="y_link" @click="$router.push({ name: 'edu_student_home',query:{ callback: true } })">返回上一层</span>
        <div>
          <el-button plain style="width:88px" @click="delstudent">删除</el-button>
          <el-button
            type="primary"
            @click="openEditor"
            style="width:88px"
          >编辑</el-button>
        </div>
      </div>
    </div>
    <div class="yx_title">
      <span>学员详情</span>
    </div>
    <el-form ref="form" :model="{}" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="联系电话">{{ info.phone }} | {{ info.phone_belong | phone_belong }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="备用电话">
            <p
              v-show="info.phone_by"
            >{{ info.phone_by }} | {{ info.standby_phone_belong | phone_belong }}</p>
            <p v-show="!info.phone_by">--</p>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="年龄">{{ info.age?info.age:'--' }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="生日">{{ info.birthday | yyyy_mm_dd }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学校">{{ info.school?info.school:'--' }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="年级班级">{{ info.class?info.class:'--' }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="意向来源">{{ info.source_name?info.source_name:'--' }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学员状态">
            <div v-if="yx_config.member_status">{{ yx_config.member_status[info.status] }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="QQ/微信">{{ info.wechat?info.wechat:'--' }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学号">{{ info.member_sn?info.member_sn:'--' }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="课程顾问"
          >{{ info.course_consultant_name?info.course_consultant_name:'--' }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="爱好">{{ info.hobby?info.hobby:'--' }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="入学时间">{{ info.entry_time | yyyy_mm_dd }}</el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="家庭住址">{{ info.address?info.address:'--' }}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">{{ info.remark?info.remark:'--' }}</el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 编辑学员 -->
    <editorstudent :show="editorstdtime" @callback="callback" :editor="true" :info="info"></editorstudent>

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
import editorstudent from "../componts/addstudent.vue";

export default {
  props: ["info"],

  data() {
    return {
      txfileshow: false,
      loadingtext: "",
      txloading: false,
      editorstdtime: 0
    };
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    }
  },

  components: {
    editorstudent
  },

  methods: {
    /**
     * 编辑
     */
    openEditor() {
      this.editorstdtime = Date.now();
    },
    delstudent() {
      this.$confirm("是否删除该学员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deloading = true;
          this._NET
            .jw_student_delete({
              merchant_id: this.info.merchant_id,
              member_id: this.info.member_id
            })
            .then(data => {
              this.deloading = false;
              if (data.status == "ok") {
                this._alert({
                  type: "success",
                  msg: "删除成功"
                });
                this.$router.push({ name: "edu_student_home" });
              }
            })
            .catch(err => {
              this.deloading = false;
            });
        })
        .catch(() => {});
    },
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
          if (data.status == "ok") {
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
        .jw_student_update({
          member_id: this.$route.params.id,
          merchant_id: this.mymange,
          avatar: url
        })
        .then(data => {
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "头像已更新"
            });
            this.$refs.txfile.value = "";
            this.callback();
          }
        });
    },

    callback() {
      this.$emit("callback");
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../less/style.less";
.cutboxstyle {
  position: relative;
  width: 550px;
  height: 400px;
}
</style>
