<template>
    <mi-register
        :action="api.register"
        :captcha-init-action="api.captcha.init"
        :captcha-verify-params="captchaVerifyParams"
        :captcha-verify-action="api.captcha.verification"
        @captcha-init="handleCaptchaInit"
        :username-verify-action="api.validator.name"
        :email-verify-action="api.validator.email">
    </mi-register>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
    setup() {
        const captchaVerifyParams = reactive({
            id: null,
            key: null
        })
        const handleCaptchaInit = (response: any) => {
            if (response.ret.code === 1) {
                captchaVerifyParams.id = response.data.id
                captchaVerifyParams.key = response.data.key
            }
        }
        return { handleCaptchaInit, captchaVerifyParams }
    }
})
</script>