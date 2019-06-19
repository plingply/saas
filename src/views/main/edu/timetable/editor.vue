<template>
  <el-dialog title="修改排课" :visible.sync="show" width="600px">
    <div class="pk_content" v-loading="loading">
      <div class="formbox">
        <el-form ref="form" :model="form" :rules="rules" label-width="170px">
          <el-form-item label="班级" prop="class">
            <el-select
              style="width: 272px"
              @change="classChange"
              size="medium"
              v-model="form.class"
              placeholder="请选择班级"
              filterable
              disabled
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item,index) in classlist"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程" prop="subject">
            <el-select
              style="width: 272px"
              size="medium"
              v-model="form.subject"
              placeholder="请选择课程"
              filterable
              disabled
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item,index) in subjectlist"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授课老师" prop="teacher">
            <el-select
              style="width: 272px"
              size="medium"
              v-model="form.teacher"
              placeholder="请选择授课老师"
              filterable
            >
              <el-option
                :label="item.user_remark"
                :value="item.user_id"
                v-for="(item,index) in teacherlist"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上课时间" prop="start_time">
            <el-date-picker
              style="width: 150px"
              size="medium"
              v-model="form.start_time"
              type="date"
              placeholder="上课日期"
              :picker-options="pickerOptions_1"
            ></el-date-picker>
            <el-time-picker
              size="medium"
              style="width: 118px"
              format="HH:mm"
              v-model="form.time"
              placeholder="上课时间"
            ></el-time-picker>
          </el-form-item>
          <el-form-item label="上课时长" prop="sc">
            <el-input
              style="width: 232px"
              size="medium"
              @input="scInput"
              v-model="form.sc"
              placeholder="上课时长(分钟)"
              maxlength="5"
            ></el-input>分钟
          </el-form-item>
          <el-form-item label="教室">
            <el-select
              style="width: 272px"
              size="medium"
              v-model="form.classroom"
              placeholder="请选择教室"
              filterable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="(item,index) in classroomlist"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button v-if="!pkdata.ctid" type="primary" @click="quedingfun">确 定</el-button>
      <el-button v-if="pkdata.ctid" type="primary" @click="updatefunc">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["showtime", "pkdata", "classlist", "teacherlist", "classroomlist"],
  data() {
    return {
      show: false,
      subjectlist: [],
      loading: false,
      form: {
        class: "",
        subject: "",
        teacher: "",
        start_time: "",
        time: "",
        sc: "",
        classroom: ""
      },

      hours_time: "",

      rules: {
        class: [{ required: true, message: " ", trigger: "blur" }],
        subject: [{ required: true, message: " ", trigger: "blur" }],
        teacher: [{ required: true, message: " ", trigger: "blur" }],
        start_time: [{ required: true, message: " ", trigger: "blur" }],
        sc: [{ required: true, message: " ", trigger: "blur" }]
      },

      pickerOptions_1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 3600 * 24;
        }
      }
    };
  },

  watch: {
    showtime() {
      // ctid
      this.show = true;
      this.form.class = this.pkdata.grade_id;
      this.form.subject = this.pkdata.course_id;
      this.form.start_time = new Date(this.pkdata.start_time * 1000);
      this.form.time = new Date(this.pkdata.start_time * 1000);
      this.form.sc = this.pkdata.len;
      this.form.classroom = this.pkdata.classroom_id;

      if (this.pkdata.ctid) {
        this.form.teacher = this.pkdata.teacher_id;
      } else {
        this.form.teacher = this.pkdata.teacher_ids;
      }

      this.classlist.map(item => {
        if (item.id == this.form.class) {
          this.subjectlist = item.course_list;
        }
      });
    }
  },

  methods: {
    classChange(id) {
      this.form.subject = "";
      this.classlist.map(item => {
        if (item.id == id) {
          this.subjectlist = item.course_list;
        }
      });
    },

    updatefunc(type) {
      if (!this.verification()) return;
      let time = new Date(this.form.time);
      this.hours_time = time.getTime() - time.setHours(0, 0, 0);
      let start_time = parseInt(
        (this.form.start_time.setHours(0, 0, 0) + this.hours_time) / 1000
      );
      let data = {
        merchant_id: this.pkdata.merchant_id,
        grade_id: this.form.class,
        course_id: this.form.subject,
        teacher_ids: this.form.teacher,
        start_time,
        len: this.form.sc,
        classroom_id: this.form.classroom,
        ctid: this.pkdata.ctid,
        ignore_conflict: type == "1" ? "1" : "0"
      };

      this._NET.jw_paike_update(data, true).then(res => {
        if (res.status == "ok") {
          this._alert({
            type: "success",
            msg: "修改成功"
          });

          this.show = false;
          this.$emit("callback");
        } else {
          // 冲突
          if (res.code == 1002 || res.code == 1001 || res.code == 1000) {
            this.$confirm(`排课信息${res.msg}，是否继续修改?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.updatefunc("1");
              })
              .catch(() => {});
          } else {
            this._alert({
              type: "warning",
              msg: res.msg
            });
          }
        }
      });
    },

    quedingfun() {
      if (!this.verification()) return;
      let time = new Date(this.form.time);
      this.hours_time = time.getTime() - time.setHours(0, 0, 0);
      let start_time = parseInt(
        (this.form.start_time.setHours(0, 0, 0) + this.hours_time) / 1000
      );
      let data = {
        merchant_id: this.mymange,
        grade_id: this.form.class,
        course_id: this.form.subject,
        teacher_ids: this.form.teacher,
        start_time,
        len: this.form.sc,
        classroom_id: this.form.classroom
      };
      this.$emit("callback", data);
      this.show = false;
    },

    verification() {
      if (!this.form.class) {
        this._alert({
          type: "warning",
          msg: "请选择班级"
        });
        return false;
      }

      if (!this.form.subject) {
        this._alert({
          type: "warning",
          msg: "请选择课程"
        });
        return false;
      }

      if (!this.form.teacher) {
        this._alert({
          type: "warning",
          msg: "请选择授课老师"
        });
        return false;
      }

      if (!this.form.start_time) {
        this._alert({
          type: "warning",
          msg: "请选择上课日期"
        });
        return false;
      }

      if (!this.form.time) {
        this._alert({
          type: "warning",
          msg: "请选择上课时间"
        });
        return false;
      }

      let house = this.form.time.getHours();
      let min = this.form.time.getMinutes();


      let len = house * 1000 * 60 * 60 + min * 60 * 1000

      if (this.form.start_time.getTime() <= new Date().getTime()) {
        if (this.form.start_time.getTime() + len <= new Date().getTime()) {
          this._alert({
            type: "warning",
            msg: "上课时间必须大于当前时间"
          });
          return false;
        }
      }

      if (!this.form.sc) {
        this._alert({
          type: "warning",
          msg: "请填写上课时长"
        });
        return false;
      }

      if (this.form.sc <= 0) {
        this._alert({
          type: "warning",
          msg: "上课时长必须大于0"
        });
        return false;
      }

      return true;
    }
  }
};
</script>
