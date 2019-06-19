<template>
  <div>
    <div class="btnbox">
      <el-button type="primary" @click="fakafunc">发卡</el-button>
    </div>
    <el-table :data="list" style="width: 100%" size="medium" v-loading="loading">
      <el-table-column label="卡名称" prop="card_type_name" min-width="120">
        <template slot-scope="scope">
          <div>
            <el-tag
              type="success"
              v-if="scope.row.card_type_type == '1' && yx_config.card_type_list"
            >{{ yx_config.card_type_list['1'] }}</el-tag>
            <el-tag
              type="warning"
              v-if="scope.row.card_type_type == '2' && yx_config.card_type_list"
            >{{ yx_config.card_type_list['2'] }}</el-tag>
            <el-tag
              type="danger"
              v-if="scope.row.card_type_type == '3' && yx_config.card_type_list"
            >{{ yx_config.card_type_list['3'] }}</el-tag>
            <textbox :len="10" :text="scope.row.card_type_name"></textbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="卡状态" prop="status">
        <template slot-scope="scope">
          <div
            :class="{
            success: scope.row.status == '2',
            blue: scope.row.status == '1',
            primary: scope.row.status == '3',
            primary: scope.row.status == '4',
            primary: scope.row.status == '5'
          }"
          >{{ yx_config && yx_config.card_status_list ?yx_config.card_status_list[scope.row.status]:"" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="发卡时间" prop="active_time" width="150">
        <template slot-scope="scope">{{ scope.row.created_at | yyyy_mm_dd_H_M }}</template>
      </el-table-column>
      <el-table-column label="开卡时间" prop="expire_start" width="150">
        <template slot-scope="scope">{{ scope.row.active_time | yyyy_mm_dd_H_M }}</template>
      </el-table-column>
      <el-table-column label="余额" prop="num_sum">
        <template slot-scope="scope">
          <yuee
            :card_type_type="scope.row.card_type_type"
            :expire_end="scope.row.expire_end"
            :num="scope.row.num_residue"
            :status="scope.row.status"
          ></yuee>
        </template>
      </el-table-column>
      <el-table-column label="总额" prop="num_sum">
        <template slot-scope="scope">
          <yuee
            :card_type_type="scope.row.card_type_type"
            :expire_end="scope.row.expire_end"
            :num="scope.row.num_sum"
            :status="scope.row.status"
          ></yuee>
        </template>
      </el-table-column>
      <el-table-column label="有效期至" prop="expire_end">
        <template slot-scope="scope">
          <yxq :status="scope.row.status" :expire_end="scope.row.expire_end"></yxq>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="330">
        <template slot-scope="scope">
          <div>
            <el-button type="text" v-if="scope.row.status == '1'" @click="openKaika(scope.row)">开卡</el-button>
            <el-button
              type="text"
              v-if="(scope.row.status == '2' || scope.row.status == '5') && scope.row.card_type_type != '3'"
              @click="openChongzhi(scope.row)"
            >充值</el-button>
            <el-button
              type="text"
              v-if="(scope.row.status == '2' || scope.row.status == '5') && scope.row.card_type_type == '3' && scope.row.expire_end > 0"
              @click="openChongzhi(scope.row)"
            >充值</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == '2' || scope.row.status == '5'"
              @click="xiugaiYXQ(scope.row)"
            >修改有效期</el-button>
            <el-button
              type="text"
              v-if="scope.row.status == '2' && scope.row.card_type_type != '3'"
              @click="openKoufei(scope.row)"
            >扣费</el-button>
            <el-button
              type="text"
              v-if="scope.row.card_type_type != '3' &&scope.row.status != '1'"
              @click="koufeilist(scope.row.id)"
            >扣费记录</el-button>

            <el-button
              type="text"
              v-if="scope.row.status == '1' || scope.row.status == '2' || scope.row.status == '5'"
              @click="nullifyFunc(scope.row)"
            >作废</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 发卡 -->
    <faka :student-info="info" :showtime="showtime" @callback="getList"></faka>
    <!-- 开卡 -->
    <kaika :showtime="kaikashow" :card_id="card_id" :member_id="member_id" @callback="getList"></kaika>
    <!-- 充值 -->
    <chongzhi
      :showtime="chongzhitime"
      :card_id="card_id"
      :member_id="member_id"
      @callback="getList"
    ></chongzhi>
    <!-- 扣费 -->
    <koufei :showtime="koufeitime" :card_id="card_id" :member_id="member_id" @callback="getList"></koufei>
    <!-- 修改有效期 -->
    <updateyxq :showtime="yxqtime" :card_id="card_id" :member_id="member_id" @callback="getList"></updateyxq>
  </div>
</template>

<script>
import faka from "../../componts/faka";
import kaika from "../../componts/kaika";
import yuee from "../../componts/yu_e";
import yxq from "../../componts/yxq";
import chongzhi from "../../componts/chongzhi";
import koufei from "../../componts/koufei";
import updateyxq from "../../componts/updateyxq";
export default {
  props: ["info"],
  data() {
    return {
      showtime: 0,
      loading: false,
      list: [],

      kaikashow: 0,
      card_id: "",
      member_id: "",

      chongzhitime: 0,
      koufeitime: 0,
      yxqtime: 0
    };
  },

  components: {
    faka,
    kaika,
    yuee,
    yxq,
    chongzhi,
    koufei,
    updateyxq
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    }
  },

  methods: {
    openChongzhi(obj) {
      
      this.chongzhitime = Date.now();
      this.card_id = obj.id;
      this.member_id = obj.member_id;
    },

    openKoufei(obj) {
     
      this.koufeitime = Date.now();
      this.card_id = obj.id;
      this.member_id = obj.member_id;
    },

    xiugaiYXQ(obj) {
      
      this.yxqtime = Date.now();
      this.card_id = obj.id;
      this.member_id = obj.member_id;
    },

    fakafunc() {
      this.showtime = Date.now();
    },

    openKaika(obj) {
     
      this.kaikashow = Date.now();
      this.card_id = obj.id;
      this.member_id = obj.member_id;
    },

    getList() {
      this.loading = true;
      this._NET
        .jw_student_cardlist({
          merchant_id: this.mymange,
          member_id: this.$route.params.id
        })
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this.list = data.data.item;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    nullifyFunc(obj) {
    
      let messageHead = "";
      if (obj.status == "2") {
        messageHead = "提醒：学员卡已开卡";
      } else {
        messageHead = "";
      }

      this.mbox({
        title: "废除",
        messageHead: "将作废学员",
        message: "学员卡作废后仅可查询，不能修改和恢复，请确认是否作废？"
      })
        .then(() => {
          this._NET
            .jw_student_card_nullify({
              merchant_id: this.mymange,
              member_id: obj.member_id,
              card_id: obj.id
            })
            .then(data => {
              this._alert({
                type: "success",
                msg: "作废成功"
              });
              this.getList();
            });
        })
        .catch(() => {});
    },

    koufeilist(card_id) {
      this.$router.push({
        name: "edu_student_card_record",
        params: { id: this.$route.params.id, card_id }
      });
    }
  },

  created() {
    this.getList();
  },

  mounted() {
    this.$root.$on("koufeiEvent", e => {
      this.openKoufei(e);
    });

    // 直接打开扣费
    if(this.$route.query.cardid && this.$route.query.member_id){
      this.openKoufei({
        id: this.$route.query.cardid,
        member_id: this.$route.query.member_id
      })
    }
  }
};
</script>


<style lang="less" scoped>
.btnbox {
  margin-bottom: 8px;
}
</style>
