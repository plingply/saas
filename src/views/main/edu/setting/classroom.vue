<template>
  <div>
    <div class="btnbox">
      <el-button type="primary" size="mini" @click="openaddfunc">添加教室</el-button>
    </div>
    <div class="searchbox1">
      <el-input v-model="search" placeholder="请输入教室名称" style="width:150px;margin-right:10px"></el-input>
      <el-button type="primary" @click="searchfunc">查询</el-button>
      <el-button plain @click="resetfunc">重置</el-button>
    </div>
    <el-table :data="list" style="width: 100%" class="table_moban" v-loading="loading">
      <el-table-column label="教室名称" prop="name"></el-table-column>
      <el-table-column label="可容纳人数" prop="capacity"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openUpdatefunc(scope.row)">编辑</el-button>
          <el-button type="text" @click="delfunc(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="fenye" v-show="count > fysize">
      <el-pagination
        @size-change="sizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="pageSizes"
        :current-page="page"
        :page-size="limit"
        :layout="fy_layout"
        :total="count"
      ></el-pagination>
    </div>

    <!-- 添加教室 -->
    <el-dialog :title="title" :visible.sync="show" width="400px">
      <div class="croombox">
        <el-form ref="form" :rules="rules" :model="{}" label-width="120px">
          <el-form-item label="教室名称" prop="name">
            <el-input v-model="name" style="width:80%" size="medium" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="可容纳人数" prop="num">
            <el-input
              style="width:80%"
              size="medium"
              v-model="capacity"
              maxlength="4"
              @input="containInput"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button v-if="!iseditor" type="primary" @click="addfunc" :loading="sloading">添加</el-button>
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
      title: "添加教室",
      iseditor: false,
      list: [],
      search:'',

      classroomID: "",
      name: "",
      capacity: "",

      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        num: [{ required: true, message: " ", trigger: "blur" }]
      },
    };
  },

  methods: {
    containInput(v) {
      this.capacity = parseInt(this.$utils.formatNumber(v))?parseInt(this.$utils.formatNumber(v)):'';
    },


    searchfunc(){
      this.getList()
    },

    resetfunc(){
      this.search = ''
      this.getList()
    },

    getList() {
      this.loading = true;
      this._NET
        .jw_classroom_list({
          campus_id :this.campus_id,
          search: this.search
        })
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            this.list = data.data;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    addfunc() {
      if (this.name == "" || this.name.trim() == "") {
        this._alert({
          msg: "请输入教室名称",
          type: "warning"
        });
        return;
      }

      if (this.capacity == "") {
        this._alert({
          msg: "请输入教室可容纳人数",
          type: "warning"
        });
        return;
      }

      if (Number(this.capacity) <= 0) {
        this._alert({
          msg: "可容纳人数必须大于0",
          type: "warning"
        });
        return;
      }

      this.sloading = true;
      this._NET
        .jw_classroom_add({
          campus_id: this.campus_id,
          name: this.name,
          capacity: this.capacity
        })
        .then(data => {
          this.sloading = false;
          if (data.code == "1") {
            this._alert({
              msg: "添加成功",
              type: "success"
            });

            this.show = false;
            this.page = 1;
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
          msg: "请输入教室名称",
          type: "warning"
        });
        return;
      }

      if (this.capacity == "") {
        this._alert({
          msg: "请输入教室可容纳人数",
          type: "warning"
        });
        return;
      }

      if (Number(this.capacity) <= 0) {
        this._alert({
          msg: "可容纳人数必须大于0",
          type: "warning"
        });
        return;
      }

      this.sloading = true;
      this._NET
        .jw_classroom_update({
          campus_id: this.campus_id,
          id: this.classroomID,
          name: this.name,
          capacity: this.capacity
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
      this.$confirm("是否确认删除此教室?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._NET
            .jw_classroom_delete({
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
      this.title = "添加教室";
      this.iseditor = false;

      this.name = "";
      this.capacity = "";

      this.show = true;
    },

    openUpdatefunc(obj) {
      this.title = "编辑教室";
      this.iseditor = true;
      this.show = true;
      this.classroomID = obj.id;
      this.name = obj.name;
      this.capacity = obj.capacity;
    }
  },

  created() {
    this.getList();
  }
};
</script>


<style lang="less" scoped>
@import "../../../../less/style.less";
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
