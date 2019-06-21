<template>
  <div>
    <div class="btnbox">
      <el-button
        type="primary"
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
      <el-table-column prop="month" label="有效期">
        <template slot-scope="scope">
          <span v-if="scope.row.month > '0'">{{ scope.row.month }}个月</span>
          <span v-if="scope.row.month == '0'">无限期</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope">
          <textbox :len="10" :text="scope.row.remark"></textbox>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="tolinkInfo(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      list: []
    };
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    }
  },

  methods: {

    getList() {

      this.loading = true;
      this._NET
        .jw_card_list({
          campus_id : this.campus_id
        })
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            this.list = data.data;
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
    this.getList();
  }
};
</script>

<style lang="less" scoped>
.btnbox {
  margin-bottom: 8px;
}
</style>

