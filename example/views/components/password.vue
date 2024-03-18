<template>
    <mi-password v-model="password" v-model:confirm-value="confirm" :confirm="true" @change="handleChange" @confirm-change="handleConfirmChange" />
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    
    const password = ref<string>('')
    const confirm = ref<string>('')

    const handleChange = (value: string) => {
        // do something
        console.log(value, password.value)
    }

    const handleConfirmChange = (value: string) => {
        // do something
        console.log(value, confirm.value)
    }
</script>