<template>
    <mi-login :action="api.login"
        :open-captcha="false"
        :background="bg"
        :captcha-init-action="api.captcha.init"
        :captcha-verify-action="api.captcha.verify" />
</template>

<script setup>
import bg from '@images/login-bg.jpg'
</script>