<template>
  <div>
    <div class="title">
      <span>扣费记录</span>
      <el-button type="text" @click="backFunc">返回学员卡</el-button>
    </div>
    <el-table :data="list" style="width: 100%" size="medium" v-loading="loading">
      <el-table-column label="学员卡" prop="card_type_name"></el-table-column>
      <el-table-column label="扣费类型" prop="deduct_type"></el-table-column>
      <el-table-column label="余额变化" prop="change_num">
      </el-table-column>
      <el-table-column label="操作人" prop="operater_user_name"></el-table-column>
      <el-table-column label="时间" prop="created_at">
        <template slot-scope="scope">
          {{ scope.row.created | yyyy_mm_dd_H_M }}
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
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
      limit: 10,
      page: 1,
      count: 0
    };
  },
  methods: {
      
    backFunc() {
      this.$router.go(-1);
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
      this.loading = true;
      this._NET.jw_student_card_delaylist({
        campus_id: this.campus_id,
        member_id: this.$route.params.id,
        card_id: this.$route.params.card_id,
        limit: this.limit,
        page: this.page
      }).then(data=>{
          this.loading = false
          if(data.code == 1){
              this.list = data.data.item
              this.count = data.data.count
          }
      }).catch(err=>{
          this.loading = false
      })
    }
  },
  created() {
      this.getList()
  },
};
</script>

<style lang="less" scoped>
@import "../../../../../less/style.less";
.title {
  > span {
    font-size: 16px;
    color: @c1;
    margin-right: 16px;
    line-height: 1;
  }
}
</style>
