<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 商品列表区域 -->
            <el-table :data="goodsList" style="width: 100%" border>
                <el-table-column prop="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格（元）"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
                <el-table-column prop="add_time" label="创建时间"></el-table-column>
                <el-table-column  label="操作"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'List',
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 6
            },
            goodsList: [],
            total: 0
        }
    },
    methods: {
        getGoods() {
            this.$api.goods.getGoodsList(this.queryInfo).then(resp => {
                console.log(resp);
                if(resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                this.goodsList = resp.data.goods
                console.log(this.goodsList);
                this.$message.success(resp.meta.msg)
            })
        }
    },
    created() {
        this.getGoods()
    },
}
</script>

<style lang="less" scoped>
.el-row {
    margin-bottom: 20px;

    .el-col>.el-button {
        margin-left: 30px;
    }
}
</style>