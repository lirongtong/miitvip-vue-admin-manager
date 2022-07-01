<template>
    <mi-forgot :background="bg"
        :check-input-action="api.validator.user"
        :send-code-action="api.password.captcha"
        :check-code-action="api.password.check"
        :reset-password-action="api.password.reset"
        :captcha-init-action="api.captcha.init"
        :captcha-verify-action="api.captcha.verify" />
</template>

<script setup>
import bg from '@images/login-bg.jpg'
</script>