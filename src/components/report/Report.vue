<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    data() {
        return {
            reportData: [],
            option: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        }
    },
    methods: {
    },
    created() {
    },
    async mounted() {
        await this.$api.reports.getReports().then(resp => {
            if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
            this.reportData = { ...this.option, ...resp.data }
        })
        this.$nextTick(() => {
            var myChart = echarts.init(document.getElementById('main'));
            myChart.setOption(this.reportData);
        })
    },
}
</script>

<style lang="less" scoped></style>