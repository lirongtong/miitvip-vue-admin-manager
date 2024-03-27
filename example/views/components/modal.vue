<template>
    <button class="btn" @click="handleModal">点击打开弹窗</button>
    <div class="btn" @click="handleQuickModal('success')">Success</div>
    <mi-modal v-model:open="params.open" title="自定义弹窗标题（Title）" @after-close="handleAfterClose" @ok="handleOk" :closable="false" :container="false" :width="{ laptop: 800, mobile: 400 }">
        自定义弹窗内容（Content）
    </mi-modal>
</template>

<script setup lang="ts">
import { reactive, getCurrentInstance, type ComponentInternalInstance } from 'vue'

const { appContext: { config: { globalProperties: _this } } } = getCurrentInstance() as ComponentInternalInstance
const params = reactive({
    open: false
})

const handleModal = () => {
    params.open = !params.open
}

const handleAfterClose = () => {
    console.log('animation delay')
}

const handleOk = () => {
    params.open = !params.open
}

const handleQuickModal = (type: string) => {
    _this.$modal.success({content: '操作成功（Successed）'})
}
</script>