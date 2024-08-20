<template>
    <mi-forget
        check-username-action="/v1/validators/account"
        :captcha-setting="{
            initAction: '/v1/captcha/init',
            verifyAction: '/v1/captcha/verify'
        }"
        send-code-action="/v1/password/captcha"
        check-code-action="/v1/password/captcha/verify"
        reset-password-action="/v1/password/reset"
        placeholder="请输入邮箱地址"
        @after-send-code="handleAfterSendCode" />
</template>

<script setup lang="ts">
const handleSendCode = () => {
    console.log('send code')
    // do sometion
    // return `boolean` or `string`
    return true
}
const handleCheckCode = () => {
    console.log('check code')
    // do sometion
    // return `boolean` or `string`
    return true
}

const handleResetPassword = () => {
    console.log('reset password')
    // do sometion
    // return `boolean` or `string`
    return `重置失败，请稍后再试`
}

const handleAfterSendCode = (data?: any) => {
    console.log('after send code', data)
}
</script>
