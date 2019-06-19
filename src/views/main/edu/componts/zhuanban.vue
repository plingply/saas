<template>
  <el-dialog title="转至其他班" :visible.sync="show" width="400px">
    <div class="addbox">
      <el-form ref="form" :model="{}" label-width="70px" label-position="right">
        <el-form-item label="目标班级">
          <el-select v-model="new_grade_id" placeholder="请选择目标班级">
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
  props: ["showtime", "old_grade_id", "member_id"],
  data() {
    return {
      show: false,
      new_grade_id: "",
      classList: []
    };
  },

  watch: {
    showtime() {
      this.new_grade_id = "";
      this.show = true;
      this.getList();
    }
  },

  methods: {
    tiaobanFunc() {
      if (!this.new_grade_id) {
        this._alert({
          msg: "请选择目标班级",
          type: "warning"
        });
        return;
      }

      this._NET
        .jw_class_changeMember({
          merchant_id: this.mymange,
          member_id: this.member_id,
          old_grade_id: this.old_grade_id,
          new_grade_id: this.new_grade_id
        })
        .then(data => {
          this.show = false;
          if (data.status == "ok") {
            this._alert({
              msg: "转班成功",
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

