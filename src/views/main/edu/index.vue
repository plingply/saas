<template>
  <div>
    <router-view></router-view>
  </div>
</template>


<script>
export default {
  created(){
    this.$store.dispatch("getConfig")
    this.$store.dispatch("getQudao")
  }
}
</script>
