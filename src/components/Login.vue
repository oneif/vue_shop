<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!-- 登录表单 -->
            <el-form ref="loginFormRef" class="login_info" :model="loginForm" :rules="loginFormRules">
                <el-form-item prop="username">
                    <el-input placeholder="请输入用户名" prefix-icon="el-icon-user-solid" v-model="loginForm.username">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" show-password v-model="loginForm.password">
                    </el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="danger" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 这是表单的验证规则对象
            loginFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            },
        }
    },
    methods: {
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields()
        },
        login(){
            this.$refs.loginFormRef.validate(async valid => {
                if(!valid) alert('请求有问题')
                await this.$api.login.login(this.loginForm).then((resp)=>{
                    if(resp.data.meta.status !== 200) return this.$message.error('登录失败')
                    // 登录成功后做的事情
                    this.$message.success('登录成功')
                    console.log(resp.data);
                    window.sessionStorage.setItem('token',resp.data.data.token)
                    this.$router.push('/home')
                })
            })
        }
    },
}
</script>

<style lang="less" scoped>
.login_container {
    height: 100%;
    background-color: #2b4b6b;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        border: 2px solid #ccc;
        overflow: hidden;
        box-shadow: 2px 2px 10px #999;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }

    .login_info {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
    }

    .btns {
        display: flex;
        justify-content: end;
    }
}
</style>