<template>
    <mi-modal v-model:visible="visible">
        Content
    </mi-modal>
    <a-button @click="visible = !visible">Click</a-button>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
const visible = ref(false)
const { appContext: {config: {globalProperties: vm}} } = getCurrentInstance()
vm.$miModal.confirm('Nice')
</script>