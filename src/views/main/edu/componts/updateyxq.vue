<template>
  <el-dialog title="修改学员卡有效期" :visible.sync="show" width="600px">
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
          <el-form-item label="有效期至" prop="expire_end">
            <p>
              <el-checkbox v-model="isWuqixian">无期限</el-checkbox>
            </p>
            <el-date-picker
              :disabled="isWuqixian"
              v-model="form.expire_end"
              align="right"
              type="date"
              size="medium"
              style="width:150px"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <p class="error1" v-if="info.card_type_type == '3'">由于期限卡的特殊性，修改有效期相当于充值或扣费，请谨慎操作！</p>
          </el-form-item>
          <el-form-item label="修改原因">
            <el-input v-model="form.note" maxlength="500" type="textarea" size="medium"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="xiugaifunc" :loading="xloading">确 定</el-button>
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
      isWuqixian: false,
      form: {
        expire_end: "",
        note: ""
      },
      rules: {
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
            this.isWuqixian =
              this.info.expire_end && this.info.expire_end > 0 ? false : true;
            this.form.expire_end =
              this.info.expire_end && this.info.expire_end > 0
                ? new Date(this.info.expire_end * 1000)
                : "";
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    xiugaifunc() {
      if (!this.verification()) return;
      this.xloading = true;
      let expire_end = "";
      if (!this.isWuqixian) {
        expire_end = parseInt(this.form.expire_end.setHours(23, 59, 59) / 1000);
      }
      let data = {
        merchant_id: this.mymange,
        member_id: this.member_id,
        card_id: this.card_id,
        expire_end,
        note: this.form.note
      };

      this._NET
        .jw_student_card_delay(data)
        .then(data => {
          this.xloading = false;
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "修改成功"
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
      if (!this.isWuqixian) {
        if (!this.form.expire_end) {
          this._alert({
            type: "warning",
            msg: `请填写有效期`
          });
          return false;
        }
      }
      return true;
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

.error1 {
  font-size: 12px;
  color: @c;
  line-height: 16px;
  padding-top: 8px;
}
</style>
