<template>
    <mi-layout></mi-layout>
</template>

<script setup>
import { inject, createVNode } from 'vue'
import {
    DashboardOutlined, SisternodeOutlined, GlobalOutlined, SendOutlined
} from '@ant-design/icons-vue'
const $g = inject('$g')
$g.menus.items = [{
    name: 'dashboard',
    path: '/dashboard',
    meta: {
        title: '控制中心',
        subTitle: 'Dashboard',
        icon: DashboardOutlined,
        tag: {color: '#f50', content: 'Hot'}
    }
}, {
    name: 'tools',
    path: '/tools',
    meta: {
        title: '系统工具',
        subTitle: 'Tools',
        icon: SisternodeOutlined
    },
    children: [{
        name: 'tools-global',
        path: '/tools/global',
        meta: {
            title: '全局变量',
            subTitle: 'Global Config',
            icon: GlobalOutlined
        }
    }, {
        name: 'tools-request',
        path: '/tools/request',
        meta: {
            title: '请求响应',
            subTitle: 'Request / Response',
            icon: SendOutlined
        }
    }]
}]
</script>