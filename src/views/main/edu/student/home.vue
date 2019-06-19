<template>
  <div class="autobox">
    <div class="banner_title">
      <span>学员管理</span>
    </div>

    <div class="btnbox">
      <el-button type="primary" @click="addstdtime = +new Date()">
        <i class="el-icon-plus"></i>添加学员
      </el-button>
      <el-button plain @click="stdtime = +new Date()">批量导入</el-button>
    </div>

    <div class="searchbox">
      <div>
        <span style="margin-right:5px">入学时间</span>
        <el-date-picker
          class="mb15"
          v-model="s_rx_time"
          type="daterange"
          style="width:240px;margin-right:10px;position:relative;top:1px"
          align="left"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>

      <el-select
        v-model="s_status"
        filterable
        placeholder="学员状态"
        style="width:150px;margin-right:10px"
        class="mb15"
      >
        <el-option label="全部状态" value></el-option>
        <el-option
          :label="item"
          :value="key"
          :key="key"
          v-for="(item,key) in yx_config.member_status"
        ></el-option>
      </el-select>
      <el-select
        v-model="s_cc"
        filterable
        placeholder="课程顾问"
        style="width:150px;margin-right:10px"
        class="mb15"
      >
        <el-option label="全部课程顾问" value></el-option>
        <el-option
          :label="item.user_remark"
          :value="item.id"
          :key="key"
          v-for="(item,key) in yx_cclist"
        ></el-option>
      </el-select>
      <el-select
        v-model="s_qd"
        filterable
        placeholder="渠道来源"
        style="width:150px;margin-right:10px"
        class="mb15"
      >
        <el-option label="全部渠道来源" value></el-option>
        <el-option :label="item.name" :value="item.id" :key="key" v-for="(item,key) in yx_qudao"></el-option>
      </el-select>
      <el-input
        class="mb15"
        placeholder="学员姓名/电话/学号"
        clearable
        maxlength="30"
        prefix-icon="el-icon-search"
        style="width:180px;margin-right:10px"
        v-model="s_search"
      ></el-input>

      <div class="btnbox">
        <el-button type="primary" @click="serachFuns">查询</el-button>
        <el-button plain @click="reset">重置</el-button>
      </div>

      <div class="select_right">
        <el-button type="text" @click="setheadshow">设置表头</el-button>
      </div>
    </div>

    <div class="tablestyle" v-loading="loading" element-loading-text="加载中">
      <el-table :data="list" style="width: 100%" class="table_moban" size="medium">
        <el-table-column label="学员姓名/学号" prop="name">
          <template slot-scope="scope">
            <p>
              {{ scope.row.name }}
              <span v-if="scope.row.sex == '男'">
                <img class="sexicon" src="static/img/nan.png" alt>
              </span>
              <span v-if="scope.row.sex == '女'">
                <img class="sexicon" src="static/img/nv.png" alt>
              </span>
            </p>
            <p>{{ scope.row.member_sn }}</p>
          </template>
        </el-table-column>
        <el-table-column label="联系电话">
          <template slot-scope="scope">
            <p>{{ scope.row.phone_belong | phone_belong }}</p>
            <p>{{ scope.row.phone }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="tablehead['age'].name" v-if="checkArr.indexOf('age') > -1">
          <template slot-scope="scope">{{ scope.row.age }}</template>
        </el-table-column>
        <el-table-column label="入学时间" v-if="true">
          <template slot-scope="scope">{{ scope.row.created_at | yyyy_mm_dd }}</template>
        </el-table-column>
        <el-table-column label="是否在班" v-if="true">
          <template slot-scope="scope">
            <router-link
              :to="{ name:'edu_student_class', params:{ id: scope.row.id } }"
              tag="span"
              class="y_link_c"
              v-if="scope.row.have_grade == '1'"
            >在班</router-link>
            <span v-else class="y_link" @click="fenbanfunc(scope.row.id)">未分班</span>
          </template>
        </el-table-column>
        <el-table-column label="学员卡" v-if="true">
          <template slot-scope="scope">
            <router-link
              :to="{ name:'edu_student_card', params:{ id: scope.row.id } }"
              tag="span"
              class="y_link_c"
              v-if="scope.row.have_card == '1'"
            >已发卡</router-link>
            <span v-else class="y_link" @click="fakafunc(scope.row)">未发卡</span>
          </template>
        </el-table-column>
        <el-table-column label="学员状态" v-if="true">
          <template slot-scope="scope">
            <div v-for="(item,index) in yx_config.member_status" :key="index">
              <span v-if="index == scope.row.status ">{{ item }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="tablehead['gw'].name" v-if="checkArr.indexOf('gw') > -1">
          <template slot-scope="scope">
            <span v-for="(item,index) in yx_cclist" :key="index">
              <span v-if="item.id == scope.row.course_consultant">{{ item.user_remark }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="tablehead['qd'].name" v-if="checkArr.indexOf('qd') > -1">
          <template slot-scope="scope">
            <span v-for="(item,index) in yx_qudao" :key="index">
              <span v-if="item.id == scope.row.source">{{ item.name }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="tablehead['ljsf'].name" v-if="checkArr.indexOf('ljsf') > -1">
          <template slot-scope="scope">￥{{ scope.row.fee_total }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <ui-button
              type="danger text"
              size="mini"
              @click="$router.push({ name:'edu_student_pay', params:{ id: scope.row.id } })"
            >详情</ui-button>
            <ui-button
              type="danger text"
              size="mini"
              @click="$router.push({ name:'edu_student_Growup', params:{ id: scope.row.id } })"
            >成长记录</ui-button>
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

    <!-- 添加学员 -->
    <addstudent :show="addstdtime" @callback="reset"></addstudent>

    <!-- 批量导入 -->
    <daoru :show="stdtime" @callback="reset"></daoru>

    <!-- 表头设置 -->
    <studenthead :show="headshow" :headObj="headObj" @callback="getStudentHead"></studenthead>

    <!-- 发卡 -->
    <faka :student-info="studentinfo" :showtime="showtime" @callback="getlist"></faka>

    <!-- 分班 -->
    <fenban :showtime="fenbanshow" :id="id" @callback="getlist"></fenban>
  </div>
</template>
<script>
import addstudent from "../componts/addstudent.vue";
import daoru from "../componts/std_daoru.vue";
import studenthead from "../componts/studentHead";
import tablehead from "@/util/student_head";
import faka from "../componts/faka.vue";
import fenban from "../componts/fenban.vue";
export default {
  name: "student_home",
  data() {
    return {
      loading: false,
      s_rx_time: [],
      s_cc: "",
      s_qd: "",
      s_status: "",
      s_search: "",

      list: [],
      page: 1,
      limit: 10,
      count: 0,
      pickerOptions: {
        disabledDate(v) {
          if (
            v.getTime() < new Date(2018, 5, 20).getTime() ||
            v.getTime() > new Date().getTime()
          ) {
            return true;
          } else {
            return false;
          }
        }
      },

      stdtime: 0,
      addstdtime: 0,

      headshow: 0,
      headObj: {},
      checkArr: [],
      tablehead,

      /**
       * 发卡
       */
      showtime: 0,
      studentinfo: {},

      fenbanshow: 0,
      id: ""
    };
  },

  components: {
    addstudent,
    daoru,
    studenthead,
    faka,
    fenban
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    },
    yx_cclist() {
      return this.$store.state.yx_cclist;
    },
    yx_qudao() {
      return this.$store.state.yx_qudao;
    }
  },
  methods: {
    setLocalStorage() {
      window.sessionStorage.setItem(
        "s_rx_time",
        JSON.stringify(this.s_rx_time)
      );
      window.sessionStorage.setItem("s_cc", this.s_cc);
      window.sessionStorage.setItem("s_qd", this.s_qd);
      window.sessionStorage.setItem("s_status", this.s_status);
      window.sessionStorage.setItem("s_search", this.s_search);
      window.sessionStorage.setItem("page", this.page);
      window.sessionStorage.setItem("limit", this.limit);
    },
    getLocalStorage() {

      this.s_rx_time = window.sessionStorage.getItem("s_rx_time")
        ? JSON.parse(window.sessionStorage.getItem("s_rx_time"))
        : this.s_rx_time;
      this.s_cc = window.sessionStorage.getItem("s_cc")
        ? window.sessionStorage.getItem("s_cc")
        : this.s_cc;

      this.s_qd = window.sessionStorage.getItem("s_qd")
        ? window.sessionStorage.getItem("s_qd")
        : this.s_qd;

      this.s_status = window.sessionStorage.getItem("s_status")
        ? window.sessionStorage.getItem("s_status")
        : this.s_status;

      this.s_search = window.sessionStorage.getItem("s_search")
        ? window.sessionStorage.getItem("s_search")
        : this.s_search;

      this.page = window.sessionStorage.getItem("page")
        ? window.sessionStorage.getItem("page")
        : this.page;

      this.limit = window.sessionStorage.getItem("limit")
        ? window.sessionStorage.getItem("limit")
        : this.limit;
    },
    fakafunc(obj) {
      this.studentinfo = obj;
      this.showtime = Date.now();
    },

    fenbanfunc(id) {
      this.fenbanshow = Date.now();
      this.id = id;
    },

    setheadshow() {
      this.headshow = Date.now();
    },

    getStudentHead() {
      this._NET
        .getTips({
          key: "student_tabhead"
        })
        .then(data => {
          if (data.code == "1") {
            this.headObj = data.data.student_tabhead
              ? JSON.parse(data.data.student_tabhead)
              : {};
            this.checkArr = this.headObj[this.mymange]
              ? this.headObj[this.mymange]
              : [];
          }
        });
    },

    serachFuns() {
      this.page = 1;
      this.getlist();
    },
    reset() {
      this.s_rx_time = [];
      this.s_status = "";
      this.s_search = "";
      this.s_cc = "";
      this.s_qd = "";
      this.page = 1;
      this.getlist();
    },
    handleCurrentChange(v) {
      this.page = v;
      this.getlist();
    },

    sizeChange(val) {
      this.page = 1;
      this.limit = val;
      this.getlist();
    },

    /**
     * 列表
     */
    getlist() {

      this.setLocalStorage();

      this.loading = true;

      let add_start_time = "";
      let add_end_time = "";

      if (this.s_rx_time && this.s_rx_time.length == 2) {
        add_start_time = parseInt(new Date(this.s_rx_time[0]).getTime() / 1000);
        add_end_time =
          parseInt(new Date(this.s_rx_time[1]).getTime() / 1000) +
          60 * 60 * 24 -
          1;
      }

      this._NET
        .jw_student_getlist({
          add_start_time: add_start_time,
          add_end_time: add_end_time,
          search: this.s_search ? this.s_search : "",
          page: this.page,
          status: this.s_status,
          limit: this.limit,
          course_consultant: this.s_cc,
          source: this.s_qd
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
    // 判断是否通过返回进入
    if (this.$route.query.callback) {
      this.getLocalStorage();
    } else {
      this.setLocalStorage();
    }

    this.getlist();
    this.getStudentHead();
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

.mb15 {
  margin-bottom: 15px;
}

.tablestyle {
  position: relative;
}

.fenye {
  padding: 0;
  margin-top: 24px;
  margin-bottom: 24px;
}

.sexicon {
  height: 16px;
  position: relative;
  top: 3px;
}
</style>


