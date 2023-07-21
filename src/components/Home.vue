<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/R.png">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="danger" @click="logOut">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">
                    <i :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
                </div>
                <!-- 侧边栏菜单 -->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened
                    :collapse="isCollapse" :collapse-transition="false" router
                    :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="list.id.toString()" v-for="list in menusList" :key="list.id">
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                            <i :class="iconsObj[list.id]"></i>
                            <span>{{ list.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="subList.path" v-for="subList in list.children" :key="subList.id" @click="saveNavState(subList.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{ subList.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            menusList: [],
            iconsObj: {
                '125': 'el-icon-user-solid',
                '103': 'el-icon-s-management',
                '101': 'el-icon-s-goods',
                '102': 'el-icon-s-order',
                '145': 'el-icon-s-platform',
            },
            isCollapse: false,
            // 点击菜单高亮
            activePath:''
        }
    },
    methods: {
        logOut() {
            window.sessionStorage.removeItem('token')
            this.$router.push('/login')
        },
        // 获取所有的菜单
        async getMenusList() {
            await this.$api.menusPermission.getMenusList().then(resp => {
                if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                this.menusList = resp.data
            })
        },
        // 点击按钮，切换菜单的折叠与展开
        toggleCollapse() {
            return this.isCollapse = !this.isCollapse
        },
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
        },
    },
    created() {
        this.getMenusList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
}
</script>

<style lang="less" scoped>
.el-header {
    background-color: #373d41;
    color: #333;
    text-align: center;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    font-size: 24px;
    color: #fff;

    div {
        height: 60px;

        // display: flex;
        // align-items: center;
        img {
            height: 100%;
        }

        span {
            vertical-align: top;
            margin-left: 10px;
        }
    }
}



.el-aside {
    background-color: #333744;
    color: #333;
    text-align: center;
    line-height: 200px;

    .el-menu {
        border-right: 0px;
    }
}

.el-main {
    background-color: #eaedf1;
    color: #333;
}

body>.el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}

.home-container {
    height: 100%;
}

.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: .3em;
    cursor: pointer;
    i{
        width: 18px;
        height: 18px;
    }
}
</style>