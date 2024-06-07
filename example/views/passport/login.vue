<template>
    <mi-login
        action="/v1/login"
        :captcha-setting="{
            initAction: '/v1/captcha/init',
            verifyMethod: 'post',
            verifyAction: '/v1/captcha/verify',
            verifyParams: { key: captchaKey }
        }"
        @captcha-init="handleCaptchaInit"
        :socialite-setting="{ domain: 'http://local-account.makeit.vip/v1/oauth' }" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const captchaKey = ref<string>('')

const handleCaptchaInit = (data?: any) => {
    if (data?.ret?.code === 200) {
        if (data?.data?.key) captchaKey.value = data.data.key
    }
}
</script>