<template>
    <a-card class="mi-card mi-card-code" :tab-list="tabs.list">
        <div v-if="tabs.active === 'effect'">1</div>
        <div v-if="tabs.active === 'template'">2</div>
    </a-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const tabs = reactive({
    list: [{
        key: 'effect',
        tab: '实时效果'
    }, {
        key: 'template',
        tab: 'Template'
    }],
    active: 'effect'
})
</script>