<!-- 可能是接口有问题 没有完全实现功能 
    只渲染了一个列表
    7.24更新 修复了一点小bug
-->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialogVisible">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 商品分类区域 -->
            <el-table :data="categoriesList" style="width: 100%;margin-top: 20px;" row-key="cat_id" border fit
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column type="expand"></el-table-column>
                <el-table-column type="index" label="#" width="60px">
                </el-table-column>
                <el-table-column prop="cat_name" label="分类名称">
                </el-table-column>
                <el-table-column label="是否有效">
                    <template slot-scope="scope">
                        <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color: lightgreen;"></i>
                        <i class="el-icon-error" v-else style="color: red;"></i>
                    </template>
                </el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="30%">
            <el-form :model="addCateForm" :rules="addCateFromRules" ref="ruleForm" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Categories',
    data() {
        return {
            // 查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类数据列表
            categoriesList: [],
            // 商品列表的总数
            total: 0,
            // 控制添加分类对话框的显示与隐藏
            addCateDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm: {
                cat_name: '',
                cat_pid:0,
                cat_level:0
            },
            // 添加分类的表单验证规则对象
            addCateFromRules: {
                cat_name: { required: true, message: '请输入分类名称', trigger: 'blur' }
            }
        }
    },
    methods: {
        async getCategories() {
            await this.$api.categories.getCategoriesList(this.queryInfo).then(resp => {
                if (resp.meta.status !== 200) return this.$message.error(resp.meat.msg)
                this.categoriesList = resp.data.result
                this.total = resp.data.total
            })
        },
        // 改变每页显示多少条
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCategories()
        },
        // 去往指定页数
        handleCurrentChange(newNum) {
            this.queryInfo.pagenum = newNum
            this.getCategories()
        },
        // 点击按钮展示添加分类的对话框
        showAddCateDialogVisible() {
            this.addCateDialogVisible = true
        },
        // 获取父级分类的数据源
        getParentCateList(){

        }
    },
    created() {
        this.getCategories()
    },
}
</script>

<style lang="less" scoped></style>