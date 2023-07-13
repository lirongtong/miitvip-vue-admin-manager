<template>
    <mi-captcha ref="captchaRef" :init-action="api.captcha.init" />
    <a @click="reset">重置</a>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    const captchaRef = ref(null)
    const reset = () => {
        console.log(captchaRef.value?.reset())
    }
</script>