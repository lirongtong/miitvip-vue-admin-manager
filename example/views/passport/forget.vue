<template>
    <mi-forget :send-code-action="() => handleSendCode()" :check-code-action="() => handleCheckCode()" :reset-password-action="() => handleResetPassword()" />
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
</script>
