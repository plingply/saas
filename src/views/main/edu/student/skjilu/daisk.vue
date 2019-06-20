<template>
  <div>
    <div class="selectbox">
      <span>
        <el-button plain @click="gotoWeek('1')">
          <i class="el-icon-arrow-left"></i>
        </el-button>
        <em
          class="time_style"
        >{{ `${weekData.item[0].year}-${weekData.item[0].month}-${weekData.item[0].day}` }} - {{ `${weekData.item[6].year}-${weekData.item[6].month}-${weekData.item[6].day}` }}</em>
        <el-button plain @click="gotoWeek('3')">
          <i class="el-icon-arrow-right"></i>
        </el-button>
      </span>
      &nbsp;&nbsp;
      <span class="y_link" @click="gotoWeek('2')">本周</span>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      class="table_moban"
      size="medium"
      v-loading="loading"
    >
      <el-table-column label="上课时间">
        <template slot-scope="scope">
          <div>{{ scope.row.start_time | yyyy_mm_dd }}</div>
          <p>{{ scope.row.start_time | H_M }}-{{ scope.row.end_time | H_M }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="grade_name" label="班级名称"></el-table-column>
      <el-table-column prop="course_name" label="课程名称"></el-table-column>
      <el-table-column prop="teacher_name" label="授课老师"></el-table-column>
    </el-table>
    <div class="fenye" v-show="count > fysize">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="limit"
        @size-change="sizeChange"
        :page-sizes="pageSizes"
        :layout="fy_layout"
        :total="count"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import calendar from "c-calendar";
export default {
  data() {
    return {
      loading: false,
      list: [],
      page: 1,
      limit: 10,
      count: 0,
      calendar: {},
      weekData: []
    };
  },

  methods: {
    handleCurrentChange(v) {
      this.page = v;
      this.getList();
    },

    sizeChange(val) {
      this.page = 1;
      this.limit = val;
      this.getList();
    },
    getList() {
      let start_time = parseInt(
        new Date(
          this.weekData.item[0].year,
          this.weekData.item[0].month - 1,
          this.weekData.item[0].day
        ).setHours(0, 0, 0) / 1000
      );
      start_time = start_time;

      let end_time = parseInt(
        new Date(
          this.weekData.item[6].year,
          this.weekData.item[6].month - 1,
          this.weekData.item[6].day
        ).setHours(23, 59, 59) / 1000
      );
      this.loading = true;
      this._NET
        .jw_student_signlist({
          campus_id: this.campus_id,
          member_id: this.$route.params.id,
          start_time,
          end_time,
          limit: this.limit,
          page: this.page,
          is_done: "0"
        })
        .then(res => {
          this.loading = false;
          if (res.status == "ok") {
            this.list = res.data.item;
            this.count = res.data.count;
          }
        });
    },

    gotoWeek(type) {
      if (type == "1") {
        this.weekData = this.calendar.prew();
        this.getList();
      }
      if (type == "2") {
        this.calendar = new calendar({
          time: new Date(),
          type: "week",
          week: "1"
        });
        this.weekData = this.calendar.init();
        this.getList();
      }
      if (type == "3") {
        this.weekData = this.calendar.next();
        this.getList();
      }
    },

    initfunc() {
      this.calendar = new calendar({
        time: new Date(),
        type: "week",
        week: "1"
      });

      this.weekData = this.calendar.init();
    }
  },

  created() {
    this.initfunc();
    this.getList();
  }
};
</script>


<style lang="less" scoped>
@import "../../../../../less/style.less";
.selectbox {
  padding: 16px 0;
}

.time_style {
  padding: 0 8px;
  line-height: 30px;
}
</style>
