<template>
  <div class="gjbox">
    <div class="title">
      <span>下次跟进时间</span>
      <el-date-picker
        v-model="day"
        :picker-options="pickerOptions"
        style="width:140px"
        type="date"
        placeholder="选择日期"
      ></el-date-picker>
      <el-time-select
        v-model="time"
        style="width:120px"
        :picker-options="{
          start: '00:00',
          step: '01:00',
          end: '23:00'
        }"
        placeholder="选择时间"
      ></el-time-select>
      <em>选填，系统将在设定时间点推送回访通知</em>
    </div>
    <div class="textarea">
      <el-input
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6 }"
        maxlength="200"
        placeholder="请输入跟进记录"
        v-model="content"
      ></el-input>
      <span>{{ content.length }}/200</span>
    </div>
    <div class="btnbox">
      <el-button type="primary"  @click="addfun" :loading="gloading">提交</el-button>
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
            <em>{{ item.follow_name }}</em>
            <time>{{ item.created | yyyy_mm_dd_H_M }}</time>
          </div>
          <div class="gj_content">{{ item.content }}</div>
          <div class="gj_btnbox">
            <time v-show="item.updated && item.updated != '0'">
              <img src="static/img/timeicon.png" alt>
              {{ item.updated | yyyy_mm_dd_H_M }}
            </time>
            <el-button type="text" @click="delfun(item)">删除</el-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      gloading: false,
      day: "",
      time: "",
      content: "",
      list: [],
      startTime:'',

      pickerOptions: {
        disabledDate(v) {
          if (v.getTime() < new Date().getTime() - 1000*60*60*24 ) {
            return true;
          } else {
            return false;
          }
        }
      }
    };
  },
  

  methods: {
    /**
     * 删除记录
     */
    delfun(item) {
      this.$confirm("是否确认删除此记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._NET
            .jw_yx_delgj({
              id: item.id
            })
            .then(data => {
              if (data.code == "1") {
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
    /**
     * 添加跟进记录
     */
    addfun() {
      if (this.day && !this.time) {
        this._alert({
          type: "warning",
          msg: "请选择跟进时间"
        });
        return;
      }

      if (!this.day && this.time) {
        this._alert({
          type: "warning",
          msg: "请选择跟进日期"
        });
        return;
      }

      if (this.content == "") {
        this._alert({
          type: "warning",
          msg: "请输入跟进内容"
        });
        return;
      }
      let next_follow_at = "";

      if (this.day && this.time) {
        next_follow_at =
          parseInt(this.day.getTime() / 1000) +
          parseInt(this.time.split(":")[0] * 60 * 60);
      }
      this.gloading = true;

      this._NET
        .jw_yx_addgj({
          content: this.content,
          intention_id: this.$route.params.id,
          next_time: next_follow_at
        })
        .then(data => {
          this.gloading = false;
          if (data.code == "1") {
            this._alert({
              type: "success",
              msg: "添加成功"
            });
            this.day = "";
            this.time = "";
            this.content = "";
            this.getlist();
          }
        })
        .catch(err => {
          this.gloading = false;
        });
    },

    getlist() {
      this.loading = true;
      this._NET
        .jw_yx_gjlist({
          id: this.$route.params.id
        })
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            this.list = data.data;
          }
        })
        .catch(err => {
          this.loading = false;
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

.gjbox {
  width: 630px;
}
.title {
  font-size: 14px;
  color: @c2;
  margin-bottom: 15px;
  > span {
    margin-right: 5px;
    color: @c2;
  }
  > em {
    margin-left: 5px;
    color: @c3;
  }
}

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
  padding-top: 24px;
  margin-bottom: 16px;
}
</style>
