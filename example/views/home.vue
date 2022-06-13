<template>
    <mi-layout>
        <template v-slot:headerExtra>
            <mi-search :data="searchData" search-key="title" :width="120" :height="48" placeholder="搜索组件" :list-width="320" :list-height="335" :gap="4" :page-size="3" :list-radius="8" border-color="transparent" background-color="transparent"></mi-search>
        </template>
    </mi-layout>
</template>

<script setup>
import { inject, createVNode } from 'vue'
import {
    DashboardOutlined, SisternodeOutlined, GlobalOutlined, SendOutlined,
    LayoutOutlined, LoginOutlined, ScheduleOutlined, ThunderboltOutlined,
    CrownOutlined, SaveOutlined, ToolOutlined
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
    name: 'start',
    path: '/start',
    meta: {
        title: '快速上手',
        subTitle: 'Getting Started',
        icon: ThunderboltOutlined
    }
}, {
    name: 'theme',
    path: '/theme',
    meta: {
        title: '主题定制',
        subTitle: 'Theme Customization',
        icon: CrownOutlined
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
    }, {
        name: 'tools-caches',
        path: '/tools/caches',
        meta: {
            title: '本地缓存',
            subTitle: 'Cookie / Storage',
            icon: SaveOutlined
        }
    }, {
        name: 'tools-functions',
        path: '/tools/functions',
        meta: {
            title: '工具函数',
            subTitle: 'Public Function Library',
            icon: ToolOutlined
        }
    }]
}]
const searchData = [{
    title: '页面布局',
    content: '基于 Layout 组件的二次定制',
    link: '/layout',
    icon: LayoutOutlined
}, {
    title: '登录页面',
    content: '快速构建精美「登录页面」',
    link: '/login',
    icon: LoginOutlined
}, {
    title: '注册页面',
    content: '快速构建精美「注册页面」',
    link: '/login',
    icon: ScheduleOutlined
}]
</script>