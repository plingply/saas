<template>
  <div>
    <div class="btnbox">
      <el-button
        type="primary"
        :disabled="!edum_status"
        @click="$router.push({ name:'edu_setting_addcard' })"
      >添加学员卡</el-button>
    </div>
    <el-table :data="list" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <textbox :len="20" :text="scope.row.name"></textbox>
        </template>
      </el-table-column>
      <el-table-column prop="card_type" label="类型">
        <template slot-scope="scope">
          <span
            v-for="(item,index) in yx_config.card_type_list"
            :key="index"
            v-show="scope.row.card_type == index"
          >{{ item }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expiry_date" label="有效期">
        <template slot-scope="scope">
          <span v-if="scope.row.expiry_date > '0'">{{ scope.row.expiry_date }}个月</span>
          <span v-if="scope.row.expiry_date == '0'">无限期</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注">
        <template slot-scope="scope">
          <textbox :len="10" :text="scope.row.note"></textbox>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="tolinkInfo(scope.row.id)">详情</el-button>
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
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      list: [],
      count: 0,
      limit: 10,
      page: 1
    };
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    },
    edum_status() {
      return this.$store.state.edum_status;
    }
  },

  methods: {
    setLocalStorage() {
      window.sessionStorage.setItem("page", this.page);
      window.sessionStorage.setItem("limit", this.limit);
    },

    getLocalStorage() {
      this.page = window.sessionStorage.getItem("page")
        ? window.sessionStorage.getItem("page")
        : this.page;
      this.limit = window.sessionStorage.getItem("limit")
        ? window.sessionStorage.getItem("limit")
        : this.limit;
    },

    sizeChange(v) {
      this.limit = v;
      this.page = 1;
      this.getList();
    },
    handleCurrentChange(v) {
      this.page = v;
      this.getList();
    },
    getList() {
      this.setLocalStorage();

      this.loading = true;
      this._NET
        .jw_card_list({
          merchant_id: this.mymange,
          limit: this.limit,
          page: this.page
        })
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this.list = data.data.item;
            this.count = data.data.count;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    tolinkInfo(id) {
      this.$router.push({ name: "edu_setting_info", params: { id } });
    }
  },

  created() {
    // 判断是否通过返回进入
    if (this.$route.query.callback) {
      this.getLocalStorage();
    } else {
      this.setLocalStorage();
    }

    this.getList();
  }
};
</script>

<style lang="less" scoped>
.btnbox {
  margin-bottom: 8px;
}
</style>

