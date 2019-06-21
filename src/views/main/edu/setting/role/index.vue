<template>
  <div>
    <div class="btnbox">
      <el-button type="primary" @click="addgroupfun">新增权限组</el-button>
    </div>
    <div class="tablebox" v-loading="loading" element-loading-text="加载中">
      <div class="tablestyle">
        <el-table :data="rolelist" style="width: 100%" class="table_moban" size="medium">
          <el-table-column prop="role_name" label="权限组名称"></el-table-column>
          <el-table-column prop="user_count" label="操作员数量"></el-table-column>
          <el-table-column label="备注信息">
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.remark.length > 15"
                class="item"
                effect="dark"
                :content="scope.row.remark"
                placement="top"
                popper-class="popperclass"
              >
                <div>{{ scope.row.remark.substr(0,15)+'...' }}</div>
              </el-tooltip>
              <div v-if="scope.row.remark.length <= 15">{{ scope.row.remark }}</div>
            </template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="prewFun(scope.row)">
                <span class="blue">查看权限</span>
              </el-button>
              <el-button
                v-if="scope.row.is_sys_role == '0'"
                type="text"
                @click="editorFun(scope.row)"
              >
                <span class="blue">编辑权限</span>
              </el-button>
              <el-button
                v-if="scope.row.is_sys_role == '0'"
                type="text"
                @click="delAuthor(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 编辑权限组 -->
    <editorAt :showtime="showtime" :role-obj="roleObj" @editorecallback="getList"></editorAt>
    <!-- 查看权限 -->
    <prewat :showtime="pshowtime" :role-obj="roleObj"></prewat>
    <!-- 新增权限组 -->
    <addgroup :changetime="addchangetime" @callback="getList"></addgroup>
  </div>
</template>
<script>
import addgroup from "./compont/addgroup.vue";
import editorAt from "./compont/editorAuthor.vue";
import prewat from "./compont/prewauth.vue";

export default {
  components: { addgroup, editorAt, prewat },
  data() {
    return {
      loading: false,
      rolelist: [],
      showtime: 0,
      pshowtime: 0,
      roleObj: {},
      addchangetime: 0
    };
  },
  methods: {
    addgroupfun() {
      this.addchangetime = +new Date();
    },
    delAuthor(obj) {
      this.$confirm("是否确认删除此权限组?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._NET
            .delRole(
              {
                campus_id: this.campus_id,
                role_id: obj.id
              },
              true
            )
            .then(data => {
              if (data.code == "1") {
                this.getList();
                this._alert({
                  type: "success",
                  msg: "删除成功"
                });
              } else {
                this._alert({
                  type: "error",
                  msg: data.msg
                });
              }
            });
        })
        .catch(() => {});
    },
    getList() {
      this.loading = true;
      this._NET
        .getRoleList({
          campus_id: this.campus_id
        })
        .then(data => {
            this.loading = false
          if (data.code == "1") {
            this.rolelist = data.data;
          }
        }).catch(err=>{
            this.loading = false
        })
    },
    prewFun(obj) {
      this.roleObj = obj;
      this.pshowtime = +new Date();
    },
    editorFun(obj) {
      this.roleObj = obj;
      this.showtime = +new Date();
    }
  },
  created() {
    this.getList();
    this.$store.dispatch("getRoleConfig");
  }
};
</script>
<style lang="less" scoped>
.btnbox {
  margin-bottom: 20px;
}
</style>
