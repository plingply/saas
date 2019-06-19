<template>
  <el-dialog title="充值" :visible.sync="show" width="600px">
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
              :status="info.status"
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
          <el-form-item label="充值金额" prop="num" v-if="info.card_type_type == '1'">
            <el-input style="width:120px" @input="sumInput" v-model="form.num" size="medium"></el-input>&nbsp;元
          </el-form-item>
          <el-form-item
            label="充值课时"
            prop="num"
            @input="sumInput_ks"
            v-if="info.card_type_type == '2'"
          >
            <el-input style="width:120px" v-model="form.num" size="medium"></el-input>&nbsp;课时
          </el-form-item>
          <el-form-item label="充值期限" prop="num" v-if="info.card_type_type == '3'">
            <div class="crow">
              <el-input style="width:60px" size="medium" v-model="form.num" @input="yxqInput"></el-input>
              <span>个月</span>
              <el-radio-group v-model="form.num" @change="getmonth">
                <el-radio-button label="3">3个月</el-radio-button>
                <el-radio-button label="6">6个月</el-radio-button>
                <el-radio-button label="12">12个月</el-radio-button>
              </el-radio-group>

            </div>
          </el-form-item>

          <el-form-item
            label="有效期"
            prop="expire_end"
            v-if="info.card_type_type == '1' || info.card_type_type == '2'"
          >
            <el-date-picker
              v-model="form.expire_end"
              align="right"
              type="date"
              size="medium"
              style="width:150px"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              :disabled="info.expire_end == '0'"
            ></el-date-picker>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="chongzhifun" :loading="xloading">确 定</el-button>
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
        expire_end: ""
      },
      rules: {
        num: [{ required: true, message: " ", trigger: "blur" }],
        expire_end: [{ required: true, message: " ", trigger: "blur" }]
      },

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 3600 * 24;
        },
        shortcuts: [
          {
            text: "三个月",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", date);
            }
          },
          {
            text: "六个月",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 180);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一年",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 365);
              picker.$emit("pick", date);
            }
          }
        ]
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
      this.form.expire_end = "";
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
          merchant_id: this.mymange,
          member_id: this.member_id,
          card_id: this.card_id
        })
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this.info = data.data;
            this.form.expire_end =
              Number(this.info.expire_end) > 0
                ? new Date(this.info.expire_end * 1000)
                : "";
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    chongzhifun() {
      if (!this.verification()) return;
      this.xloading = true;
      let expire_end = "0";
      if (this.info.card_type_type == "1" || this.info.card_type_type == "2") {
        if (this.info.expire_end > 0) {
          expire_end = parseInt(
            this.form.expire_end.setHours(23, 59, 59) / 1000
          );
        }
      }
      if (this.info.card_type_type == "3") {
        if (this.info.expire_end > 0) {
          expire_end =
            parseInt(this.info.expire_end) + this.form.num * 3600 * 24 * 30;
        }
      }

      let data = {
        merchant_id: this.mymange,
        member_id: this.member_id,
        card_id: this.card_id,
        num: this.form.num,
        expire_end
      };

      this._NET
        .jw_student_card_recharge(data)
        .then(data => {
          this.xloading = false;
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "充值成功"
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
      if (this.info.card_type_type == "1" || this.info.card_type_type == "2") {
        if (!this.form.num || this.form.num <= 0) {
          let m = this.info.card_type_type == "1" ? "金额" : "课时";
          this._alert({
            type: "warning",
            msg: `充值${m}必须大于0`
          });
          return false;
        }

        if (this.info.expire_end > 0) {
          if (!this.form.expire_end) {
            this._alert({
              type: "warning",
              msg: `请选择有效期`
            });
            return false;
          } else {
            if (
              this.info.expire_end >
              parseInt(this.form.expire_end.setHours(23, 59, 59) / 1000)
            ) {
              this._alert({
                type: "warning",
                msg: `有效期只能延后`
              });
              return false;
            }
          }
        }
      }

      if (this.info.card_type_type == "3") {
        if (!this.form.num) {
          this._alert({
            type: "warning",
            msg: `请输入有效期`
          });
          return false;
        }
      }
      return true;
    },

    yxqInput(v) {
      v = v.replace(/[^\d]/gi, "");
      v = v ? parseInt(v) : "";
      if (v > 99) v = 99;
      if (v < 0) v = 0;
      if (v <= 0) {
        this.form.expire_end = "";
      } else {
        this.form.expire_end = new Date(
          Date.now() + v * 1000 * 60 * 60 * 24 * 30
        );
      }
      this.form.num = v;
    },

    sumInput(v) {
      this.form.num = this.$utils.priceFormat(v);
    },
    sumInput_ks(v) {
      this.form.num = this.$utils.priceFormat(v, 5, 1);
    },

    getmonth(v) {
      if (v <= 0) {
        this.form.expire_end = "";
      } else {
        this.form.expire_end = new Date(
          Date.now() + v * 1000 * 60 * 60 * 24 * 30
        );
      }
      this.form.num = v;
    }
  },

  created() {}
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
