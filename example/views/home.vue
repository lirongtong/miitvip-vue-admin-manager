<template>
    <mi-theme>
        <mi-layout />
    </mi-theme>
</template>

<script lang="ts" setup>
import { DashboardOutlined } from '@ant-design/icons-vue'
import { useMapMenuStore } from '@makeit/admin-pro'

const menuStore = useMapMenuStore()
menuStore.updateMenus([
    {
        name: 'dashboard',
        path: '/dashboard',
        meta: {
            title: '控制中心',
            subTitle: 'Dashboard',
            icon: DashboardOutlined,
            tag: {color: '#f50', content: 'Hot'}
        }
    }
])
</script>