<template>
  <el-dialog title="分班" :visible.sync="show" width="400px">
    <div class="addbox">
      <el-form ref="form" :model="{}" label-width="70px" label-position="right">
        <el-form-item label="班级">
          <el-select v-model="grade_id" placeholder="请选择班级">
            <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="tiaobanFunc" :loading="xloading">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["showtime", "member_id"],
  data() {
    return {
      show: false,
      grade_id: "",
      classList: []
    };
  },

  watch: {
    showtime() {
      this.grade_id = "";
      this.show = true;
      this.getList();
    }
  },

  methods: {
    tiaobanFunc() {
      if (!this.grade_id) {
        this._alert({
          msg: "请选择班级",
          type: "warning"
        });
        return;
      }

      this._NET
        .jw_class_addMember({
          merchant_id: this.mymange,
          member_ids: this.member_id,
          grade_id: this.grade_id
        })
        .then(data => {
          this.show = false;
          if (data.status == "ok") {
            this._alert({
              msg: "分班成功",
              type: "success"
            });
            this.$emit("callback");
          }
        });
    },

    getList() {
      this._NET
        .jw_student_class_list({
          merchant_id: this.mymange,
          member_id: this.member_id,
          type: "1"
        })
        .then(data => {
          if (data.status == "ok") {
            this.classList = data.data.item;
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.addbox {
  width: 260px;
  margin: 0 auto;
}
</style>

