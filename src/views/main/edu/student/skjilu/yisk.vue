<template>
  <div>
    <div class="selectbox">
      <el-date-picker
        style="width: 250px"
        v-model="timearr"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <el-button type="primary" @click="getList">查询</el-button>
    </div>
    <el-alert
      v-show="tjtext"
      style="margin-bottom:8px"
      :title="tjtext"
      type="success"
      :closable="false"
    ></el-alert>
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
      <el-table-column prop="status" label="考勤状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '1'" class="success">签到</span>
          <span v-if="scope.row.status == '2'" class="warning">请假</span>
          <span v-if="scope.row.status == '3'" class="danger">未到</span>
          <span v-if="!scope.row.status || scope.row.status == '0'" class="blue">未处理</span>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="学员卡消耗">
        <template slot-scope="scope">
          <p>{{ scope.row.card_name }}</p>
          <p>{{ scope.row.num }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="考勤时间">
        <template slot-scope="scope">{{ scope.row.created_at | yyyy_mm_dd_H_M }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openKaoqin(scope.row)">修改考勤状态</el-button>
        </template>
      </el-table-column>
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

    <el-dialog title="修改考勤状态" :visible.sync="show" width="520px">
      <div>
        <el-radio-group v-model="kqtype">
          <div class="kqrow">
            <el-radio label="1" :disabled="kqpbj.status == '1'">签到</el-radio>
            <el-radio label="2" :disabled="kqpbj.status == '2'">请假</el-radio>
            <el-radio label="3" :disabled="kqpbj.status == '3'">未到</el-radio>
          </div>
          <el-alert
            title="考勤扣费根据当前消课逻辑处理，请留意该课程是否变更过消课价格/课时"
            type="warning"
            :closable="false"
            effect="dark"
          ></el-alert>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="updateKaoqin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      timearr: [],
      list: [],
      page: 1,
      limit: 10,
      count: 0,
      show: false,
      kqtype: "",
      kqpbj: {},
      tjtext: "",
      pickerOptions: {
        disabledDate(t) {
          if (t > new Date()) {
            return true;
          } else {
            return false;
          }
        },
        shortcuts: [
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },

  methods: {
    openKaoqin(obj) {
      this.kqpbj = obj;
      this.show = true;
      this.kqtype = obj.status;
    },

    updateKaoqin() {
      this._NET
        .jw_student_signupdate({
          merchant_id: this.mymange,
          member_id: this.kqpbj.member_id,
          ctid: this.kqpbj.ctid,
          status: this.kqtype,
          sign_id: this.kqpbj.id
        })
        .then(res => {
          this.show = false;
          if (res.status == "ok") {
            this._alert({
              type: "success",
              msg: "修改成功"
            });
            this.getList();
          }
        });
    },

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
      if (!this.timearr) {
        this._alert({
          type: "warning",
          msg: "请选择时间"
        });
        return;
      }
      let start_time = parseInt(this.timearr[0].setHours(0, 0, 0) / 1000);
      let end_time = parseInt(this.timearr[1].setHours(23, 59, 59) / 1000);
      this.loading = true;
      this._NET
        .jw_student_signlist({
          merchant_id: this.mymange,
          member_id: this.$route.params.id,
          start_time,
          end_time,
          limit: this.limit,
          page: this.page,
          is_done: "1"
        })
        .then(res => {
          this.loading = false;
          if (res.status == "ok") {
            this.list = res.data.item;
            this.count = res.data.count;
            this.tjtext = `到课${res.data.done_count}次 请假${
              res.data.leave_count
            }次 未到${res.data.absent_count}次`;
          }
        });
    }
  },

  created() {
    let nowtime = new Date();
    let starttime = new Date(nowtime - 3600 * 1000 * 24 * 30);
    this.timearr = [starttime, nowtime];
    this.getList();
  }
};
</script>


<style lang="less" scoped>
@import "../../../../../less/style.less";

.selectbox {
  padding: 16px 0;
}

.kqrow {
  padding: 16px 0;
  text-align: center;
}
</style>
