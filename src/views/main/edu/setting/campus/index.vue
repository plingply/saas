<template>
  <div>
    <div class="btnbox">
      <el-button type="primary" size="mini" @click="openaddfunc">添加校区</el-button>
    </div>
    <el-table :data="campus" style="width: 100%" class="table_moban" v-loading="loading">
      <el-table-column label="校区名称" prop="name"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openUpdatefunc(scope.row)">编辑</el-button>
          <el-button type="text" @click="delfunc(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加校区 -->
    <el-dialog :title="title" :visible.sync="show" width="500px">
      <div class="croombox">
        <el-form ref="form" :rules="rules" :model="{}" label-width="120px">
          <el-form-item label="校区名称" prop="name">
            <el-input v-model="name" style="width:80%" size="medium" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              style="width:80%"
              size="medium"
              type="textarea"
              v-model="remark"
              maxlength="500"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button v-if="!iseditor" type="primary" @click="addfunc" :loading="sloading">添 加</el-button>
        <el-button v-if="iseditor" type="primary" @click="updatefunc" :loading="sloading">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      sloading: false,
      show: false,
      title: "添加校区",
      iseditor: false,

      name: "",
      remark: "",

      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }]
      },
    };
  },

  computed:{
    campus(){
      return this.$store.state.campus
    }
  },

  methods: {

    getList() {
      this.$store.dispatch("getCampus")
    },

    addfunc() {
      if (this.name == "" || this.name.trim() == "") {
        this._alert({
          msg: "请输入校区名称",
          type: "warning"
        });
        return;
      }

      if (this.remark == "") {
        this._alert({
          msg: "请输入校区备注",
          type: "warning"
        });
        return;
      }

      if (Number(this.remark) <= 0) {
        this._alert({
          msg: "备注必须大于0",
          type: "warning"
        });
        return;
      }

      this.sloading = true;
      this._NET
        .jw_campus_add({
          name: this.name,
          remark: this.remark
        })
        .then(data => {
          this.sloading = false;
          if (data.code == "1") {
            this._alert({
              msg: "添加成功",
              type: "success"
            });

            this.show = false;
            this.getList();
          }
        })
        .catch(err => {
          this.sloading = false;
        });
    },

    updatefunc() {
      if (this.name == "" || this.name.trim() == "") {
        this._alert({
          msg: "请输入校区名称",
          type: "warning"
        });
        return;
      }

      if (this.remark == "") {
        this._alert({
          msg: "请输入校区备注",
          type: "warning"
        });
        return;
      }

      if (Number(this.remark) <= 0) {
        this._alert({
          msg: "备注必须大于0",
          type: "warning"
        });
        return;
      }

      this.sloading = true;
      this._NET
        .jw_campus_update({
          id: this.campus_id,
          name: this.name,
          remark: this.remark
        })
        .then(data => {
          this.sloading = false;
          if (data.code == "1") {
            this._alert({
              msg: "修改成功",
              type: "success"
            });
            this.show = false;
            this.getList();
          }
        })
        .catch(err => {
          this.sloading = false;
        });
    },

    delfunc(id) {
      this.$confirm("是否确认删除此校区?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._NET
            .jw_campus_delete({
              campus_id: this.campus_id,
              id
            })
            .then(data => {
              if (data.code == "1") {
                this._alert({
                  msg: "删除成功",
                  type: "success"
                });
                this.getList();
              }
            });
        })
        .catch(() => {});
    },

    openaddfunc() {
      this.title = "添加校区";
      this.iseditor = false;

      this.name = "";
      this.remark = "";

      this.show = true;
    },

    openUpdatefunc(obj) {
      this.title = "编辑校区";
      this.iseditor = true;
      this.show = true;
      this.campus_id = obj.id;
      this.name = obj.name;
      this.remark = obj.remark;
    }
  }
};
</script>


<style lang="less" scoped>
@import "../../../../../less/style.less";
.btnbox {
  margin-bottom: @px*2px;
}

.croombox {
  padding-top: @px * 4px;
}

.searchbox1{
  padding:  8px 0;
}
</style>
