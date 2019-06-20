<template>
  <div class="autobox">
    <div class="banner_title">
      <span>班级管理</span>
    </div>

    <div class="btnbox">
      <el-button type="primary"  @click="addshowtime = +new Date()">
        <i class="el-icon-plus"></i>添加班级
      </el-button>
    </div>

    <div class="searchbox">
      <el-select
        v-model="course"
        placeholder="选择课程"
        filterable
        style="width:150px;margin-right:10px"
      >
        <el-option label="全部课程" value></el-option>
        <el-option
          :label="item.name"
          :value="item.id"
          v-for="(item,index) in subjectlist"
          :key="index"
        ></el-option>
      </el-select>
      <el-select
        v-model="manager"
        filterable
        placeholder="学管老师"
        style="width:150px;margin-right:10px"
      >
        <el-option label="全部老师" value></el-option>
        <el-option
          :label="item.user_remark"
          :value="item.user_id"
          v-for="(item,index) in teacherlist"
          :key="index"
        ></el-option>
      </el-select>
      <el-input
        placeholder="班级名称"
        clearable
        maxlength="30"
        prefix-icon="el-icon-search"
        style="width:180px;margin-right:10px"
        v-model="search"
      ></el-input>

      <div class="btnbox">
        <el-button type="primary" @click="serachFuns">查询</el-button>
        <el-button plain @click="reset">重置</el-button>
      </div>
    </div>

    <div class="tablestyle" v-loading="loading" element-loading-text="加载中">
      <el-table :data="list" style="width: 100%" class="table_moban" size="medium">
        <el-table-column label="班级名称" prop="name">
          <template slot-scope="scope">
            <textbox :len="10" :text="scope.row.name"></textbox>
          </template>
        </el-table-column>
        <el-table-column label="所授课程" prop="course">
          <template slot-scope="scope">
            <textbox :len="20" :text="scope.row.course"></textbox>
          </template>
        </el-table-column>
        <el-table-column label="学管老师" prop="manager">
          <template slot-scope="scope">
            <textbox :len="30" :text="scope.row.manager"></textbox>
          </template>
        </el-table-column>
        <el-table-column label="人数/容量" prop="contain">
          <template slot-scope="scope">
            <span>{{ scope.row.member_count }} /</span>
            <span v-if="scope.row.contain != '0'">{{ scope.row.contain }}</span>
            <span v-if="scope.row.contain == '0'">不限量</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="班级状态"></el-table-column> -->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <ui-button
              type="danger text"
              size="mini"
              @click="$router.push({ name:'edu_class_info',params:{ id: scope.row.id } })"
            >详情</ui-button>
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
    </div>

    <!-- 添加班级 -->
    <addclass
      :showtime="addshowtime"
      @callback="reset"
      :teacherlist="teacherlist"
      :subjectlist="subjectlist"
    ></addclass>
  </div>
</template>
<script>
import addclass from "./componts/add";
export default {
  name: "class_list",
  data() {
    return {
      loading: false,
      course: "",
      manager: "",
      search: "",

      list: [{ id: 1 }, { id: 23 }],
      page: 1,
      limit: 10,
      count: 0,

      addshowtime: 0,

      teacherlist: [],
      subjectlist: []
    };
  },

  components: {
    addclass
  },

  methods: {
    setLocalStorage() {
      window.sessionStorage.setItem("course", this.course);
      window.sessionStorage.setItem("manager", this.manager);
      window.sessionStorage.setItem("search", this.search);
      window.sessionStorage.setItem("page", this.page);
      window.sessionStorage.setItem("limit", this.limit);
    },

    getLocalStorage() {
      this.course = window.sessionStorage.getItem("course")
        ? window.sessionStorage.getItem("course")
        : this.course;
      this.manager = window.sessionStorage.getItem("manager")
        ? window.sessionStorage.getItem("manager")
        : this.manager;
      this.search = window.sessionStorage.getItem("search")
        ? window.sessionStorage.getItem("search")
        : this.search;
      this.page = window.sessionStorage.getItem("page")
        ? window.sessionStorage.getItem("page")
        : this.page;
      this.limit = window.sessionStorage.getItem("limit")
        ? window.sessionStorage.getItem("limit")
        : this.limit;
    },

    sizeChange(val) {
      this.limit = val;
      this.page = 1;
      this.getlist();
    },
    serachFuns() {
      this.page = 1;
      this.getlist();
    },
    reset() {
      this.course = "";
      this.search = "";
      this.manager = "";
      this.page = 1;
      this.getlist();
    },

    handleCurrentChange(v) {
      this.page = v;
      this.getlist();
    },

    /**
     * 列表
     */
    getlist() {

      this.setLocalStorage()
      
      this.loading = true;

      this._NET
        .jw_class_list({
          limit: this.limit,
          campus_id: this.campus_id,
          page: this.page,
          search: this.search,
          manager: this.manager,
          course: this.course
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
            this.teacherlist = data.data.item;
          }
        });
    },
    getsubjectlist() {
      console.log("课程列表")
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
            this.subjectlist = data.data.item?data.data.item:[];
          }
        });
    }
  },
  created() {
    // 判断是否通过返回进入
    if (this.$route.query.callback) {
      this.getLocalStorage();
    } else {
      this.setLocalStorage();
    }

    this.getlist();
    this.getsubjectlist();
    this.getTeacherlist();
    
  }
};
</script>
<style lang="less" scoped>
@import "../../../../less/style.less";
.searchbox {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: @px * 4px;
}

.mb16 {
  margin-bottom: 16px;
}

.tablestyle {
  position: relative;
}

.fenye {
  padding: 0;
  margin-top: 24px;
  margin-bottom: 24px;
}
</style>


