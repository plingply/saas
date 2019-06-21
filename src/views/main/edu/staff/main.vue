<template>
  <router-view></router-view>
</template>

<script>
export default {
  computed: {
    roleList() {
      return this.$store.state.roleList;
    }
  },
  created() {
    if (this.roleList.length == 0) {
      this.$store.dispatch("getRoleList");
    }
  }
};
</script>
