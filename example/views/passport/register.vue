<template>
    <mi-register
        action="/v1/register"
        :captcha-setting="{
            initAction: '/v1/captcha/init',
            verifyMethod: 'post',
            verifyAction: '/v1/captcha/verify',
            verifyParams: { key: captchaKey }
        }"
        @captcha-init="handleCaptchaInit" />
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
