<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['borderbottom', index === 0 ? 'bordertop' : '']"
                            v-for="(item1, index) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRight(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级权限 -->
                            <el-col :span="19">
                                <el-row :class="index === 0 ? '' : 'bordertop'" v-for="(item2, index) in item1.children"
                                    :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRight(scope.row, item2.id)">{{
                                            item2.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag v-for="(item3, index) in item2.children" :key="item3.id" type="warning"
                                            closable @close="removeRight(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色权限"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="small" icon="el-icon-delete-solid">删除</el-button>
                        <el-button type="warning" size="small" icon="el-icon-s-tools"
                            @click="showSetRightDialogVisable(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>


        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="30%" @close="setRightDialogClose">
            <!-- 树形控件 -->
            <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rolesList: [],
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible: false,

            // 所有权限的数据
            rightList: [],
            // 树形控件的属性绑定对象 用于正确展示树形结构
            treeProps: {
                children: 'children',
                label: 'authName'
            },
            // 默认选中节点的id值
            defKeys: [],
            // 当前即将分配角色的id值
            roleId:'',
        }
    },
    methods: {
        async getRoles() {
            await this.$api.roles.getRolesList().then(resp => {
                if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                this.rolesList = resp.data
            })
        },
        // 根据id删除对应的权限
        async removeRight(role, rightId) {
            await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                this.$api.roles.removeRightById(role.id, rightId).then((resp) => {
                    if (resp.meta.status !== 200) this.$message.error(resp.meta.msg)
                    role.children = resp.data
                })
                this.$message.success('取消角色权限成功');
            }).catch(() => {
                console.log(role, rightId);
                this.$message.info('已取消删除');
            });
        },
        // 展示分配权限的对话框
        async showSetRightDialogVisable(role) {
            await this.$api.rights.getRightsTree().then(resp => {
                if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                this.rightList = resp.data
            })
            this.roleId = role.id
            this.defKeys = []
            // 递归获取三级节点的id
            this.getLeafKeys(role, this.defKeys)
            this.setRightDialogVisible = true
        },
        // 通过递归的形式，获取角色下所有三级权限的id
        getLeafKeys(node, arr) {
            // 如果当前节点不包含children属性，则是三级节点
            if (!node.children) {
                return arr.push(node.id)
            }

            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            })
        },
        setRightDialogClose() {
            this.defKeys = []
            this.setRightDialogVisible = false
        },
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const strKeys = keys.join(',')
            await this.$api.roles.addRightById(this.roleId,{rids:strKeys}).then(resp=>{
                if(resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                this.$message.success(resp.meta.msg)

                this.getRoles()
                this.setRightDialogVisible = false

            })
        }
    },
    created() {
        this.getRoles()
    },
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 8px 8px 8px 48px;
}

.bordertop {
    border-top: 1px solid #ccc;
}

.borderbottom {
    border-bottom: 1px solid #ccc;
}

.el-row {
    display: flex;
    align-items: center;
}
</style>