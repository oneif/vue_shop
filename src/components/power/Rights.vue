<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>


        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                        <el-tag v-else-if="scope.row.level == '1'" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import BreadCrumb from '../BreadCrumb.vue';
export default {
    name: 'Rights',
    components: { BreadCrumb, },
    data() {
        return {
            rightsList:[],
        }
    },
    methods: {
        async getRights(){
            await this.$api.rights.getRightsList().then(resp=>{
                if(resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                this.rightsList = resp.data
            })
        }
    },
    created() {
        this.getRights()
    },
}
</script>

<style lang="less" scoped></style>