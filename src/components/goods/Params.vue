<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>


        <el-card>
            <!-- 警告区域 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>

            <!-- 选择商品分类区域 -->
            <el-row style="margin-top:10px">
                <span>选择商品分类：</span>
                <el-cascader v-model="selectedCateId" :options="categoriesList" :props="categoriesProps"
                    @change="getParamsData"></el-cascader>
            </el-row>

            <!-- tag页签区域 -->
            <el-tabs v-model="activeName" @tab-click="getParamsData">
                <el-tab-pane label="用户管理" name="many">
                    <el-button type="primary" :disabled="isBtnDisabled" style="margin-bottom: 16px;"
                        @click="addAttributesDialogVisible = true">添加参数</el-button>
                    <!-- 动态参数的表格 -->
                    <el-table :data="manyTableData" border stripe style="width: 100%" v-if="activeName == 'many'">
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="deleteAttributeTag(scope.row,index)">
                                    {{ item }}
                                </el-tag>
                                <!-- 编辑tag -->
                                <el-input class="input-new-tag" v-if="scope.row.tagInputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keydown.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showTagInput(scope.row)">
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size='small'
                                    @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size='small'
                                    @click="deleteAttribute(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="配置管理" name="only">
                    <el-button type="primary" :disabled="isBtnDisabled" style="margin-bottom: 16px;"
                        @click="addAttributesDialogVisible = true">添加属性</el-button>
                    <!-- 静态属性的表格 -->
                    <el-table :data="onlyTableData" border stripe style="width: 100%" v-if="activeName == 'only'">
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="deleteAttributeTag(scope.row,index)">
                                    {{ item }}
                                </el-tag>
                                <!-- 编辑tag -->
                                <el-input class="input-new-tag" v-if="scope.row.tagInputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keydown.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showTagInput(scope.row)">
                                    + New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size='small'
                                    @click="showEditDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size='small'
                                    @click="deleteAttribute(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addAttributesDialogVisible" @close="addAttributesDialogClosed">
            <el-form :model="addAttributesFrom" :rules="addAttributesFromRules" ref="addAttributesFromRef"
                label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addAttributesFrom.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addAttributesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAttributes">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改参数对话框 -->
        <el-dialog :title="'修改' + titleText" :visible.sync="editAttributesDialogVisible"
            @close="editAttributesDialogClosed">
            <el-form :model="editAttributesFrom" :rules="addAttributesFromRules" ref="editAttributesFromRef"
                label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editAttributesFrom.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editAttributesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editAttributes">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name: 'Params',
    data() {
        return {
            categoriesList: [],
            // 级联选择框的配置对象
            categoriesProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
            // 级联选择框选中的item的id
            selectedCateId: [],
            // 被激活的页签name
            activeName: 'many',
            // 静态参数
            onlyTableData: [],
            // 动态参数
            manyTableData: [],
            // 添加参数对话框的显示隐藏
            addAttributesDialogVisible: false,
            // 要添加的参数
            addAttributesFrom: {
                attr_name: '',
            },
            // 表单验证规则
            addAttributesFromRules: {
                attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
            },
            // 修改参数对话框的显示隐藏
            editAttributesDialogVisible: false,
            // 要修改的参数
            editAttributesFrom: {
                attr_name: '',
                attr_id: 0
            },
            // 表单验证规则
            editAttributesFromRules: {
                attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
            },
        }
    },
    methods: {
        async getCategories() {
            await this.$api.categories.getCategoriesList().then(resp => {
                if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                this.categoriesList = resp.data
            })
        },
        // 当选中节点发生变化时触发该事件
        async getParamsData() {
            // 选中的不是三级分类 return
            if (this.selectedCateId.length !== 3) { 
                this.selectedCateId = []
                this.manyTableData = []
                this.onlyTableData = []
            }
            await this.$api.categoriesAttributes.getCategoryAttributes(this.cateId, { sel: this.activeName }).then(resp => {
                if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)

                resp.data.forEach(item => {
                    if (!item.attr_vals) {
                        item.attr_vals = []
                    } else {
                        item.attr_vals = item.attr_vals.split(',')
                    }
                    this.$set(item, 'tagInputVisible', false)
                    this.$set(item, 'inputValue', '')
                })
                // 静态参数保存
                if (this.activeName == 'only') return this.onlyTableData = resp.data
                // 动态参数保存
                this.manyTableData = resp.data
            })
        },
        // 页签被点击时触发的函数
        handleClick() {
            this.getParamsData()
        },
        // 对话框关闭后清空表单
        addAttributesDialogClosed() {
            this.$refs.addAttributesFromRef.resetFields()
        },
        // 点击确定添加参数
        addAttributes() {
            this.$refs.addAttributesFromRef.validate(valid => {
                if (!valid) return this.$message.error('参数填写有问题')
                this.$api.categoriesAttributes.addAttribute(this.cateId, { attr_name: this.addAttributesFrom.attr_name, attr_sel: this.activeName }).then(resp => {
                    if (resp.meta.status !== 201) return this.$message.error(resp.meta.msg)
                    this.$message.success(resp.meta.msg)
                    this.getParamsData()
                    this.addAttributesDialogVisible = false
                })
            })
        },
        // 点击编辑按钮展示修改对话框
        showEditDialog(row) {
            this.editAttributesDialogVisible = true
            this.editAttributesFrom = row
        },
        // 编辑窗口关闭后重置表单
        editAttributesDialogClosed() {
            this.$refs.editAttributesFromRef.resetFields()
        },
        // 点击确定提交编辑后的参数
        editAttributes() {
            this.$refs.editAttributesFromRef.validate(valid => {
                if (!valid) return this.$message.error('参数填写有问题')
                this.$api.categoriesAttributes.editAttribute(this.editAttributesFrom).then(resp => {
                    if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                    this.$message.success(resp.meta.msg)
                    this.getParamsData()
                    this.editAttributesDialogVisible = false
                })
            })
        },
        // 根据id删除指定的参数项
        async deleteAttribute(attr_id) {
            await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                this.$api.categoriesAttributes.deleteAttribute(this.cateId, attr_id).then((resp) => {
                    if (resp.meta.status !== 200) this.$message.error(resp.meta.msg)
                    this.getParamsData()
                })
                this.$message.success('删除用户成功');
            }).catch(() => {
                this.$message.info('已取消删除');
            })
        },
        // 编辑tag失去焦点触发
        handleInputConfirm(row) {
            if (row.inputValue.trim().length == 0) {
                row.inputValue = ''
                row.tagInputVisible = false
                return
            }
            row.attr_vals.push(row.inputValue)
            row.inputValue = ''
            row.tagInputVisible = false
            this.addAttributeTag(row)
        },
        async addAttributeTag(row){
            // 新添加的参数对象
            const editObj = {
                cat_id: this.cateId,
                attr_id: row.attr_id,
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(',')
            }
            await this.$api.categoriesAttributes.editAttribute(editObj).then(resp => {
                if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                this.$message.success(resp.meta.msg)
            })
        },
        // 显示编辑tag的输入框
        showTagInput(row) {
            row.tagInputVisible = true
            // $nextTick 在下一次DOM更新结束后执行回调
            // 如果不写会导致指定元素的属性或方法改变了 但页面上还没有这个DOM元素 所以改变了也没用
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        deleteAttributeTag(row,index){
            row.attr_vals.splice(index, 1)
            this.addAttributeTag(row)
        }
    },
    computed: {
        // 如果按钮需要被禁用，就返回false
        isBtnDisabled() {
            if (this.selectedCateId.length === 3) return false
            return true
        },
        // 当前选中的三级分类的id
        cateId() {
            if (this.selectedCateId.length === 3) return this.selectedCateId[2]
            return null
        },
        // 动态计算标题的文本
        titleText() {
            if (this.activeName == 'many') return '动态参数'
            return '静态属性'
        }
    },
    created() {
        this.getCategories()
    },
    mounted() {
        this.$bus.$emit('categoriesList', this.categoriesList)
        console.log(this.categoriesList);
    },

}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 12px;
}

.input-new-tag {
    width: 120px;
}
</style>