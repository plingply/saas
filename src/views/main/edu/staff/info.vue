<template>
  <div>
    <div class="banner_title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'stafflist' }">员工管理</el-breadcrumb-item>
        <el-breadcrumb-item>员工详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="staff_content" v-loading="loading">
      <div class="box_info">
        <div class="topbox_1">
          <div class="left">
            <div class="actor_box">
              <div class="actor">
                <em>
                  <img v-if="info.face_url" :src="info.face_url" alt>
                  <img v-else src="static/img/mrtx.png" alt>
                </em>
              </div>
            </div>
            <div class="text">
              <span>{{ info.user_remark }}</span>
              <span>{{ info.phone }}</span>
              <img v-if="info.sex == '女'" src="static/img/nv.png" alt>
              <img v-if="info.sex == '男'" src="static/img/nan.png" alt>
              <span v-if="info.sex == '保密'">保密</span>
            </div>
          </div>
          <div class="right">
            <el-button plain style="width:88px" :loading="deloading" @click="delrole(info, '0')">删除</el-button>
            <el-button type="primary" @click="adduserShow = +new Date()" style="width:88px">编辑</el-button>
          </div>
        </div>
        <div class="yx_title">
          <span>员工详情</span>
        </div>
        <el-form ref="form" :model="{}" label-position="right" label-width="90px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="入职时间">{{ info.entry_at | yyyy_mm_dd }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="证件">
                <span
                  v-if="info.certificate_type && info.certificate_sn"
                >{{ info.certificate_type | flt_certificate_type }} | {{ info.certificate_sn }}</span>
                <span v-else>--</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="紧急联系人">
                <span
                  v-if="info.contact_person_name && info.contact_person_name"
                >{{ info.contact_person_name }} | {{ info.contact_person_phone }}</span>
                <span v-else>--</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="微信号">{{ info.wechat_num?info.wechat_num:'--' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="权限">{{ info.role_name }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否授课/学管老师" label-width="140px">
                <span v-show="info.role_type == '1'">是</span>
                <span v-show="info.role_type == '0'">否</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- 修改员工信息 -->
    <editoruser :show-data="adduserShow" :info="info" :editor="true" @success="getInfo"></editoruser>
  </div>
</template>

<script>
import editoruser from "./compont/adduser";
export default {
  data() {
    return {
      loading: false,
      adduserShow: 0,
      info: {},
      deloading: false
    };
  },
  components: {
    editoruser
  },

  filters: {
    flt_certificate_type(v) {
      switch (v) {
        case "1":
          return "身份证";
        case "2":
          return "护照";
      }
    }
  },

  methods: {
    getInfo() {
      this.loading = true;
      this._NET
        .getRoleUserInfo({
          merchant_id: this.mymange,
          user_id: this.$route.params.id
        })
        .then(data => {
          this.loading = false;
          if (data.status == "ok") {
            this.info = data.data;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 删除员工
    delrole(item, confirm) {
      this.deloading = true
      this.delroleFunc(item, confirm);
    },

    delroleFunc(item, confirm) {
      this._NET
        .delRoleUser(
          {
            user_id: item.user_id,
            merchant_id: item.merchant_id,
            confirm
          },
          true
        )
        .then(data => {
          this.deloading = false;
          if (data.status == "ok") {
            this._alert({
              type: "success",
              msg: "删除成功"
            });
            this.$router.push({ name:'stafflist' })
          } else {
            if (data.code == 1000) {
              this.$confirm(
                data.msg,
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              )
                .then(() => {
                  this.delroleFunc(item, "1");
                })
                .catch(() => {});
            } else {
              this._alert({
                type: "warning",
                msg: data.msg
              });
            }
          }
        })
        .catch(err => {
          this.deloading = false;
        });
    }
  },

  created() {
    this.getInfo();
  }
};
</script>

<style lang="less" scoped>
@import "../../../../less/style";
.staff_content {
  background-color: #fff;
  padding: 16px;
  display: flex;
  .left {
    margin-right: @px * 4px;
    .txbox {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto;
      margin-bottom: @px * 2px;
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .right {
    flex: 1;
  }
}
</style>
