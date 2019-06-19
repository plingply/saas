<template>
  <span>
    <span v-if="status == '1' || status == '3'">--</span>
    <span v-if="status == '2' || status == '4'">
      <span v-if="expire_end == '0'">无期限</span>
      <span v-else>{{ expire_end | yyyy_mm_dd }}</span>
      <span v-if="isshowmonth && expire_end >= '0' && expire_end > Date.now()/1000 ">({{ expire_end - Date.now()/1000 | time_yu_e }})</span>
    </span>
  </span>
</template>

<script>
export default {
  props: {
    status: {
      required: true
    },
    expire_end: {
      required: true
    },
    isshowmonth: ""
  }
};
</script>
