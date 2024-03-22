<template>
    <div style="padding-top: 80px">
        <mi-theme-provider :tokens="tokens">
            <mi-captcha />
        </mi-theme-provider>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const tokens = reactive({
    captcha: {
        radar: {
            border: '#fff',
            dot: 'red'
        }
    }
})
</script>