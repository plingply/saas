<template>
  <el-dialog title="批量分配" :visible.sync="dialogVisible" width="450px">
    <div class="xs_content">
      <p class="tx">
        已选择
        <span>{{ list.length }}</span>名意向学员
      </p>
      <el-form ref="form" :model="{}" label-width="80px">
        <el-form-item label="课程顾问">
          <el-select v-model="kcgw" placeholder="请选择">
            <el-option
              :label="item.user_remark"
              :value="item.id"
              v-for="(item,index) in yx_cclist"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="fenpeifun" :loading="loading">分配</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["show", "list"],
  data() {
    return {
      dialogVisible: false,
      loading: false,
      kcgw: ""
    };
  },

  watch: {
    show() {
      this.dialogVisible = true;
    }
  },

  computed: {
    yx_cclist() {
      return this.$store.state.yx_cclist;
    }
  },

  methods: {
    fenpeifun() {
      if (!this.kcgw || this.kcgw == "") {
        this._alert({
          type: "warning",
          msg: "请选择课程顾问"
        });
        return;
      }
      let arr = [];
      this.list.map(item => {
        arr.push(item.member_id);
      });
      this._NET
        .yw_yz_batchallocation({
          merchant_id: this.mymange,
          member_ids: arr.join(","),
          course_consultant: this.kcgw
        })
        .then(data => {
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "分配成功"
            });

            this.$emit("callback")

            this.dialogVisible = false;
            this.kcgw = "";
          }
        });
    }
  }
};
</script>


<style lang="less" scoped>
@import "../../../../less/style.less";

.xs_content {
  width: 274px;
  margin: 0 auto;
}

.tx {
  font-size: 14px;
  color: @c1;
  padding-left: 13px;
  margin-bottom: 15px;
  span {
    color: @c;
  }
}
</style>
