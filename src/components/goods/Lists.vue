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
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoods"
                        @keydown.enter.native="getGoods">
                        <el-button slot="append" icon="el-icon-search" @click="getGoods"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 商品列表区域 -->
            <el-table :data="goodsList" style="width: 100%" border>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格（元）" width="120px"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="90px"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="180px">
                    <template slot-scope="scope">{{ scope.row.add_time | dateFormat }}</template>
                </el-table-column>
                <el-table-column label="操作" width="250px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small"
                            @click="deleteGood(scope.row.goods_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[10, 50, 100]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
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
                pagesize: 10
            },
            goodsList: [],
            total: 0
        }
    },
    methods: {
        getGoods() {
            this.$api.goods.getGoodsList(this.queryInfo).then(resp => {
                if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                this.goodsList = resp.data.goods
                this.total = resp.data.total
                this.$message.success(resp.meta.msg)
            })
        },
        // 切换每页显示多少条时触发
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoods()
        },
        // 切换页数时触发
        handleCurrentChange(newNum) {
            this.queryInfo.pagenum = newNum
            this.getGoods()
        },
        // 删除商品
        async deleteGood(id) {
            await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                this.$api.goods.deleteGoodById(id).then(resp => {
                    if (resp.meta.status !== 200) this.$message.error(resp.meta.msg)
                    this.getGoods()
                })
                this.$message.success('删除商品成功');
            }).catch(() => {
                this.$message.info('已取消删除');
            })

        },
        // 跳转到添加商品页面
        goAddPage(){
            this.$router.push('/goods/add')
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

.el-pagination {
    margin-top: 20px;
}
</style>