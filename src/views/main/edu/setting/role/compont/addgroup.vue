<template>
  <el-dialog title="新增权限组" :visible.sync="show" width="800px">
    <div class="group">
      <el-form ref="form" :model="{}" label-width="100px">
        <el-form-item label="权限组名称">
          <el-input v-model="name" size="medium" maxlength="10" placeholder="请输入权限组名称"></el-input>
        </el-form-item>
        <el-form-item label="权限设置">
          <i class="el-icon-loading primary" v-if="powerList.length == 0"></i>
          <div class="autherbox">
            <div class="left">
              <el-tree
                :data="powerList"
                show-checkbox
                node-key="id"
                accordion
                ref="tree"
                :props="defaultProps"
                @check-change="handleCheckChange"
              ></el-tree>
            </div>
            <div class="right" v-show="checkdatalist.length > 0">
              <el-collapse v-model="activeName" accordion>
                <el-collapse-item
                  :title="item.power_name"
                  :name="item.id"
                  :key="index"
                  v-for="(item,index) in checkdatalist"
                >
                  <div class="tishi">{{ item.remark }}</div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="6" maxlength="500" placeholder="请输入内容" v-model="remark"></el-input>
        </el-form-item>
        <el-form-item label>
          <div class="groupbtnbox">
            <el-button type="primary"  @click="addNewPower" :loading="loading">创建权限组</el-button>
            <el-button plain @click="show = false">取 消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["changetime"],
  data() {
    return {
      show: false,
      name: "",
      checkList: [],
      checkdatalist: [],
      remark: "",
      loading: false,
      activeName: "",

      defaultProps: {
        children: "power",
        label: "power_name"
      }
    };
  },

  computed:{
    powerList(){
      return this.$store.state.roleConfig
    }
  },

  watch: {
    changetime() {
      this.show = true;
      this.checkList = []
    }
  },

  methods: {
    handleCheckChange(data, checked, indeterminate) {
      let arr = new Set();
      let datarr = new Set();
      this.$refs.tree.getCheckedNodes().map(item => {
        if (item.action) {
          arr.add(item.id);
          datarr.add(item);
        }
      });
      this.checkList = [...arr];
      this.checkdatalist = [...datarr];
    },

    addNewPower() {
      if (this.name == "") {
        this._alert({
          type: "warning",
          msg: "请输入权限组名称"
        });
        return;
      }
      if (this.checkList.length == 0) {
        this._alert({
          type: "warning",
          msg: "请勾选具体权限"
        });
        return;
      }

      this.loading = true;

      this._NET
        .addRoleList({
          campus_id: this.campus_id,
          role_name: this.name,
          remark: this.remark,
          powerid: this.checkList
        })
        .then(data => {
          this.loading = false;
          if (data.code == "1") {
            this.name = "";
            this.remark = "";
            this.checkList = [];
            this._alert({
              type: "success",
              msg: "添加成功"
            });
            this.show = false;
            this.$emit("callback");
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
@import "../../../../../../less/style.less";
.group {
  width: 80%;
  background-color: #fff;
  min-height: 200px;
  margin: 0 auto;
}
.groupbtnbox {
  width: 100%;
  margin: 0 auto;
  padding-top: 10px;
}

.autherbox {
  display: flex;
  > div {
    flex: 1;
    height: 300px;
    overflow: hidden;
    overflow-y: auto;
    &.left{
      margin-right: 20px;
    }
  }
}

.tishi{
  font-size: 12px;
  color: @c3;
}
</style>
