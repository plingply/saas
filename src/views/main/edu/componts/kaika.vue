<template>
  <el-dialog title="开卡" :visible.sync="show" width="600px">
    <el-form v-loading="loading" ref="form" :model="form" :rules="rules" label-width="112px">
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
          <span>余额</span>
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
          <span>有效期</span>
          <div v-if="info.expiry_month > 0">{{ info.expiry_month }}个月</div>
          <div v-if="info.expiry_month == '0'">无限期</div>
        </div>

        <div class="formbox">
          <el-form-item label="到期时间" prop="expiry_time">
            <div>
              <el-checkbox v-model="isnoDeadline">无期限</el-checkbox>
            </div>
            <el-date-picker
              v-model="form.expiry_time"
              align="right"
              type="date"
              size="medium"
              style="width:150px"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              :disabled="isnoDeadline"
            ></el-date-picker>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="kaifafun" :loading="xloading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import yuee from "./yu_e";
export default {
  props: ["showtime", "card_id", "member_id"],
  data() {
    return {
      loading: false,
      xloading: false,
      show: false,
      form: {
        expiry_time: ""
      },
      info: {},
      isnoDeadline: false,
      rules: {
        expiry_time: [{ required: true, message: " ", trigger: "blur" }]
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
      this.xloading = false
      this.getStudentCardInfo();
    }
  },

  components: {
    yuee
  },

  methods: {
    kaifafun() {
      let expire_end = "0";
      if (!this.isnoDeadline) {
        if (!this.form.expiry_time) {
          this._alert({
            type: "warning",
            msg: "请选择有效期"
          });
          return;
        } else {
          expire_end = parseInt(
            this.form.expiry_time.setHours(23, 59, 59) / 1000
          );
        }
      }
      this.xloading = true;
      this._NET
        .jw_student_card_open({
          member_id: this.member_id,
          merchant_id: this.mymange,
          card_id: this.card_id,
          expire_end
        })
        .then(data => {
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "开卡成功"
            });
            this.$emit("callback");
            this.show = false;
          }
        });
    },
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
            this.form.expiry_time =
              this.info.expiry_month > 0
                ? new Date(
                    Date.now() + this.info.expiry_month * 3600 * 1000 * 24 * 30
                  )
                : "";
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
  padding-top: 8px;
}
</style>
