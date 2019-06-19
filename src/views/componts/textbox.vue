<template>
  <span>
    <span v-if="text.length <= len">{{ text }}</span>
    <el-tooltip v-if="text.length > len" class="item" effect="dark" placement="top-start">
      <span slot="content" class="textcontent">{{ text }}</span>
      <span>{{ text.substr(0,len) }}...</span>
    </el-tooltip>
  </span>
</template>

<script>
export default {
  props: {
    len: {
      type: Number,
      default: 10
    },
    text: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../less/style";
.textcontent {
  display: block;
  max-width: 300px;
  .wordbreak();
  line-height: 18px;
}
</style>
