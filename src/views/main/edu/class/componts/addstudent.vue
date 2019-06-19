<template>
  <el-dialog title="添加学员" :visible.sync="show" width="600px">
    <div class="addstudent_title">
      <el-select v-model="type" style="width:100px" placeholder="状态">
        <el-option label="已分班" value="2"></el-option>
        <el-option label="未分班" value="1"></el-option>
      </el-select>
      <el-input
        v-model="search"
        @keyup.enter.native="selectFun"
        style="width:200px"
        placeholder="学员姓名/电话/学号"
        maxlength="30"
      ></el-input>
      <el-button type="primary" @click="selectFun">查询</el-button>
      <el-button plain @click="resetfun">重置</el-button>
    </div>
    <div class="addstudent_changebox">
      <el-tag
        v-for="item in changelist"
        :key="item.member_id"
        size="medium"
        closable
        type="success"
        @close="handleClose(item)"
      >{{item.name}}</el-tag>
    </div>
    <div class="addstudent_tablebox" v-loading="loading">
      <el-table
        :data="studentList"
        style="width: 100%"
        @select="handleSelectionChange"
        @select-all="handleSelectionChangeall"
        ref="studentTable"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="member_sn" label="学号"></el-table-column>
        <el-table-column prop="name" label="学员姓名"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="phone" label="联系电话"></el-table-column>
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

    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="addMember" :loading="xloading">确认添加</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { setTimeout } from "timers";
export default {
  props: ["showtime", "id"],
  data() {
    return {
      loading: false,
      xloading: false,
      show: false,
      type: "1",
      count: 0,
      limit: 10,
      page: 1,
      search: "",
      changelist: [],
      studentList: []
    };
  },

  watch: {
    showtime() {
      this.show = true;
      this.changelist = [];
      this.search = ''
      this.type = '1'
      this.getList();
    }
  },

  methods: {
    addMember() {
      if (this.changelist.length == 0) {
        this._alert({
          msg: "请选择学员",
          type: "warning"
        });
        return;
      }

      let arr = [];
      this.changelist.map(item => {
        arr.push(item.member_id);
      });

      this._NET
        .jw_class_addMember({
          merchant_id: this.mymange,
          member_ids: arr.join(","),
          grade_id: this.id
        })
        .then(data => {
          if (data.code == "1") {
            this.show = false;
            this._alert({
              msg: "添加成功",
              type: "success"
            });
            this.$emit("callback");
          }
        });
    },

    handleSelectionChangeall(valist) {
      let arr = JSON.parse(JSON.stringify(this.changelist));
      if (valist.length > 0) {
        valist.forEach(list => {
          let isc = false;
          arr.forEach(item => {
            if (list.member_id == item.member_id) {
              isc = true;
            }
          });
          !isc ? this.changelist.push(list) : "";
        });
      } else {
        //取消
        let lists = [];
        arr.forEach((list, index) => {
          let isc = false;
          this.studentList.forEach(item => {
            if (list.member_id == item.member_id) {
              isc = true;
            }
          });
          !isc ? lists.push(list) : "";
        });
        this.changelist = lists;
      }
    },

    handleSelectionChange(selection, row) {
      let quxiao = false;
      selection.forEach(item => {
        if (item.member_id == row.member_id) {
          quxiao = true;
        }
      });

      // 选中
      if (quxiao) {
        let isNotpush = true;
        this.changelist.forEach((item, index) => {
          if (item.member_id == row.member_id) {
            isNotpush = false;
          }
        });
        isNotpush ? this.changelist.push(row) : "";
      } else {
        //取消
        this.changelist.forEach((item, index) => {
          if (item.member_id == row.member_id) {
            this.changelist.splice(index, 1);
          }
        });
      }
    },

    handleClose(item) {
      for (let k = 0; k < this.changelist.length; k++) {
        if (this.changelist[k].member_id == item.member_id) {
          this.changelist.splice(k, 1);
          break;
        }
      }
      this.$refs.studentTable.toggleRowSelection(item, false);
    },

    handleCurrentChange(v) {
      this.page = v;
      this.getList();
    },

    sizeChange(val) {
      this.page = 1;
      this.limit = val;
      this.getList();
    },

    getList() {
      this.loading = true;
      this._NET
        .jw_class_notStudent({
          merchant_id: this.mymange,
          grade_id: this.id,
          search: this.search,
          type: this.type,
          limit: this.limit,
          page: this.page
        })
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            this.studentList = data.data.item;
            this.count = data.data.count;
            let row = [];
            setTimeout(() => {
              this.studentList.map(list => {
                this.changelist.map(item => {
                  if(list.member_id == item.member_id){
                    this.$refs.studentTable.toggleRowSelection(list, true);
                  }
                });
              });
            }, 0);
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },

    resetfun() {
      this.page = 1;
      this.search = "";
      this.type = "";
      this.getList();
    },

    selectFun() {
      this.page = 1;
      this.getList();
    }
  }
};
</script>


<style lang="less" scoped>
@import "../../../../../less/style.less";
.fenye {
  padding-top: @px * 4px;
}
.addstudent_title {
  display: flex;
  > div {
    margin-right: @px * 4px;
  }
}

.addstudent_changebox {
  padding: @px * 4px 0;
  > span {
    margin-right: @px * 2px;
    margin-bottom: @px * 2px;
  }
}
</style>
