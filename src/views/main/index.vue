<template>
  <div class="container">
    <leftmenu></leftmenu>
    <div class="main">
      <vhead></vhead>
      <div class="mainbox" ref="mainbox">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import vhead from "./componts/vhead";
import leftmenu from "./componts/menu";

export default {
  components: {
    vhead,
    leftmenu
  },
  created(){
    this.$store.dispatch("getSchool")
  }
};
</script>


<style lang="less" scoped>
@import "../../less/style.less";
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  .main {
    flex: 1;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    .mainbox {
      flex: 1;
      overflow: auto;
      padding: 30px 40px;
      position: relative;
      transition: all 0.2s;
      padding-bottom: 80px;
      background: @bj;
      .tipbox {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        line-height: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-size: 12px;
      }
    }
  }
}
</style>

