<template>
  <el-dialog title="编辑权限" :visible.sync="show" width="800px">
    <div class="groupbox">
      <el-form ref="form" :model="{}" label-width="100px">
        <el-form-item label="权限组名称">
          <el-input v-model="name" size="medium" maxlength="10" placeholder="请输入权限组名称"></el-input>
        </el-form-item>
        <el-form-item label="权限设置">
          <div class="autherbox">
            <div class="left">
              <el-tree
                :data="powerList"
                show-checkbox
                node-key="id"
                accordion
                ref="tree"
                :default-checked-keys="checkList"
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
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="saveRoleinfo" :loading="saveLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: ["showtime", "roleObj"],
  data() {
    return {
      activeName: "",
      show: false,
      saveLoading: false,
      name: "",
      checkList: [],
      checkdatalist: [],
      defaultProps: {
        children: "power",
        label: "power_name"
      },
      remark: ""
    };
  },

  computed:{
    powerList(){
      return this.$store.state.roleConfig
    }
  },

  watch: {
    showtime() {
      this.name = this.roleObj.role_name;

      if(this.roleObj.powerid == 'all'){
        this.repeatfun(this.powerList)
      }else{
        this.checkList = this.roleObj.power_id.split(",");
      }

      this.remark = this.roleObj.remark;
      this.show = true;
      
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys(this.checkList);
        this.handleCheckChange();
      }, 0);
    }
  },
  methods: {

    handleCheckChange() {
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
    // 保存权限
    saveRoleinfo() {
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

      this.saveLoading = true;
      this._NET
        .editorRole( {
          id: this.roleObj.id,
          campus_id : this.campus_id,
          role_name: this.name,
          powerid: this.checkList,
          remark: this.remark
        })
        .then(data => {
          this.saveLoading = false;
          if (data.code == "1") {
            this.show = false;
            this._alert({
              type: "success",
              msg: "修改成功"
            });
            this.$emit("editorecallback");
            this.$store.dispatch('getMangeList')
          }
        })
        .catch(err => {
          this.saveLoading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../../../less/style.less";

.groupbox {
  width: 80%;
  background-color: #fff;
  min-height: 200px;
  margin: 0 auto;
}

.autherbox {
  display: flex;
  > div {
    flex: 1;
    height: 300px;
    overflow: hidden;
    overflow-y: auto;
    &.left {
      margin-right: 20px;
    }
  }
}

.tishi {
  font-size: 12px;
  color: @c3;
}
</style>

