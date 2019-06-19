<template>
  <div>
    <div class="btnbox">
      <el-button type="primary" @click="fenbanfunc" >分班</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      class="table_moban"
      size="medium"
      v-loading="loading"
    >
      <el-table-column label="班级名称" prop="grade_name"></el-table-column>
      <el-table-column label="课程" prop="course_name"></el-table-column>
      <el-table-column label="入班时间" prop="created_at">
        <template slot-scope="scope">
          <div>{{ scope.row.created_at | yyyy_mm_dd_H_M_S }}</div>
        </template>
      </el-table-column>
      <el-table-column label="上课次数" prop="sign_num"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="zhuanbanshow(scope.row.grade_id)">
            <span class="blue">转班</span>
          </el-button>
          <el-button type="text" @click="removeStudentFromClass(scope.row)">退班</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 转班 -->
    <zhuanban
      :showtime="tiaobanshow"
      :old_grade_id="old_grade_id"
      :member_id="$route.params.id"
      @callback="getList"
    ></zhuanban>

    <!-- 分班 -->
    <fenban :showtime="fenbanshow" :member_id="$route.params.id" @callback="fenbanCallback"></fenban>
  </div>
</template>

<script>
import zhuanban from "../componts/zhuanban";
import fenban from "../componts/fenban";
export default {
  props: ["info"],
  data() {
    return {
      list: [],
      loading: false,
      tiaobanshow: 0,
      old_grade_id: "",
      fenbanshow: 0
    };
  },

  components: {
    zhuanban,
    fenban
  },

  methods: {
    getList() {
      this.loading = true;
      this._NET
        .jw_student_class_list({
          merchant_id: this.mymange,
          member_id: this.$route.params.id,
          type: "0"
        })
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this.list = data.data;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    fenbanfunc() {
      this.fenbanshow = Date.now();
    },

    fenbanCallback() {
      this.getList();
    },

    zhuanbanshow(id) {
      this.old_grade_id = id;
      this.tiaobanshow = Date.now();
    },

    removeStudentFromClass(classinfo) {

      let msg = `<p>您将把<span style='color:#FF6562'>${
        this.info.name
      }</span>移出班级：<span style='color:#FF6562'>${
        classinfo.grade_name
      }</span>，请确认是否移出？</p>`;
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.removeStudentFun(classinfo);
        })
        .catch(() => {});
    },

    removeStudentFun(classinfo) {
      this._NET
        .jw_class_moveMember({
          merchant_id: this.mymange,
          member_id: classinfo.member_id,
          grade_id: classinfo.grade_id
        })
        .then(data => {
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "移出成功"
            });
            this.getList();
          }
        });
    }
  },

  created() {
    this.getList();
  },

  mounted() {
    if(this.$route.query.open){
      this.fenbanfunc()
    }
  },
};
</script>
<style lang="less" scoped>
.btnbox {
  margin-bottom: 8px;
}
</style>