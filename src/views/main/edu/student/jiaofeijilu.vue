<template>
  <div>
    <el-alert
      v-show="tjtext"
      :title="tjtext"
      :closable="false"
      style="margin-bottom:8px"
      type="success"
    ></el-alert>
    <el-table
      :data="list"
      style="width: 100%"
      class="table_moban"
      size="medium"
      v-loading="loading"
    >
      <el-table-column prop="trade_type" label="类型">
        <template slot="header">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link" style="color: #909399;cursor: pointer">
              类型
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="item.value"
                style="width: 70px;"
                v-for="(item,index) in typeArr"
                :key="index"
              >{{ item.text }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.trade_type == 'pay'"><el-tag type="success">收</el-tag> 缴费</span>
          <span v-if="scope.row.trade_type == 'refund'"><el-tag type="danger">退</el-tag> 退费</span>
        </template>
      </el-table-column>
      <el-table-column label="订单时间">
        <template slot-scope="scope">
          <div>{{ scope.row.create_time | yyyy_mm_dd_H_M_S }}</div>
        </template>
      </el-table-column>
      <el-table-column label="支付金额">
        <template slot-scope="scope">
          <span v-if="scope.row.trade_type == 'pay'">
            {{ scope.row.currency | currency }}{{ parseFloat(Decimal.div(scope.row.total_amount,100)).toFixed(2) }}
            <em
              class="huiicon"
              v-if="scope.row.coupon_id && scope.row.coupon_id != '0'"
            >惠</em>
          </span>
          <span
            v-if="scope.row.trade_type == 'refund'"
            class="tuikuanjine"
          >{{ scope.row.currency | currency }}-{{ parseFloat(scope.row.total_amount/100).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式">
        <template slot-scope="scope">
          <div class="imgbox12">
            <img src="static/img/wx.png" alt v-show="scope.row.channel_type == 'WX'">
            <img src="static/img/alipay.png" alt v-show="scope.row.channel_type == 'ALI'">
            <img src="static/img/card.png" alt v-show="scope.row.channel_type == 'FQ'">
            <img src="static/img/wukafenqi.png" alt v-show="scope.row.channel_type == 'WKFQ'">
            <img src="static/img/pso.png" alt v-show="scope.row.channel_type == 'POS'">
            <img src="static/img/rg.svg" alt v-show="scope.row.channel_type == 'JZ'">
            <img src="static/img/jdpay.png" alt v-show="scope.row.channel_type == 'BTFQ'">
            <img src="static/img/jdkjpay.png" alt v-show="scope.row.channel_type == 'BTKJ'">
          </div>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.trade_type == 'pay'">
            <span v-show="scope.row.trade_status == 'succ'" class="success">支付成功</span>
            <span v-show="scope.row.trade_status == 'paying'" class="warning">支付中</span>
            <span v-show="scope.row.trade_status == 'fail'" class="danger">支付失败</span>
            <span v-show="scope.row.trade_status == 'closed'" class="info">已关闭</span>
            <span v-show="scope.row.trade_status == 'cancel'" class="danger">已撤销</span>
          </div>
          <div v-if="scope.row.trade_type == 'refund'">
            <span v-show="scope.row.trade_status == 'refund_succ'" class="danger">退款成功</span>
            <span v-show="scope.row.trade_status == 'refund_fail'" class="danger">退款失败</span>
            <span v-show="scope.row.trade_status == 'refunding'" class="warning">退款中</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope">
          <span v-if="scope.row.trade_type != 'refund'">{{ scope.row.remark }}</span>
          <span v-if="scope.row.trade_type == 'refund'">{{ scope.row.refund_reason }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="fenye" v-show="count > fysize">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="limit"
        @size-change="sizeChange"
        :page-sizes="pageSizes"
        :layout="fy_layout"
        :total="count"
      ></el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  props: ["info"],
  data() {
    return {
      loading: false,
      list: [],
      page: 1,
      limit: 10,
      count: 0,
      tjtext: "",
      trade_status: "succ,refund_succ", // succ refund_succ
      typeArr: [
        { text: "全部", value: "succ,refund_succ" },
        { text: "收款", value: "succ" },
        { text: "退款", value: "refund_succ" }
      ]
    };
  },

  watch: {
    info() {
      this.getlist();
    }
  },

  methods: {
    handleCurrentChange(v) {
      this.page = v;
      this.getlist();
    },

    sizeChange(val) {
      this.page = 1;
      this.limit = val;
      this.getlist();
    },

    getlist() {
      if (!this.info.name) return;
      this.loading = true;
      this._NET
        .jw_student_jfjilu({
          name: this.info.name,
          phone: this.info.phone,
          merchant_id: this.info.merchant_id,
          page: this.page,
          limit: this.limit,
          trade_status: this.trade_status
        })
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this.list = data.data.item;
            this.count = data.data.count;
            this.tjtext = `缴费：${parseFloat(
              this.Decimal.div(data.data.succ_total,100)
            ).toFixed(2)}元 | 退费：${parseFloat(
              this.Decimal.div(data.data.refund_total,100)
            ).toFixed(2)}元`;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    handleCommand(v) {
      this.trade_status = v;
      this.page = 1;
      this.getlist();
    }
  },

  created() {
    this.getlist();
  }
};
</script>


<style lang="less" scoped>
.imgbox12 {
  height: 24px;
  img {
    height: 24px;
  }
}
</style>
