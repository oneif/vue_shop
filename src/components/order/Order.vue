<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="">
                        <el-button slot="append" icon="el-icon-search" @click=""></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单列表区域 -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格" width="120px"></el-table-column>
                <el-table-column prop="order_pay" label="是否付款" width="90px">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.pay_status == '0'">未付款</el-tag>
                        <el-tag type="success" v-else>已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" width="90px"></el-table-column>
                <el-table-column prop="create_time" label="下单时间">
                    <template slot-scope="scope">{{ scope.row.create_time | dateFormat }}</template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="showAddressBox"></el-button>
                        <el-button type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

            <!-- 添加用户对话框 -->
            <el-dialog title="修改地址" :visible.sync="addressVisible" width="30%" @close="addressDialogClose">
                <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                    <el-form-item label="省市区/县" prop="address">
                        <el-cascader :options="city_data" v-model="addressForm.address"></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="fullAddress">
                        <el-input v-model="addressForm.fullAddress"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 展示物流信息对话框 -->
            <el-dialog title="物流信息" :visible.sync="progressVisible" width="30%" @close="addressDialogClose">
                <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                    <el-timeline>
                        <el-timeline-item v-for="(item, index) in progressInfo" :key="index" :timestamp="item.time">
                            {{ item.context }}
                        </el-timeline-item>
                    </el-timeline>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import city_data from './city_data2017_element'
export default {
    data() {
        return {
            progressInfo: [
                {
                    "time": "2018-05-10 09:39:00",
                    "ftime": "2018-05-10 09:39:00",
                    "context": "已签收,感谢使用顺丰,期待再次为您服务",
                    "location": ""
                },
                {
                    "time": "2018-05-10 08:23:00",
                    "ftime": "2018-05-10 08:23:00",
                    "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                    "location": ""
                },
                {
                    "time": "2018-05-10 07:32:00",
                    "ftime": "2018-05-10 07:32:00",
                    "context": "快件到达 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-10 02:03:00",
                    "ftime": "2018-05-10 02:03:00",
                    "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 23:05:00",
                    "ftime": "2018-05-09 23:05:00",
                    "context": "快件到达 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 21:21:00",
                    "ftime": "2018-05-09 21:21:00",
                    "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                    "location": ""
                },
                {
                    "time": "2018-05-09 13:07:00",
                    "ftime": "2018-05-09 13:07:00",
                    "context": "顺丰速运 已收取快件",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:25:03",
                    "ftime": "2018-05-09 12:25:03",
                    "context": "卖家发货",
                    "location": ""
                },
                {
                    "time": "2018-05-09 12:22:24",
                    "ftime": "2018-05-09 12:22:24",
                    "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                    "location": ""
                },
                {
                    "time": "2018-05-08 21:36:04",
                    "ftime": "2018-05-08 21:36:04",
                    "context": "商品已经下单",
                    "location": ""
                }
            ],
            city_data,
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5,


            },
            orderList: [],
            total: 0,
            // 修改地址对话框的显示与隐藏
            addressVisible: false,
            addressForm: {
                address: '',
                fullAddress: ''
            },
            addressFormRules: {
                address: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
                fullAddress: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]

            },
            // 物流信息对话框
            progressVisible: false,
        }
    },
    methods: {
        async getOrderList() {
            await this.$api.orders.getOrders(this.queryInfo).then(resp => {
                if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                this.$message.success(resp.meta.msg)
                this.orderList = resp.data.goods
                this.total = resp.data.total
            })
        },
        // 改变页码值
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        // 改变一页显示多少条
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        // 展示修改地址对话框
        showAddressBox() {
            this.addressVisible = true
        },
        // 对话框关闭事件
        addressDialogClose() {
            this.$refs.addressFormRef.resetFields()
        },
        showProgressBox() {
            this.progressVisible = true
        }
    },
    created() {
        this.getOrderList()
    },
}
</script>

<style lang="less" scoped>
.el-row {
    margin-bottom: 20px;
}

.el-table {
    margin-bottom: 26px;
}
</style>