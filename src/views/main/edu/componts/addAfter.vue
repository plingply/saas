<template>
  <div>
    <el-dialog title="添加成功" :visible.sync="show" width="500px">
      <div class="addbox">
        <div class="tishibox">
          <div class="left">
            <i class="el-icon-success"></i>
          </div>
          <div class="right">
            <h1>学员添加成功</h1>
            <p>是否立即为该学员发放学员卡？</p>
          </div>
        </div>
        <div class="linkbox">
          <a class="y_link" @click="sfcallback">立即收费（请让用户出示付款码）</a>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="show = false">稍后处理</el-button>
        <el-button type="primary" @click="fakafunc">立即发卡</el-button>
      </span>
    </el-dialog>

    <!-- 发卡 -->
    <faka :student-info="studentInfo" :showtime="fakashow" @callback="callback"></faka>

  </div>
</template>

<script>
import faka from "./faka.vue"

export default {
  props: ["showtime","studentInfo"],

  data() {
    return {
      show: false,
      saomashow: 0,
      fakashow: 0
    };
  },

  components: {
    faka
  },

  watch: {
    showtime() {
      this.show = true;
    }
  },

  methods: {
    // 收费回调
    sfcallback() {
      this.show = false;
      setTimeout(() => {
        this.saomashow = Date.now();
      }, 300);
    },

    callback(){
      this.$emit("callback")
    },

    fakafunc(){
      this.show = false
      this.fakashow = Date.now()
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../less/style.less";

.addbox {
  width: 80%;
  margin: 0 auto;
  .linkbox {
    padding-top: 12px;
    padding-left: 80px;
  }
  .tishibox {
    display: flex;
    align-items: center;
    .left {
      width: 80px;
      height: 80px;
      line-height: 80px;
      min-width: 80px;
      font-size: 50px;
      color: @c;
    }

    .right {
      flex: 1;
      line-height: 1;
      h1 {
        font-size: 16px;
        margin-bottom: @px * 4px;
        color: @c1;
        font-weight: bold;
      }
      p {
        font-size: 14px;
        counter-reset: @c2;
      }
    }
  }
}
</style>
