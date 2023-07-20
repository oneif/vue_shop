<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserLists">
                        <el-button slot="append" icon="el-icon-search" @click="getUserLists"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="right" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClose">
            <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户对话框 -->
        <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClose">
            <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="editUserForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUserForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name: 'Users',
    data() {
        const checkMobile = (rule, value, callback) => {
            // 验证手机号的正则
            const regMobile = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/
            if (regMobile.test(value)) return callback()
            callback(new Error('手机号不合法'))
        }
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 2
            },
            userList: [],
            total: 0,
            // 控制添加用户对话框的显示与隐藏
            addDialogVisible: false,

            // 添加用户的表单数据
            addUserForm: {
                username: '',
                password: '',
                email: '',
                mobile: '',
            },
            // 添加用户表单验证
            addUserFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, type: 'email', message: '邮箱格式不合法' }
                ],
                mobile: [
                    { required: true, validator: checkMobile, trigger: 'blur' }
                ],
            },

            // 控制编辑用户对话框的显示与隐藏
            editDialogVisible: false,

            // 编辑用户的表单数据
            editUserForm: {},
            // 编辑用户表单验证
            editUserFormRules: {
                email: [
                    { required: true, type: 'email', message: '邮箱格式不合法' }
                ],
                mobile: [
                    { required: true, validator: checkMobile, trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        async getUserLists() {
            await this.$api.users.getUserLists(this.queryInfo).then(resp => {
                if (resp.meta.status !== 200) return this.$message.error('获取用户信息失败')
                this.userList = resp.data.users
                this.total = resp.data.total
            })
        },
        // 改变页码值
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getUserLists()
        },
        // 改变一页显示多少条
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserLists()
        },
        async userStateChanged(row) {
            await this.$api.users.changeUserState(row.id, row.mg_state).then(resp => {
                this.$message.success('更新用户状态成功')
            })
        },
        // 关闭添加后重置表单数据
        addDialogClose() {
            this.$refs.addUserFormRef.resetFields()
        },
        // 添加用户
        addUser() {
            this.$refs.addUserFormRef.validate(async valid => {
                if (!valid) return
                await this.$api.users.addUser(this.addUserForm).then(resp => {
                    if (resp.meta.status !== 201) this.$message.error('添加用户失败')
                    this.$message.success('添加用户信息成功')
                    this.addDialogVisible = false
                    this.getUserLists()
                })
            })
        },
        // 显示编辑对话框
        async showEditDialog(id) {
            await this.$api.users.getUserById(id).then(resp => {
                this.editUserForm = resp.data
            })
            this.editDialogVisible = true
        },
        // 关闭编辑后重置表单数据
        editDialogClose() {
            this.$refs.editUserFormRef.resetFields()
        },
        // 提交编辑后的数据
        editUserInfo() {
            this.$refs.editUserFormRef.validate(async valid => {
                if (!valid) return
                await this.$api.users.editUser(this.editUserForm.id, {
                    email: this.editUserForm.email,
                    mobile: this.editUserForm.mobile
                }).then(resp => {
                    if (resp.meta.status !== 200) this.$message.error('更新用户失败')
                    this.$message.success('更新用户信息成功')
                    this.editDialogVisible = false
                    this.getUserLists()
                })
            })
        },

        // 删除用户
        async deleteUser(id) {
            await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                this.$api.users.deleteUserById(id).then((resp)=>{
                    if (resp.meta.status !== 201) this.$message.error('删除用户失败')
                    this.getUserLists()
                })
                this.$message.success('删除用户成功');
            }).catch(() => {
                this.$message.info('已取消删除');
            });
        }
    },
    created() {
        this.getUserLists()
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

.el-table {
    margin-bottom: 26px;
}
</style>