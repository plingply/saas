<template>
  <div>
    <div class="listbox" v-for="(item,key) in yx_config.set_list" :key="key">
      <h1>
        <span>{{ item }}</span>
        <el-button type="primary" size="mini"  @click="openaddqdfun">添加渠道</el-button>
      </h1>
      <el-table :data="qdlist" style="width: 100%" class="table_moban">
        <el-table-column label="渠道名称" prop="name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- merchant_id = 0 是系统级别的渠道 -->
            <el-button
              type="text"
              @click="openupdate(scope.row)"
              v-if="scope.row.type == '1'"
            >编辑</el-button>
            <el-button
              type="text"
              @click="delfun(scope.row.id)"
               v-if="scope.row.type == '1'"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加渠道 -->
    <el-dialog :title="title" :visible.sync="qudaoshow" width="400px">
      <div class="qdset">
        <span>渠道名称</span>
        <el-input v-model="qdname" maxlength="8" placeholder="请输入渠道名称"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qudaoshow = false">取消</el-button>
        <el-button v-if="!iseditor" type="primary" @click="addqudaofun" :loading="qdloading">添加</el-button>
        <el-button v-if="iseditor" type="primary" @click="updatequdaofun" :loading="qdloading">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      qdname: "",
      qudaoid: "",
      title: "",
      qudaoshow: false,
      qdloading: false,
      iseditor: false
    };
  },

  computed: {
    yx_config() {
      return this.$store.state.yx_config;
    },
    qdlist() {
      return this.$store.state.yx_qudao;
    }
  },

  methods: {
    openupdate(item) {
      this.title = "编辑渠道";
      this.qudaoshow = true;
      this.iseditor = true;
      this.qdname = item.name;
      this.qudaoid = item.id;
    },

    delfun(id) {
      this.$confirm("是否确认删除该渠道?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._NET
            .jw_qdset_delete({
              campus_id: this.campus_id,
              id
            })
            .then(data => {
              if (data.code == "1") {
                this._alert({
                  type: "success",
                  msg: "删除成功"
                });
                this.$store.dispatch("getQudao", this.campus_id);
              }
            });
        })
        .catch(() => {});
    },

    updatequdaofun() {
      if (!this.qdname) {
        this._alert({
          type: "warning",
          msg: "请输入渠道名称"
        });
        return;
      }

      this.qdloading = true;

      this._NET
        .jw_qdset_update({
          campus_id: this.campus_id,
          id: this.qudaoid,
          name: this.qdname
        })
        .then(data => {
          this.qdloading = false;
          if (data.code == "1") {
            this._alert({
              type: "success",
              msg: "更新成功"
            });
            this.qudaoshow = false;
            this.$store.dispatch("getQudao", this.campus_id);
          }
        })
        .catch(err => {
          this.qdloading = false;
        });
    },

    addqudaofun() {
      if (!this.qdname) {
        this._alert({
          type: "warning",
          msg: "请输入渠道名称"
        });
        return;
      }

      this.qdloading = true;
      this._NET
        .jw_qdset_add({
          campus_id: this.campus_id,
          name: this.qdname
        })
        .then(data => {
          this.qdloading = false;
          if (data.code == "1") {
            this._alert({
              type: "success",
              msg: "添加成功"
            });
            this.qudaoshow = false;
            this.qdname = "";
            this.$store.dispatch("getQudao", this.campus_id)
          }
        })
        .catch(err => {
          this.qdloading = false;
        });
    },
    openaddqdfun() {
      this.title = "新增渠道";
      this.iseditor = false;
      this.qudaoshow = true;
      this.qdname = "";
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../../less/style.less";

.listbox {
  > h1 {
    font-size: 16px;
    color: @c1;
    font-weight: normal;
    margin-bottom: 10px;
    > span {
      margin-right: 10px;
    }
  }
}

.qdset {
  > span {
    display: block;
    font-size: 14px;
    color: @c2;
    margin-bottom: 10px;
  }
}
</style>