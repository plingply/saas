<template>
  <div v-loading="xloading">
    <div class="yx_title">
      <span>学员卡详情</span>
      <div class="btnbox">
        <span class="y_link" @click="$router.push({ name: 'edu_setting_card',query:{ callback: true } })">返回上一层</span>
        <el-button plain :disabled="!edum_status" @click="deleteFun($route.params.id)">删除</el-button>
        <el-button
          type="primary"
          :disabled="!edum_status"
          @click="tolinkEditor($route.params.id)"
        >编辑</el-button>
      </div>
    </div>
    <el-form ref="xform" :model="info" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="学员卡名称">{{ info.name }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="卡类型">{{ card_type }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="有效期">
            <span v-if="info.expiry_date > 0">{{ info.expiry_date }}个月</span>
            <span v-if="info.expiry_date == 0">无限期</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注">{{ info.note }}</el-form-item>
      <el-form-item label="关联课程">
        <div class="error" v-if="card_consume_rule.length == 0">未开启课程关联设置</div>
        <span v-for="(item,index) in card_consume_rule" :key="index">
          <span>{{ item.course_name }}</span>
          <span v-if="info.card_type != '3'">({{ item.num }}{{ info.card_type | unit }}/课)</span>
          <span v-if="index < card_consume_rule.length - 1">，</span>
        </span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
      card_consume_rule: [],
      xloading: false
    };
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    },
    edum_status() {
      return this.$store.state.edum_status;
    },
    card_type() {
      let res = this.yx_config.card_type_list[this.info.card_type]
        ? this.yx_config.card_type_list[this.info.card_type]
        : "";
      return res;
    }
  },

  methods: {
    /**
     * 卡详情
     */
    getInfo() {
      this.xloading = true;
      this._NET
        .jw_card_info({
          merchant_id: this.mymange,
          id: this.$route.params.id
        })
        .then(data => {
          this.xloading = false;
          if (data.status == "ok") {
            this.info = data.data;
            this.card_consume_rule = data.data.card_consume_rule;
          }
        })
        .catch(err => {
          this.xloading = false;
        });
    },

    tolinkEditor(id) {
      this.$router.push({ name: "edu_setting_editorcard", params: { id } });
    },

    deleteFun(id) {
      this.$confirm("是否确定删除此学员卡?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._NET
            .jw_card_delete({
              merchant_id: this.mymange,
              id
            })
            .then(data => {
              if (data.status == "ok") {
                this._alert({
                  type: "success",
                  msg: "删除成功"
                });
                this.$router.push({ name: "edu_setting_card" });
              }
            });
        })
        .catch(() => {});
    }
  },

  created() {
    this.getInfo();
  }
};
</script>


<style lang="less" scoped>
.yx_title {
  margin-top: 0;
}
</style>
