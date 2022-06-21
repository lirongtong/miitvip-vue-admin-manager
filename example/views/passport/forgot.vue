<template>
    <mi-forgot :background="bg" :send-code-action="api.password.captcha" :check-code-action="api.password.check" :reset-password-action="api.password.reset" />
</template>

<script setup>
import bg from '@images/login-bg.jpg'
</script>