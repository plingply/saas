<template>
  <div v-loading="xloading" class="infobox">
    <div class="banner_title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'edu_course_list' }">
          <span>课程管理</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>课程详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box_info">
      <div class="yx_title">
        <span>课程详情</span>
        <div class="btnbox">
          <span class="y_link" @click="$router.push({ name: 'edu_course_list',query:{ callback: true } })">返回上一层</span>
          <el-button  plain @click="deleteFun($route.params.id)">删除</el-button>
          <el-button
            type="primary"
            @click="tolinkEditor($route.params.id)"
          >编辑</el-button>
        </div>
      </div>
      <el-form ref="xform" :model="info" label-width="100px">
        <el-form-item label="课程名称">{{ info.name }}</el-form-item>
        <el-form-item label="课程状态">
          <span v-if="info.status == '1'">启用</span>
          <span v-if="info.status == '2'">停用</span>
        </el-form-item>
        <el-form-item label="备注">{{ info.remark?info.remark:'--' }}</el-form-item>
        <el-form-item label="关联学员卡">
          <div class="error" v-if="card_consume_rule.length == 0">未设置学员卡</div>
          <div v-for="(item,index) in card_consume_rule" :key="index">
            <span>
              <span
                class="c"
                v-if="yx_config.card_type_list"
              >[{{ yx_config.card_type_list[item.card_type] }}]</span>
              <span>{{ item.card_type_name }}</span>
              <span v-if="item.card_type != '3'">(每节课/{{ item.num }}{{ item.card_type | unit }})</span>
            </span>
          </div>
        </el-form-item>
      </el-form>
    </div>
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
    }
  },

  methods: {
    /**
     * 详情
     */
    getInfo() {
      this.xloading = true;
      this._NET
        .jw_course_info({
          campus_id: this.campus_id,
          id: this.$route.params.id
        })
        .then(data => {
          this.xloading = false;
          if (data.code == "1") {
            this.info = data.data;
            this.card_consume_rule = data.data.card_consume_rule;
          }
        })
        .catch(err => {
          this.xloading = false;
        });
    },

    tolinkEditor(id) {
      this.$router.push({ name: "edu_course_editor", params: { id } });
    },

    deleteFun(id) {
      this.$confirm("是否删除此课程?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deletePost(id, 0);
        })
        .catch(() => {});
    },

    deletePost(id, confirm) {
      this._NET
        .jw_course_delete(
          {
            campus_id: this.campus_id,
            id,
            confirm
          },
          true
        )
        .then(data => {
          if (data.code == "1") {
            this._alert({
              type: "success",
              msg: "删除成功"
            });
            this.$router.push({ name: "edu_course_list" });
          } else {
            if (data.code == 1000) {
              this.$confirm(data.msg, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  this.deletePost(id, 1);
                })
                .catch(() => {});
            } else {
              this._alert({
                type: "warning",
                msg: data.msg
              });
            }
          }
        });
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
