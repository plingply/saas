<template>
  <div class="header">
    <span class="school">{{ school.name }}</span>
    <el-dropdown @command="handleCommand" v-if="campus.length > 0" trigger="click">
      <span class="campusName">
        ({{ campusName }})
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          :command="item.id"
          v-for="(item,index) in campus"
          :key="index"
        >{{ item.name }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      campusName: ""
    };
  },
  computed: {
    school() {
      return this.$store.state.school;
    },
    campus() {
      return this.$store.state.campus;
    }
  },

  methods: {
    handleCommand(command) {
      this.$store.commit("setCampusId", command);
      this.$router.push({ name:'home' })
      this.campus.forEach(item => {
        if (item.id == command) {
          this.campusName = item.name;
        }
      });
    }
  },

  created() {
    this.campus.forEach(item => {
      if (item.id == this.campus_id) {
        this.campusName = item.name;
      }
    });
  }
};
</script>


<style lang="less" scoped>
@import "../../../less/style";
.header {
  height: 70px;
  background-color: #fff;
  border-bottom: 1px solid @bd1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 16px;
  .school {
    font-size: 16px;
    color: @c1;
    margin-right: 10px;
  }

  .campusName {
    font-size: 14px;
    color: @c;
    cursor: pointer;
  }
}
</style>
