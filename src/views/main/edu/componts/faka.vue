<template>
  <div>
    <el-dialog title="发卡" :visible.sync="show" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <div class="_infobox">
          <p>{{ studentInfo.name }}</p>
          <div>{{ studentInfo.sex }} | {{ studentInfo.phone }} | {{ studentInfo.phone_belong | phone_belong }}</div>
        </div>
        <div class="inbox">
          <el-form-item label="卡类型" prop="card_type">
            <el-select v-model="card_type" style="width:85%" size="medium" placeholder="请选择卡类型">
              <el-option
                v-for="(item,key) in yx_config.card_type_list"
                :key="key"
                :label="item"
                :value="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="卡名称" prop="card_type_id">
            <el-select v-model="card_type_id" style="width:85%" size="medium" placeholder="请选择学员卡">
              <el-option
                v-for="(item,key) in cardlist"
                v-if="card_type == item.card_type"
                :key="key"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="充值金额" prop="num_sum" v-show="card_type == '1'">
            <el-input
              style="width: 85%"
              v-model="form.num_sum"
              @input="sumInput"
              maxlength="10"
              size="medium"
            ></el-input>
            <span>&nbsp;元</span>
          </el-form-item>
          <el-form-item label="充值课时" prop="num_sum" v-show="card_type == '2'">
            <el-input
              style="width:85%"
              v-model="form.num_sum"
              @input="sumInput_ks"
              maxlength="10"
              size="medium"
            ></el-input>
            <span>&nbsp;课时</span>
          </el-form-item>
          <el-form-item label="有效期" prop="expiry_month">
            <div class="crow">
              <el-input
                v-show="form.expiry_month != '-1' && form.expiry_month != '-2'"
                style="width:60px"
                size="medium"
                v-model="form.expiry_month"
                @input="yxqInput"
              ></el-input>
              <el-input
                v-show="form.expiry_month == '-1' || form.expiry_month == '-2'"
                style="width:60px"
                size="medium"
                disabled
              ></el-input>
              <span>个月</span>

              <el-radio-group size="mini" v-model="form.expiry_month" @change="getmonth">
                <el-radio-button label="3">3个月</el-radio-button>
                <el-radio-button label="6">6个月</el-radio-button>
                <el-radio-button label="12">12个月</el-radio-button>
                <el-radio-button label="-1">无期限</el-radio-button>
                <el-radio-button label="-2" v-show="is_auto_active">自定义</el-radio-button>
              </el-radio-group>
            </div>
            <div class="kaika">
              <el-checkbox v-model="is_auto_active">立即开卡</el-checkbox>
              <div v-show="is_auto_active" class="flex">
                <span
                  class="youxiaoqi"
                  v-show="form.expiry_month != '-2' && form.expiry_month != ''"
                >有效期至：{{ expire_end | timeformat }}</span>
                <span class="youxiaoqi" v-show="form.expiry_month == ''">有效期至：--</span>
                <el-date-picker
                  v-show="form.expiry_month == '-2'"
                  v-model="expire_end"
                  type="date"
                  style="width:150px"
                  placeholder="到期时间"
                  size="small"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="note" type="textarea" maxlength="500" size="medium"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="addfun" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 发卡成功 -->
    <fakasucc
      :showtime="fakasuccShow"
      :cardinfo="cardinfo"
      :id="fakaSuccId"
      :member_id="studentInfo.member_id"
    ></fakasucc>
  </div>
</template>

