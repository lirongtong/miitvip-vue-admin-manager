<template>
    <button class="btn" @click="handleModal">点击打开弹窗</button>
    <mi-modal v-model:open="params.open" title="自定义弹窗标题（Title）" :container="false">
        自定义弹窗内容（Content）
    </mi-modal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const params = reactive({
    open: false
})

const handleModal = () => {
    params.open = !params.open
}
</script>