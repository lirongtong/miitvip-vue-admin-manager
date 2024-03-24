<template>
    <mi-login :action="() => handleLogin()" />
</template>

<script setup lang="ts">
const handleLogin = () => {
    console.log('login')
    // do sometion
    // return `boolean` or `string`
    return true
}
</script>