<template>
  <div>
    <div class="banner_title">
      <span>员工管理</span>
    </div>

    <div class="btnbox">
      <el-button type="primary" @click="adduserShow = Date.now()">+ 新增员工</el-button>
    </div>

    <div class="searchbox">
      <el-input
        placeholder="员工姓名/联系电话"
        maxlength="20"
        clearable
        @keyup.enter.native="selectFun"
        style="width:170px;margin-right:12px"
        prefix-icon="el-icon-search"
        v-model="search"
      ></el-input>
      <span>权限：</span>
      <el-select
        v-model="type"
        filterable
        placeholder="请选择权限组"
        style="width:150px;margin-right:12px"
      >
        <el-option
          :label="item.role_name"
          :value="item.id"
          v-for="(item,index) in roleList"
          :key="index"
        ></el-option>
      </el-select>
      <span>授课/学管老师：</span>
      <el-select
        v-model="role_type"
        filterable
        placeholder="请选择员工状态"
        style="width:150px;margin-right:12px"
      >
        <el-option label="是" value="1"></el-option>
        <el-option label="否" value="0"></el-option>
      </el-select>
      <el-button type="primary" @click="selectFun">查询</el-button>
      <el-button plain @click="resetFun">重置</el-button>
    </div>

    <div class="tablebox" v-loading="loading" element-loading-text="加载中">
      <div class="tablestyle">
        <el-table :data="list" style="width: 100%" class="table_moban" size="medium">
          <el-table-column prop="remark_name" label="员工姓名"></el-table-column>
          <el-table-column prop="sex" label="性别"></el-table-column>
          <el-table-column prop="phone" label="联系电话"></el-table-column>
          <el-table-column prop label="权限">
            <template slot-scope="scope">{{ scope.row.role_name }}</template>
          </el-table-column>
          <el-table-column prop label="是否授课/学管老师">
            <template slot-scope="scope">
              <span v-show="scope.row.role_type == '1'">是</span>
              <span v-show="scope.row.role_type == '0'">否</span>
            </template>
          </el-table-column>
          <el-table-column prop label="操作">
            <template slot-scope="scope">
              <ui-button type="danger text" size="mini" @click="tolink(scope.row.user_id)">
                <span class="blue">详情</span>
              </ui-button>
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
      </div>
    </div>

    <!-- 新增员工 -->
    <adduser :show-data="adduserShow" @success="addsuccess"></adduser>
  </div>
</template>
<script>
import adduser from "./compont/adduser";
export default {
  components: {
    adduser
  },
  data() {
    return {
      type: "",
      search: "",
      list: [],
      limit: 10,
      page: 1,
      count: 0,
      role_type: "",
      loading: false,
      adduserShow: 0,
      roleList:[]
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  methods: {
    getRoleList() {
      this._NET
        .getRoleList({
          campus_id: this.campus_id
        })
        .then(data => {
          if (data.code == "1") {
            this.roleList = data.data;
          }
        })
    },
    switchChange(v) {
      this._NET
        .role_user_mpmsg({
          user_id: v.user_id,
          merchant_id: v.merchant_id,
          status: v.mpmsg
        })
        .then(data => {
          this.getList();
          if (data.code == "1") {
            this._alert({
              type: "success",
              msg: "修改成功"
            });
          }
        });
    },
    sizeChange(val) {
      this.page = 1;
      this.limit = val;
      this.getList();
    },
    tolink(id) {
      this.$router.push({ name: "admininfo", params: { id } });
    },
    selectFun() {
      this.page = 1;
      this.getList();
    },
    resetFun() {
      this.page = 1;
      this.type = "";
      this.search = "";
      this.role_type = "";
      this.getList();
    },

    handleCurrentChange(v) {
      this.page = v;
      this.getList();
    },
    addsuccess() {
      this.page = 1;
      this.getList();
    },
    getList() {
      if (!this.campus_id || this.campus_id == "") return;
      this.loading = true;
      this._NET
        .getRoleUserList({
          campus_id: this.campus_id,
          role_id: this.type,
          page: this.page,
          limit: this.limit,
          search: this.search,
          role_type: this.role_type
        })
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            this.list = data.data.item;
            this.count = data.data.count;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  created() {
    this.getList();
    this.getRoleList()
  }
};
</script>
