<template>
    <el-row align="middle">
        <el-col style="margin-top: 5vh;">
            <el-row justify="space-between">
                <el-col :span="5">
                </el-col>
                <el-col :span="14" style="text-align: center">
                    <div style="font-size: 2vw;margin-bottom: 2vh;font-weight: bold">注册新用户</div>
                    <div style="font-size: 14px;color: grey">欢迎注册</div>
                </el-col>
                <el-col :span="5">
                </el-col>
            </el-row>
        </el-col>
        <el-col style="margin-top: 5vh;padding: 5%">
            <el-form ref="formRef" :model="form" :rules="rules" @validate="onValidDate">
                <el-form-item prop="username">
                    <el-input v-model="form.username" :maxlength="8" :minlength="2" placeholder="用户名" type="text">
                        <template #prefix>
                            <el-icon>
                                <User/>
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" :minlength="6" maxlength="20" placeholder="密码"
                              style="margin-top: 10px" type="password">
                        <template #prefix>
                            <el-icon>
                                <Lock/>
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password_repeat">
                    <el-input v-model="form.password_repeat" :maxlength="20" :minlength="6" placeholder="重复密码"
                              style="margin-top: 10px" type="password">
                        <template #prefix>
                            <el-icon>
                                <Lock/>
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="form.email" placeholder="电子邮箱地址" style="margin-top: 10px">
                        <template #prefix>
                            <el-icon>
                                <Message/>
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model="form.code" :maxlength="6" :minlength="6" placeholder="输入验证码" type="code">
                        <template #prefix>
                            <el-icon>
                                <EditPen/>
                            </el-icon>
                        </template>
                        <template #append>
                            <el-button :disabled="!isEmailValid" text @click="validateEmail()">{{ EmailMessage }}
                            </el-button>
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col style="margin-top: 5vh;text-align: center">
            <el-row justify="space-between">
                <el-col :span="8">

                </el-col>
                <el-col :span="8">
                    <el-button style="width: 10vw" type="warning" @click="register()">立即注册</el-button>
                </el-col>
                <el-col :span="8">

                </el-col>
            </el-row>
        </el-col>
        <el-divider>
            <span style="color: grey;font-size: 10px">已有账号</span>
        </el-divider>
        <el-col>
            <el-row justify="space-between">
                <el-col :span="5">
                </el-col>
                <el-col :span="8" style="text-align: center">
                    <el-link style="font-size: 14px" type="primary" @click="router.push('/')">立即登录</el-link>
                </el-col>
                <el-col :span="5">
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script setup>
import {EditPen, Lock, Message, User} from "@element-plus/icons-vue";
import router from "@/router";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {post} from "@/net";

const form = reactive({
    username: '',
    password: '',
    password_repeat: '',
    email: '',
    code: ''
})
const validateUserName = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入用户名'))
    } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {

        callback(new Error('用户名不能包含特殊字符，只能是中文/英文'))
    } else
        callback()
}
const validatePass2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== form.password) {
        callback(new Error("两次输入的密码不一致!"))
    } else {
        callback()
    }
}
const rules = {
    username: [
        {validator: validateUserName, trigger: ['blur', 'change']},
        {min: 2, max: 8, message: '用户名长度必须在2-8个字符之间', trigger: ['blur', 'change']},
    ],
    password: [
        {required: true, message: '请输入密码', trigger: ['blur', 'change']},
        {min: 6, max: 20, message: '密码长度必须在6-20个字符之间', trigger: ['blur', 'change']}
    ],
    password_repeat: [{validator: validatePass2, trigger: ['blur', 'change']}],
    email: [
        {required: true, message: '请输入电子邮箱地址', trigger: ['blur', 'change']},
        {type: 'email', message: '电子邮箱格式不正确', trigger: ['blur', 'change']}
    ],
    code: [
        {required: true, message: '请输入验证码', trigger: ['blur']},

    ]
}

const isEmailValid = ref(true)
const EmailMessage = ref("获取验证码")
let countDown = ref(60)
const validateEmail = () => {
    if (form.email === null || form.email === "") {
        return ElMessage.warning("请输入邮箱")
    }
    if (!isEmailValid)
        return
    isEmailValid.value = false
    let timer = setInterval(() => {
        if (countDown.value > 0) {
            EmailMessage.value = countDown.value + 's后重新获取验证码'
            countDown.value--
        } else {
            clearInterval(timer);
            isEmailValid.value = true; // 启用按钮
            countDown.value = 60; // 重置倒计时时间
            EmailMessage.value = "重新获取验证码"
        }
    }, 1000);
    post('/cat/auth/valid-register-email', {
        email: form.email
    }, (message) => {
        ElMessage.success(message)
    })
}
const onValidDate = (prop, isValid) => {
    if (prop === 'email') {
        isEmailValid.value = isValid
    }
}

const formRef = ref()
const register = () => {
    formRef.value.validate((isValid) => {
        if (isValid) {
            post('/cat/auth/register', {
                username: form.username,
                password: form.password,
                email: form.email,
                code: form.code
            }, (message) => {
                ElMessage.success(message)
                router.push("/")
            })
        } else {
            ElMessage.warning('请完整填写注册表单内容！')
        }
    })
}


</script>

<style scoped>

</style>
