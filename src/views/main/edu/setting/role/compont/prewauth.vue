<template>
  <el-dialog title="查看权限" :visible.sync="show" width="800px">
    <div class="groupbox">
      <el-form ref="form" :model="{}" label-width="100px">
        <el-form-item label="权限组名称">{{ name }}</el-form-item>
        <el-form-item label="权限预览">
          <div class="autherbox">
            <div class="left">
              <el-tree
                :data="powerList"
                show-checkbox
                node-key="id"
                accordion
                ref="trees"
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
      </el-form>
    </div>
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
      }
    };
  },

  computed: {
    powerList() {
      return JSON.parse(JSON.stringify(this.$store.state.roleConfig));
    }
  },

  watch: {
    showtime() {
      this.name = this.roleObj.role_name;

      this.repeatfun(this.powerList);
      this.checkList = this.roleObj.power_id.split(",");
      this.show = true;
      setTimeout(() => {
        this.$refs.trees.setCheckedKeys(this.checkList);
        this.handleCheckChange();
      }, 10);
    }
  },
  methods: {
    handleCheckChange() {
      let arr = new Set();
      let datarr = new Set();
      this.$refs.trees.getCheckedNodes().map(item => {
        if (item.action) {
          arr.add(item.id);
          datarr.add(item);
        }
      });
      this.checkList = [...arr];
      this.checkdatalist = [...datarr];
    },

    repeatfun(arr) {
      if (arr) {
        arr.forEach(item => {
          item.disabled = true;
          if (item.action) {
            this.checkList.push(item.id);
          }
          this.repeatfun(item.power);
        });
      }
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

