<template>
  <div>
    <el-tabs v-model="type">
      <el-tab-pane label="已上课记录" name="1">
        <yshangke v-if="type == '1'"></yshangke>
      </el-tab-pane>
      <el-tab-pane label="待上课记录" name="2">
        <daishangke v-if="type == '2'"></daishangke>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import daishangke from "./daisk";
import yshangke from "./yisk";
export default {
  data() {
    return {
      type: "1"
    };
  },

  components: {
    daishangke,
    yshangke
  },

  methods: {
    tabClick(type) {
      this.type = type;
    }
  }
};
</script>


<style lang="less" scoped>
@import "../../../../../less/style.less";
.tbtnbox-group {
  display: flex;
  span {
    display: block;
    height: 34px;
    border: 1px solid @c;
    line-height: 34px;
    text-align: center;
    padding: 0 16px;
    border-right: none;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &:first-child {
      border-radius: 4px 0 0 4px;
    }
    &:last-child {
      border-right: 1px solid @c;
      border-radius: 0 4px 4px 0;
    }
    &.active {
      background-color: @c;
      color: #fff;
    }
  }
}
</style>
