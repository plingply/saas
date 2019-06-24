<template>
  <el-dialog :title="title" :visible.sync="show" width="600px">
    <div class="addbox">
      <el-form ref="form" :model="{}" label-width="90px" :rules="rules" label-position="right">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="name" size="medium" placeholder="请输入班级名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="所授课程">
          <el-select
            v-model="course"
            size="medium"
            style="width:100%"
            multiple
            filterable
            placeholder="请选择所授课程"
          >
            <el-option v-for="item in subject" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级容量">
          <div class="flex">
            <el-select
              style="width: 100px; min-width:100px; margin-right:8px"
              size="medium"
              v-model="class_rl"
            >
              <el-option label="限量" value="1"></el-option>
              <el-option label="不限量" value="2"></el-option>
            </el-select>
            <el-input
              v-model="contain"
              @input="containInput"
              :disabled="class_rl == '2'"
              size="medium"
              placeholder="班级容量"
              maxlength="5"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="学管老师">
          <el-select
            style="width:100%;"
            size="medium"
            v-model="manager"
            @change="teacherChange"
            multiple
            filterable
            placeholder="请选择学管老师"
          >
            <el-option
              v-for="item in teacher"
              :key="item.user_id"
              :label="item.user_remark"
              :value="item.user_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="remark"
            type="textarea"
            maxlength="500"
            size="medium"
            placeholder="请输入班级备注"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button v-if="!editor" type="primary" @click="addClass" :loading="loading">确认添加</el-button>
      <el-button v-if="editor" type="primary" @click="editorClass" :loading="loading">确认修改</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["showtime", "editor", "info", "teacherlist", "subjectlist"],

  data() {
    return {
      title: "添加班级",
      loading: false,
      show: false,
      class_rl: "2",
      /**
       * 班级
       */
      name: "",
      course: [],
      contain: "",
      manager: [],
      remark: "",

      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }]
      },

      teacher: [],
      subject: []
    };
  },

  watch: {
    showtime() {
      this.show = true;
      if (this.editor) {
        this.title = "编辑班级";
        this.name = this.info.name;
        this.course = this.info.course_ids
          ? this.info.course_ids.split(",")
          : [];
        this.contain = this.info.contain == "0" ? "" : this.info.contain;
        this.class_rl = this.contain && this.contain > 0 ? "1" : "2";
        this.manager = this.info.manager_ids
          ? this.info.manager_ids.split(",")
          : [];
        this.remark = this.info.remark;
      } else {
        this.name = "";
        this.course = [];
        this.contain = "";
        this.manager = [];
        this.remark = "";
        this.title = "添加班级";
      }

      this.getsubjectlist();
      this.getTeacherlist();
    },

    class_rl(v) {
      v == "2" ? (this.contain = "") : "";
    },

    teacherlist(v) {
      if (v && v.map) {
        v.map(item => {
          this.teacher.push(item);
        });
      }
    },

    subjectlist(v) {
      if (v && v.map) {
        v.map(item => {
          this.subject.push(item);
        });
      }
    }
  },

  methods: {
    containInput(v) {
      this.contain = this.$utils.formatphone(v);
    },

    addClass() {
      if (!this.name || this.name.trim() == "") {
        this._alert({
          msg: "请输入班级名称",
          type: "warning"
        });
        return;
      }

      if (this.class_rl == "1" && this.contain <= 0) {
        this._alert({
          msg: "班级容量必须大于0",
          type: "warning"
        });
        return;
      }

      this.loading = true;
      this._NET
        .jw_class_add({
          campus_id: this.campus_id,
          name: this.name,
          contain: this.contain ? this.contain : "0",
          remark: this.remark,
          manager: this.manager ? this.manager.join(",") : "",
          course: this.course ? this.course.join(",") : ""
        })
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            this.show = false;
            this.$confirm("班级添加成功，是否为该班级添加学员？", "提示", {
              confirmButtonText: "立即添加",
              cancelButtonText: "稍后处理",
              type: "success"
            })
              .then(() => {
                this.$router.push({
                  name: "edu_class_info",
                  params: { id: data.data },
                  query: { addStudent: "1" }
                });
              })
              .catch(() => {
                this.$emit("callback");
              });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    editorClass() {
      if (!this.name || this.name.trim() == "") {
        this._alert({
          msg: "请输入班级名称",
          type: "warning"
        });
        return;
      }

      if (this.class_rl == "1" && this.contain <= 0) {
        this._alert({
          msg: "班级容量必须大于0",
          type: "warning"
        });
        return;
      }

      this.loading = true;
      this._NET
        .jw_class_update({
          campus_id: this.campus_id,
          id: this.info.id,
          name: this.name,
          contain: this.contain ? this.contain : "0",
          remark: this.remark,
          manager: this.manager ? this.manager.join(",") : "",
          course: this.course ? this.course.join(",") : ""
        })
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            this.show = false;
            this._alert({
              msg: "更新成功",
              type: "success"
            });
            this.$emit("callback");
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    teacherChange(v) {
      v.length > 5
        ? (this.manager = v.splice(1, 5))
        : (this.manager = v.splice(0, 5));
    },

    getTeacherlist() {
      this._NET
        .getRoleUserList({
          campus_id: this.campus_id,
          role_id: "",
          limit: 1000,
          page: 1,
          role_type: "1"
        })
        .then(data => {
          if (data.code == "1") {
            this.teacher = data.data.item;
          }
        });
    },

    getsubjectlist() {
      this._NET
        .jw_course_list({
          campus_id: this.campus_id,
          page: 1,
          limit: 1000,
          search: "",
          status: "1",
          card_type_ids: ""
        })
        .then(data => {
          if (data.code == "1") {
            this.subject = data.data.item;
          }
        });
    }
  }
};
</script>


<style lang="less" scoped>
@import "../../../../../less/style.less";
.addbox {
  width: 350px;
  margin: 0 auto;
}

.flex {
  display: flex;
}
</style>
