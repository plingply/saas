<template>
  <el-dialog title="设置表头" :visible.sync="dialogVisible" width="550px">
    <div>
      <el-checkbox-group v-model="checkarr" @change="changes">
        <div class="tabheadbox">
          <div v-for="(item,index) in tablehead" :key="index" class="tabheadrow">
            <el-checkbox :label="item.value" :disabled="item.disabled">{{ item.name }}</el-checkbox>
          </div>
        </div>
      </el-checkbox-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="setTablehead" :loading="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import tablehead from "@/util/student_head";
export default {
  props: ["show", "headObj"],
  data() {
    return {
      dialogVisible: false,
      checkarr: [],
      tablehead,
      loading: false
    };
  },

  watch: {
    show() {
      this.dialogVisible = true;
      this.checkarr = this.headObj[this.mymange]
        ? this.headObj[this.mymange]
        : [];
    }
  },

  methods: {
    changes() {
      this.headObj[this.mymange] = this.checkarr;
    },

    // 设置自定义标签
    setTablehead() {
      this.loading = true;
      this._NET
        .setTips({
          key: "student_tabhead",
          value: JSON.stringify(this.headObj)
        })
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "设置成功"
            });
            this.dialogVisible = false;
            this.$emit("callback");
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  }
};
</script>


<style lang="less" scoped>
.tabheadbox {
  width: 440px;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  > div {
    width: 50%;
    margin-bottom: 15px;
  }
}
</style>
