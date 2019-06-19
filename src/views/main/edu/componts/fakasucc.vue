<template>
  <div>
    <el-dialog title="发卡成功" :visible.sync="show" width="400px">
      <div class="contents">
        <div class="title">
          <i class="el-icon-success"></i>
          <span>学员发卡成功</span>
        </div>
        <div class="btnbox">
          <span class="y_link" @click="tolinkfb">分班</span>
          <span class="y_link" @click="koufei" v-if="cardinfo.card_type != '3'">直接扣费</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">稍后处理</el-button>
        <el-button type="primary" @click="show = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["showtime", "id", "member_id", "cardinfo"],

  data() {
    return {
      show: false
    };
  },

  watch: {
    showtime() {
      this.show = true;
    }
  },

  methods: {
    koufei() {
      this.show = false;

      if (this.$route.name != "edu_student_card") {
        this.$router.push({
          name: "edu_student_card",
          params: { id: this.member_id },
          query: {
            cardid: this.id,
            member_id: this.member_id
          }
        });
      } else {
        this.$root.$emit("koufeiEvent", {
          id: this.id,
          member_id: this.member_id
        });
      }
    },

    tolinkfb() {
      this.$router.push({
        name: "edu_student_class",
        params: {
          id: this.member_id
        },
        query: {
          open: true
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../less/style.less";

.contents {
  width: 300px;
  margin: 0 auto;
}
.title {
  font-size: 16px;
  color: @c1;
  display: flex;
  align-items: flex-start;
  i {
    color: @c;
    font-size: 40px;
    margin-right: 16px;
  }
  span {
    padding-top: 4px;
  }
}

.btnbox {
  padding-left: 56px;
  span {
    margin-right: 16px;
  }
}
</style>
