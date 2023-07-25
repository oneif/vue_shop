<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

            <el-steps :space="300" :active="parseInt(activeStep)" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addGoodForm" :rules="addGoodFormRules" ref="addGoodFormRef" label-width="100px"
                label-position="top">
                <!-- 左侧导航条 -->
                <el-tabs tab-position="left" v-model="activeStep" :before-leave="beforeTagChange">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="addGoodForm.goods_cat" :options="categoriesList" :props="categoriesProps"
                                @change="hadleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="item" v-for="(item, index) in item.attr_vals"
                                    :key="index"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action 表示图片要被上传到的地址 -->
                        <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addGoodForm.goods_introduce"></quill-editor>
                        <el-button type="primary" @click="addGood">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>


            </el-form>
        </el-card>

        <!-- 预览图片对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="45%">
            <img :src="previewPath" alt="是你" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            activeStep: '0',
            addGoodForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                // 商品所属的分类数组
                goods_cat: [],
                // 上传图片的数组
                pics: [],
                // 商品详情介绍
                goods_introduce:'',
                // 商品的参数数组
                attrs:[]
            },
            // 添加商品的表单验证规则
            addGoodFormRules: {
                goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
                goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
                goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
                goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
                goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
            },
            // 级联选择器的数据
            categoriesList: [],
            // 级联选择器的配置对象
            categoriesProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
            // 动态参数列表
            manyTableData: [],
            // 静态参数列表
            onlyTableData: [],
            // 上传的请求头
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 图片预览的地址
            previewPath: '',
            // 图片预览的对话框
            previewVisible:false
        }
    },
    methods: {
        async getCategories() {
            await this.$api.categories.getCategoriesList().then(resp => {
                if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                this.categoriesList = resp.data
            })
        },
        // 级联选择器选中项变化，会触发这个函数
        hadleChange() {
            if (this.addGoodForm.goods_cat.length !== 3) {
                this.addGoodForm.goods_cat = []
            }
        },
        // 左边tag标签切换前会调用这个函数 如果为false则不允许切换
        beforeTagChange(activeName, oldActiveName) {
            if (oldActiveName == '0' && this.addGoodForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类！')
                return false
            }
            if (activeName == '1') {
                this.$api.categoriesAttributes.getCategoryAttributes(this.addGoodForm.goods_cat[2], { sel: 'many' }).then(resp => {
                    if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                    resp.data.forEach(item => {
                        if (item.attr_vals) {
                            item.attr_vals = item.attr_vals.split(',')
                        } else return item.attr_vals = []
                    });
                    this.manyTableData = resp.data
                })
            }
            if (activeName == '2') {
                this.$api.categoriesAttributes.getCategoryAttributes(this.addGoodForm.goods_cat[2], { sel: 'only' }).then(resp => {
                    if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg)
                    this.onlyTableData = resp.data
                })
            }
        },
        // 图片预览效果
        handlePreview(file) {
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        // 移除图片
        handleRemove(file) {
            const filePath = file.response.data.tmp_path
            this.addGoodForm.pics = this.addGoodForm.pics.filter(item => item.pic !== filePath)
            console.log(this.addGoodForm.pics);
        },
        // 上传成功后的回调函数
        handleSuccess(resp) {
            const picInfo = { "pic": resp.data.tmp_path }
            this.addGoodForm.pics.push(picInfo)
            console.log(this.addGoodForm.pics);
        },
        // 添加商品
        addGood(){
            this.$refs.addGoodFormRef.validate(async valid => {
                if(!valid) return this.$message.error('请填写必要的表单项')

                // 深拷贝addGoodForm
                let addForm = JSON.parse(JSON.stringify(this.addGoodForm))
                addForm.goods_cat = addForm.goods_cat.join(',')

                // 处理动态参数
                this.manyTableData.forEach(item =>{
                    const newInfo = {
                        "attr_id":item.attr_id,
                        "attr_value":item.attr_vals.join('')
                    }
                    addForm.attrs.push(newInfo)
                })
                // 处理静态属性
                this.onlyTableData.forEach(item =>{
                    const newInfo = {
                        "attr_id":item.attr_id,
                        "attr_value":item.attr_vals
                    }
                    addForm.attrs.push(newInfo)
                })

                await this.$api.goods.addGood(addForm).then(resp=>{
                    if(resp.meta.status !==201) return this.$message.error(reps.meta.msg)
                    this.$message.success(resp.meta.msg)
                    this.$router.push('/goods')
                })
            })
        }
    },
    mounted() {
        this.getCategories()
    },
}
</script>

<style lang="less" scoped>
.el-steps {
    margin: 16px 0;
}

.el-checkbox {
    margin: 0 10px 0 0;
}
.previewImg{
    width: 100%;
}
.quill-editor {
    margin-bottom: 20px;
}
::v-deep .ql-container{
    min-height: 300px;
}
</style>