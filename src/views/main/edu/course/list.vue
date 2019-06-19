<template>
  <div class="autobox">
    <div class="banner_title">
      <span>课程管理</span>
    </div>

    <div class="btnbox">
      <el-button type="primary"  @click="tolinkadd">
        <i class="el-icon-plus"></i>添加课程
      </el-button>
    </div>

    <div class="searchbox">
      <div>
        <span style="margin-right:5px">支持学员卡</span>
        <el-select
          v-model="card_type"
          filterable
          placeholder="选择学员卡"
          style="width:150px;margin-right:10px"
          class="mb15"
        >
          <el-option :label="item.name" :value="item.id" :key="key" v-for="(item,key) in cardlist"></el-option>
        </el-select>
      </div>

      <div>
        <span style="margin-right:5px">状态</span>
        <el-select
          v-model="status"
          filterable
          placeholder="选择状态"
          style="width: 150px; margin-right: 10px"
          class="mb15"
        >
          <el-option label="启用" value="1"></el-option>
          <el-option label="停用" value="2"></el-option>
        </el-select>
      </div>

      <el-input
        class="mb15"
        placeholder="课程名称"
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
        <el-table-column label="课程名称" prop="name">
          <template slot-scope="scope">
            <textbox :len="10" :text="scope.row.name"></textbox>
          </template>
        </el-table-column>
        <el-table-column label="支持学员卡" prop>
          <template slot-scope="scope">
            <div class="warning" v-if="scope.row.card_type_list.length == 0">
              <span @click="tolinkeditor(scope.row.id)" class="y_link">未设置</span>
            </div>
            <div v-if="scope.row.card_type_list.length == 1">
              {{ scope.row.card_type_list[0].card_type_name }}
              <span
                v-if="scope.row.card_type_list[0].card_type !='3'"
              >({{ scope.row.card_type_list[0].num }}{{ scope.row.card_type_list[0].card_type | unit }}/课)</span>
            </div>
            <div v-if="scope.row.card_type_list.length > 1">
              <el-tooltip placement="top">
                <div slot="content">
                  <p v-for="(item,index) in scope.row.card_type_list" :key="index">
                    {{ item.card_type_name }}
                    <span v-if="item.card_type !='3'">({{ item.num }}{{ item.card_type | unit }}/课)</span>
                  </p>
                </div>
                <span>
                  {{ scope.row.card_type_list[0].card_type_name }}
                  <span
                    v-if="scope.row.card_type_list[0].card_type !='3'"
                  >({{ scope.row.card_type_list[0].num }}{{ scope.row.card_type_list[0].card_type | unit }}/课)</span>...
                </span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'">启用</span>
            <span v-if="scope.row.status == '2'">停用</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="note">
          <template slot-scope="scope">
            <textbox :len="10" :text="scope.row.note"></textbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <ui-button type="danger text" size="mini" @click="tolink(scope.row.id)">详情</ui-button>
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
  </div>
</template>
<script>
export default {
  name: "course_list",
  data() {
    return {
      loading: false,
      card_type: "",
      status: "",
      search: "",
      cardlist: [],

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
      addstdtime: 0
    };
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    }
  },
  methods: {

    setLocalStorage() {
      window.sessionStorage.setItem("card_type", this.card_type);
      window.sessionStorage.setItem("status", this.status);
      window.sessionStorage.setItem("search", this.search);
      window.sessionStorage.setItem("page", this.page);
      window.sessionStorage.setItem("limit", this.limit);
    },

    getLocalStorage() {
      this.card_type = window.sessionStorage.getItem("card_type")
        ? window.sessionStorage.getItem("card_type")
        : this.card_type;
      this.status = window.sessionStorage.getItem("status")
        ? window.sessionStorage.getItem("status")
        : this.status;
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

    tolinkadd() {
      this.$router.push({ name: "edu_course_add" });
    },
    tolinkeditor(id) {
      this.$router.push({ name: "edu_course_editor", params: { id } });
    },
    serachFuns() {
      this.page = 1;
      this.getlist();
    },
    reset() {
      this.card_type = "";
      this.status = "";
      this.search = "";

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

      this.setLocalStorage()

      this.loading = true;
      this._NET
        .jw_course_list({
          page: this.page,
          limit: this.limit,
          search: this.search,
          status: this.status,
          card_type_ids: this.card_type
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

    tolink(id) {
      this.$router.push({ name: "edu_course_info", params: { id } });
    },

    getcardList() {
      this._NET
        .jw_card_list({
          limit: 1000,
          page: 1
        })
        .then(data => {
          if (data.code == "1") {
            this.cardlist = data.data.item;
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

    this.getcardList();
    this.getlist();
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
</style>


