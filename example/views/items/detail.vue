<template>
    <mi-items-detail :data="data" :max-width="1120" />
</template>

<script setup lang="ts">
// @ts-ignore
import thumb from '@/assets/images/background.jpg'

const data = [
    {
        title: '投资人关系',
        thumb
    },
    {
        title: '电子采购',
        thumb
    },
    {
        title: '股东福利',
        thumb
    },
    {
        title: '投资管理',
        thumb
    }
]
</script>