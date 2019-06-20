<template>
  <div v-loading="loading">
    <div class="banner_title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'edu_class_list' }">班级管理</el-breadcrumb-item>
        <el-breadcrumb-item>班级详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="class_infobox">
      <div class="yx_title">
        <span>班级详情</span>
        <div class="btnbox">
          <span class="y_link" @click="$router.push({ name: 'edu_class_list',query:{ callback: true } })">返回上一层</span>
          <el-button
            size="small"
            style="width:88px"
            plain
            @click="delfun"
          >删除</el-button>
          <el-button
            size="small"
            type="primary"
            style="width:88px"
            @click="editorfunc"
          >编辑</el-button>
        </div>
      </div>
      <el-form ref="form" :model="{}" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="班级名称">{{ info.name }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班级容量">
              <span v-if="info.contain == '0'">不限量</span>
              <span v-if="info.contain != '0'">{{ info.contain }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班级人数">{{ info.member_count?info.member_count:'--' }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所授课程">{{ info.course?info.course:'--' }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="学管老师">{{ info.manager?info.manager:'--' }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <div class="wordbreak">{{ info.remark?info.remark:'--' }}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <tabs>
      <template #head>
        <span :class="{active:activeName == 'a'}">添加学员</span>
      </template>
      <template #main>
        <el-button size="mini" type="primary" @click="openAddStudent">添加学员</el-button>
        <el-table :data="list" style="width: 100%">
          <el-table-column prop="name" label="学员姓名"></el-table-column>
          <el-table-column prop="sex" label="性别"></el-table-column>
          <el-table-column prop="phone" label="联系电话"></el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="tiaobanfunc(scope.row.member_id)">
                <span class="blue">转班</span>
              </el-button>
              <el-button type="text">
                <span class="danger" @click="removeStudentFromClass(scope.row)">移出本班</span>
              </el-button>
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
      </template>
    </tabs>

    <!-- 编辑班级 -->
    <editorclass :showtime="addshowtime" :info="info" :editor="true" @callback="getinfo"></editorclass>

    <!-- 添加学员 -->
    <addstudent :showtime="stdshowtime" :id="info.id" @callback="getList"></addstudent>

    <!-- 转班 -->
    <zhuanban
      :showtime="tiaobanshow"
      :old_grade_id="$route.params.id"
      :member_id="member_id"
      @callback="getList"
    ></zhuanban>
  </div>
</template>

<script>
import editorclass from "./componts/add";
import addstudent from "./componts/addstudent";
import zhuanban from "../componts/zhuanban";
export default {
  data() {
    return {
      activeName: "a",
      loading: false,
      addshowtime: 0,
      stdshowtime: 0,
      tiaobanshow: 0,
      member_id: "",
      info: {
        id: 1
      },

      list: [],
      page: 1,
      limit: 10,
      count: 0
    };
  },

  components: {
    editorclass,
    addstudent,
    zhuanban
  },


  methods: {
    sizeChange(val) {
      this.limit = val;
      this.page = 1;
      this.getList();
    },

    handleCurrentChange(v) {
      this.page = v;
      this.getList();
    },

    openAddStudent() {
      this.stdshowtime = +new Date();
    },
    editorfunc() {
      this.addshowtime = +new Date();
    },

    tiaobanfunc(id) {
      this.member_id = id;
      this.tiaobanshow = Date.now();
    },

    delfun() {
      /**
       * 班级有待上课的排课计划，则在删除时提示：该班级有排课计划，不可删除，请先检查并处理排课信息
       * 班级内有学员，则提示：该班级内有学员{班级内学员人数}人，删除班级后，若学员无其他班级，学员分班状态会变为未分班，请确认是否删除班级？
       * 班级内无学员，且无排课计划，则提示：请确认是否删除该班级？
       */
      let msg = "请确认是否删除该班级？";
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delClassFunc("0");
        })
        .catch(() => {});
    },

    delClassFunc(confirm) {
      this._NET
        .jw_class_delete(
          {
            id: this.$route.params.id,
            campus_id: this.campus_id,
            confirm
          },
          true
        )
        .then(data => {
          if (data.code == "1") {
            this._alert({
              msg: "删除成功",
              type: "success"
            });
            this.$router.push({ name: "edu_class_list" });
          } else {
            if (data.code == 1000) {
              let msg = data.msg;
              this.$confirm(msg, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  this.delClassFunc("1");
                })
                .catch(() => {});
            } else {
              this._alert({
                msg: data.msg,
                type: "warning"
              });
            }
          }
        });
    },

    removeStudentFromClass(student) {

      let msg = `<p>您将把<span style='color:#FF6562'>${
        student.name
      }</span>移出班级：<span style='color:#FF6562'>${
        this.info.name
      }</span>，请确认是否移出？</p>`;
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.removeStudentFun(student);
        })
        .catch(() => {});
    },

    removeStudentFun(student) {
      this._NET
        .jw_class_moveMember({
          campus_id: this.campus_id,
          member_id: student.member_id,
          grade_id: this.$route.params.id
        })
        .then(data => {
          if (data.code == "1") {
            this._alert({
              type: "success",
              msg: "移出成功"
            });
            this.getList();
          }
        });
    },

    getinfo() {
      this.loading = true;
      this._NET
        .jw_class_info({
          campus_id: this.campus_id,
          id: this.$route.params.id
        })
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            this.info = data.data;
          }
        });
    },

    // 获取班级学员
    getList() {
      this.loading = true;
      this._NET
        .jw_class_member({
          campus_id: this.campus_id,
          grade_id: this.$route.params.id,
          page: this.page,
          limit: this.limit
        })
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            this.list = data.data.item;
            this.count = data.data.count;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },

  created() {
    this.getinfo();
    this.getList();
  },

  mounted() {
    if (this.$route.query.addStudent) {
      this.stdshowtime = Date.now();
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../less/style.less";
.class_infobox {
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: @px * 4px;
  padding: @px*6px;
  padding-top: 1px;
  .class_title {
    font-size: 16px;
    font-weight: normal;
    display: flex;
    justify-content: space-between;
    div {
      font-size: 14px;
    }
  }
}

.yx_title {
  margin-top: 24px;
}

.btnbox {
  text-align: right;
  .y_link{
    font-weight: normal;
    font-size: 14px;
    margin-right: 8px;
  }
}
</style>
