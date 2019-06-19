<template>
    <div>
        <div>{{ userInfo.name }}</div>
        <p>电话{{ userInfo.phone }}</p>
    </div>
</template>

<script>
export default {
    computed:{
        userInfo(){
            return this.$store.state.userInfo
        }
    }
}
</script>
