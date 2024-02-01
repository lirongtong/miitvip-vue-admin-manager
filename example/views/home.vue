<template>
    <mi-theme>
        <mi-layout />
    </mi-theme>
</template>

<script lang="ts" setup>
import { DashboardOutlined, ThunderboltOutlined, CrownOutlined, SisternodeOutlined, GlobalOutlined, SendOutlined, SaveOutlined, ToolOutlined } from '@ant-design/icons-vue'
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
    },
    {
        name: 'start',
        path: '/start',
        meta: {
            title: '快速上手',
            subTitle: 'Getting Started',
            icon: ThunderboltOutlined
        }
    },
    {
        name: 'theme',
        path: '/theming',
        meta: {
            title: '主题定制',
            subTitle: 'Theming',
            icon: CrownOutlined
        }
    },
    {
        name: 'tools',
        path: '/tools',
        meta: {
            title: '系统工具',
            subTitle: 'System Tools',
            icon: SisternodeOutlined
        },
        children: [{
            name: 'tools-global',
            path: '/tools/global',
            meta: {
                title: '全局变量',
                subTitle: 'Global Variables',
                icon: GlobalOutlined
            }
        }, {
            name: 'tools-request',
            path: '/tools/request',
            meta: {
                title: '请求响应',
                subTitle: 'Request & Response',
                icon: SendOutlined
            }
        }, {
            name: 'tools-cache',
            path: '/tools/cache',
            meta: {
                title: '本地缓存',
                subTitle: 'Local Cache',
                icon: SaveOutlined
            }
        }, {
            name: 'tools-function',
            path: '/tools/function',
            meta: {
                title: '工具函数',
                subTitle: 'Utility Function',
                icon: ToolOutlined
            }
        }]
    }
])
</script>