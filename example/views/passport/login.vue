<template>
    <mi-login
        action="/v1/login"
        :captcha-setting="{
            initAction: '/v1/captcha/init',
            verifyAction: '/v1/captcha/verify'
        }"
        :captcha="false"
        @after-login="handleAfterLogin" />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useCookie, useStorage, useTools, type ResponseData } from '../../../src/index'

const route = useRoute()
const router = useRouter()
const { $tools } = useTools()
const { $cookie } = useCookie()
const { $storage } = useStorage()

const handleAfterLogin = (res?: ResponseData) => {
    if (res?.ret?.code === 200) {
        const tokens = res?.data?.tokens
        if (tokens?.access_token)
            $cookie.set('access-token', tokens?.access_token, tokens?.expires_in)
        if (tokens?.refresh_token) $cookie.set('refresh-token', tokens?.refresh_token)
        if (res?.data?.user) $storage.set('user-info', res?.data?.user)
        const path = route.query?.redirect as string
        if (path) {
            if ($tools.isUrl(path)) window.location.href = path
            else router.push({ path })
        } else router.push({ path: '/' })
    }
}
</script>
