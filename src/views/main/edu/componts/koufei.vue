<template>
  <el-dialog title="学员卡扣费" :visible.sync="show" width="600px">
    <el-form v-loading="loading" ref="form" :model="form" :rules="rules" label-width="80px">
      <div class="inbox">
        <div class="row">
          <span>学员姓名</span>
          <div>{{ info.member_info?info.member_info.name:"" }}</div>
        </div>
        <div class="row">
          <span>性别</span>
          <div>{{ info.member_info?info.member_info.sex:"" }}</div>
        </div>
        <div class="row">
          <span>联系电话</span>
          <div>{{ info.member_info?info.member_info.phone:"" }} | {{ info.member_info?info.member_info.phone_belong:"" | phone_belong }}</div>
        </div>
        <div class="row">
          <span>卡类型</span>
          <div>{{ yx_config && yx_config.card_type_list ? yx_config.card_type_list[info.card_type_type]:'' }}</div>
        </div>
        <div class="row">
          <span>卡名称</span>
          <div>{{ info.card_type_name }}</div>
        </div>
        <div class="row">
          <span>卡内余额</span>
          <div>
            <yuee
              :card_type_type="info.card_type_type"
              :expire_end="info.expire_end"
              :num="info.num_residue"
            ></yuee>
          </div>
        </div>
        <div class="row">
          <span>有效期至</span>
          <div>
            <yxq :status="info.status" :expire_end="info.expire_end" :isshowmonth="true"></yxq>
          </div>
        </div>

        <div class="formbox">
          <el-form-item label="扣费金额" prop="num" v-if="info.card_type_type == '1'">
            <el-input style="width:120px" @input="sumInput" v-model="form.num" size="medium"></el-input>&nbsp;元
          </el-form-item>
          <el-form-item
            label="扣费课时"
            prop="num"
            @input="sumInput_ks"
            v-if="info.card_type_type == '2'"
          >
            <el-input style="width:120px" v-model="form.num" size="medium"></el-input>&nbsp;课时
          </el-form-item>

          <el-form-item label="扣费原因">
            <el-input v-model="form.note" maxlength="500" type="textarea" size="medium"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="koufeifun" :loading="xloading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import yuee from "./yu_e";
import yxq from "./yxq";
export default {
  props: ["showtime", "card_id", "member_id"],
  data() {
    return {
      loading: false,
      xloading: false,
      show: false,

      info: {},
      form: {
        num: "",
        note:""
      },
      rules: {
        num: [{ required: true, message: " ", trigger: "blur" }]
      }
    };
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    }
  },

  watch: {
    showtime() {
      this.show = true;
      this.form.num = "";
      this.getStudentCardInfo();
    }
  },

  components: {
    yuee,
    yxq
  },

  methods: {
    getStudentCardInfo() {
      this.loading = true;
      this._NET
        .jw_student_cardinfo({
          campus_id: this.campus_id,
          member_id: this.member_id,
          card_id: this.card_id
        })
        .then(data => {
          this.loading = false;
          if (data.code == 1) {
            this.info = data.data;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    koufeifun() {
      if (!this.verification()) return;
      this.xloading = true;
      let data = {
        campus_id: this.campus_id,
        member_id: this.member_id,
        card_id: this.card_id,
        num: this.form.num,
        note: this.form.note
      };

      this._NET
        .jw_student_card_deduct(data)
        .then(data => {
          this.xloading = false;
          if (data.code == 1) {
            this._alert({
              type: "success",
              msg: "扣费成功"
            });
            this.show = false;
            this.$emit("callback");
          }
        })
        .catch(err => {
          this.xloading = false;
        });
    },

    verification() {
      if (!this.form.num || this.form.num <= 0) {
        let m = this.info.card_type_type == "1" ? "金额" : "课时";
        this._alert({
          type: "warning",
          msg: `扣费${m}必须大于0`
        });
        return false;
      }
      return true;
    },

    sumInput(v) {
      this.form.num = this.$utils.priceFormat(v);
    },
    sumInput_ks(v) {
      this.form.num = this.$utils.priceFormat(v, 5, 1);
    }
  }
};
</script>


<style lang="less" scoped>
@import "../../../../less/style.less";
.inbox {
  width: 400px;
  margin: 0 auto;
  .row {
    display: flex;
    line-height: 1;
    margin-bottom: 16px;
    align-items: center;
    > span {
      width: 100px;
      text-align: right;
      margin-right: 12px;
      color: @c2;
    }
    > div {
      color: @c1;
    }
  }
}

.formbox {
  border-top: 1px solid @bd1;
  padding-top: 24px;
}

.crow {
  margin-bottom: 4px;
  > span {
    margin-right: 8px;
  }
}
</style>
