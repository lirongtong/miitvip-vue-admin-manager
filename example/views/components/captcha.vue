<template>
    <div style="padding-top: 80px">
        <mi-captcha :width="400" :radius="0" color="#34eb3d" :init-action="() => handleInit()" />
    </div>
</template>

<script setup lang="ts">
const handleInit = () => {
    return true
}
</script>