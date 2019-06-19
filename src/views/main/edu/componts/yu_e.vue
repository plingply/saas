<template>
  <span>
    <span v-if="card_type_type == '3'">
      <span v-if="expire_end == '0'">
        <span v-if="status == '1' || status == '3'">--</span>
        <span v-if="status != '1' && status != '3'" class="primary">永久</span>
      </span>
      <span v-if="expire_end > 0">
        <span v-if="status != '3'">{{ num | time_yu_e }}</span>
        <span v-if="status == '3'">--</span>
      </span>
    </span>
    <span v-if="card_type_type == '1' || card_type_type == '2'">
      <span v-if="status != '3'">{{ num }}{{ card_type_type | unit }}</span>
      <span v-if="status == '3'">--</span>
    </span>
  </span>
</template>

<script>
export default {
  props: {
    card_type_type: {
      type: String,
      required: true
    },
    expire_end: {
      type: String,
      required: true
    },
    num: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  }
};
</script>