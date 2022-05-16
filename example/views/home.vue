<template>
    <mi-layout></mi-layout>
</template>

<script setup>
import { inject, createVNode } from 'vue'
import { DashboardOutlined } from '@ant-design/icons-vue'
const $g = inject('$g')
$g.menus.items = [{
    name: 'dashboard',
    path: '/dashboard',
    meta: {
        title: '控制中心',
        subTitle: 'Dashboard',
        icon: createVNode(DashboardOutlined),
        tag: {color: '#f50', content: 'Hot'}
    }
}]
</script>