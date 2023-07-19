<template>
    <div>
        <el-button type="danger" @click="logOut">退出</el-button>
    </div>
</template>

<script>
    export default {
        name:'Home',
        data() {
            return {
                
            }
        },
        methods: {
            logOut(){
                window.sessionStorage.removeItem('token')
                this.$router.push('/login')
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>