<script>
import fakasucc from "./fakasucc.vue";
export default {
  props: ["showtime", "studentInfo"],
  data() {
    return {
      loading: false,
      show: false,

      cardlist: [],

      card_type: "",
      card_type_id: "",
      cardinfo: {},
      note: "",
      form: {
        num_sum: "",
        expiry_month: ""
      },

      is_auto_active: true,
      expire_end: "",

      rules: {
        card_type: [{ required: true, message: " ", trigger: "blur" }],
        card_type_id: [{ required: true, message: " ", trigger: "blur" }],
        num_sum: [{ required: true, message: " ", trigger: "blur" }],
        expiry_month: [{ required: true, message: " ", trigger: "blur" }]
      },

      fakasuccShow: 0,

      fakaSuccId: 0,

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 3600 * 24;
        }
      }
    };
  },

  components: {
    fakasucc
  },

  filters: {
    timeformat(val) {
      if (!val || val == 0 || val == "") return "永久";
      var date = new Date(val);
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
      );
    }
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    }
  },

  watch: {
    card_type() {
      this.card_type_id = "";
      this.form.num_sum = "";
    },

    card_type_id(v) {
      this.cardlist.forEach(item => {
        if (item.id == v) {
          this.cardinfo = item;
        }
      });
    },

    is_auto_active(v) {
      if (v) {
        if (this.form.expiry_month && this.form.expiry_month > 0) {
          this.expire_end = new Date(
            Date.now() + this.form.expiry_month * 1000 * 60 * 60 * 24 * 30
          );
        } else {
          this.expire_end = "";
        }
      } else {
        this.expire_end = "";
        this.form.expiry_month =
          this.form.expiry_month == "-2" ? "" : this.form.expiry_month;
      }
    },

    showtime() {
      this.show = true;
    }
  },

  methods: {
    openChongzhi() {
      this.chongzhitime = Date.now();
    },

    yxqInput(v) {
      v = v.replace(/[^\d]/gi, "");
      v = v ? parseInt(v) : "";
      if (v > 99) v = 99;
      if (v < 0) v = 0;
      if (v <= 0) {
        this.expire_end = "";
      } else {
        this.expire_end = new Date(Date.now() + v * 1000 * 60 * 60 * 24 * 30);
      }

      this.form.expiry_month = v;
    },

    getmonth(v) {
      if (v <= 0) {
        this.expire_end = "";
      } else {
        this.expire_end = new Date(Date.now() + v * 1000 * 60 * 60 * 24 * 30);
      }
      this.form.expiry_month = v;
    },

    sumInput(v) {
      this.form.num_sum = this.$utils.priceFormat(v);
    },
    sumInput_ks(v) {
      this.form.num_sum = this.$utils.priceFormat(v, 5, 1);
    },

    verification() {
      if (!this.card_type) {
        this._alert({
          type: "warning",
          msg: "请选择卡类型"
        });
        return false;
      }

      if (!this.card_type_id) {
        this._alert({
          type: "warning",
          msg: "请选择学员卡"
        });
        return false;
      }

      // 储值卡
      if (this.card_type == "1") {
        if (!this.form.num_sum || this.form.num_sum < 0.01) {
          this._alert({
            type: "warning",
            msg: "充值金额必须大于0"
          });
          return false;
        }
      }
      // 课时卡
      if (this.card_type == "2") {
        if (!this.form.num_sum || this.form.num_sum < 0.01) {
          this._alert({
            type: "warning",
            msg: "充值课时必须大于0"
          });
          return false;
        }
      }

      if (!this.form.expiry_month) {
        this._alert({
          type: "warning",
          msg: "请填写有效期"
        });
        return false;
      }

      if (this.form.expiry_month == "-2") {
        if (!this.expire_end) {
          this._alert({
            type: "warning",
            msg: "请选择到期时间"
          });
          return false;
        }
      }
      // 期限卡
      if (this.card_type == "3") {
        this.form.num_sum = "";
      }

      // 立即开卡
      if (!this.is_auto_active) {
        this.expire_end = "";
      }

      return true;
    },

    addfun() {
      if (!this.verification()) return;

      this.loading = true;
      let expire_end = this.expire_end
        ? parseInt(this.expire_end.setHours(23, 59, 59) / 1000)
        : "0";
      let expiry_month = "";
      if (!this.form.expiry_month || this.form.expiry_month == "-1") {
        expiry_month = "0";
      } else if (this.form.expiry_month == "-2") {
        expiry_month = Math.ceil(
          (this.expire_end.getTime() - new Date().getTime()) /
            (1000 * 3600 * 24 * 30)
        );
      } else {
        expiry_month = this.form.expiry_month;
      }

      let data = {
        campus_id: this.campus_id,
        card_type_id: this.card_type_id,
        is_auto_active: this.is_auto_active ? "1" : "0",
        expire_end,
        num_sum: this.form.num_sum,
        note: this.note,
        expiry_month,
        member_id: this.studentInfo.id
      };
      this._NET
        .jw_card_open(data)
        .then(data => {
          this.loading = false;
          this.show = false;

          // 卡片已存在 可以触发续费逻辑 ata.code = -1000
          if (data.code == "1") {
            this.show = false;
            this.callback();
            this.fakaSuccId = data.data;

            this.is_auto_active
              ? (this.fakasuccShow = Date.now())
              : this._alert({
                  type: "success",
                  msg: "发卡成功"
                });
            /**
             * 初始化
             */
            this.card_type = "";
            this.card_type_id = "";
            this.note = "";
            this.form.num_sum = "";
            this.form.expiry_month = "";
            this.is_auto_active = false;
            this.expire_end = "";
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    callback() {
      this.$emit("callback");
    },

    getList() {
      this._NET
        .jw_card_list({
          campus_id: this.campus_id
        })
        .then(data => {
          if (data.code == "1") {
            this.cardlist = data.data;
          }
        });
    }
  },

  created() {
    this.getList();
  }
};
</script>


<style lang="less" scoped>
@import "../../../../less/style.less";
._infobox {
  border-bottom: 1px solid @bd1;
  text-align: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  p {
    font-size: 16px;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 8px;
  }
  div {
    font-size: 14px;
    color: @c2;
  }
}

.inbox {
  width: 513px;
  margin: 0 auto;
  .crow {
    margin-bottom: 4px;
    > span {
      margin-right: 8px;
    }
  }
}

.kaika {
  height: 37px;
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex {
  .el-checkbox {
    margin-right: 10px;
  }
}
</style>
