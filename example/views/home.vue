<template>
    <mi-theme>
        <mi-layout />
    </mi-theme>
</template>

<script lang="ts" setup>
import { ComponentInternalInstance, getCurrentInstance, onMounted } from 'vue'
import { DashboardOutlined } from '@ant-design/icons-vue'

let _this: any
onMounted(() => {
    const { appContext: { config: { globalProperties: vm } } } = getCurrentInstance() as ComponentInternalInstance
    _this = vm
    _this.$g.menus = [
        {
            name: 'dashboard',
            path: '/dashboard',
            meta: {
                title: '控制中心',
                icon: DashboardOutlined,
                tag: {color: '#f50', content: 'Hot'}
            }
        }
    ]
})
</script>