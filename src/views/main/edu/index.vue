<template>
  <div>
    <div v-if="campus.length == 0" class="tsbox">
      <p>暂无校区，点击下方按钮立即创建</p>
      <div>
        <el-button type="primary">创建校区</el-button>
      </div>
    </div>
    <router-view v-if="campus.length > 0"></router-view>
  </div>
</template>


<script>
export default {
  computed:{
    campus(){
      return this.$store.state.campus
    }
  },

  watch:{
    campus_id(){
      this.$store.dispatch("getQudao", this.campus_id)
    }
  },

  created(){
    this.$store.dispatch("getConfig")
    if(this.campus_id){
      this.$store.dispatch("getQudao", this.campus_id)
    }
  }
}
</script>

<style lang="less" scoped>
.tsbox{
  text-align: center;
  padding-top: 100px;
  p{
    margin-bottom: 24px;
  }
}
</style>

