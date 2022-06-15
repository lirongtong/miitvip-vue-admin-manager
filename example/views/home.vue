<template>
    <mi-layout>
        <template v-slot:headerExtra>
            <mi-search :data="searchData" search-key="title" :width="120" :height="48" placeholder="搜索组件" :list-width="320" :list-height="335" :gap="4" :page-size="3" :list-radius="8" border-color="transparent" background-color="transparent"></mi-search>
        </template>
    </mi-layout>
</template>

<script setup>
import { inject, createVNode, getCurrentInstance } from 'vue'
import {
    DashboardOutlined, SisternodeOutlined, GlobalOutlined, SendOutlined,
    LayoutOutlined, LoginOutlined, ScheduleOutlined, ThunderboltOutlined,
    CrownOutlined, SaveOutlined, ToolOutlined, SnippetsOutlined, QuestionCircleOutlined,
    AppstoreAddOutlined, OrderedListOutlined, BellOutlined, GooglePlusOutlined,
    SwitcherOutlined, ScanOutlined, LikeFilled, SearchOutlined, SafetyCertificateOutlined,
    CloudUploadOutlined, BorderlessTableOutlined, MenuOutlined, FireFilled
} from '@ant-design/icons-vue'
const { appContext: {config: {globalProperties: vm}} } = getCurrentInstance()
vm.$g.menus.items = [{
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
        subTitle: 'Custom Theme',
        icon: CrownOutlined
    }
}, {
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
}, {
    name: 'pages',
    path: '/pages',
    meta: {
        title: '基础页面',
        subTitle: 'Base Pages',
        icon: SnippetsOutlined
    },
    children: [{
        name: 'pages-login',
        path: '/pages/login',
        meta: {
            title: '登录页面',
            subTitle: 'Log In',
            icon: LoginOutlined
        }
    }, {
        name: 'pages-register',
        path: '/pages/register',
        meta: {
            title: '注册页面',
            subTitle: 'Register',
            icon: ScheduleOutlined
        }
    }, {
        name: 'pages-forgot',
        path: '/pages/forgot',
        meta: {
            title: '忘记密码',
            subTitle: 'Forgot Password',
            icon: QuestionCircleOutlined
        }
    }]
}, {
    name: 'components',
    path: '/components',
    meta: {
        title: '定制组件',
        subTitle: 'Custom Components',
        icon: AppstoreAddOutlined,
        tag: {icon: FireFilled, color: '#ed4014'}
    },
    children: [{
        name: 'components-layout',
        path: '/components/layout',
        meta: {
            title: '基础布局',
            subTitle: 'Layout',
            icon: LayoutOutlined
        }
    }, {
        name: 'components-notice',
        path: '/components/notice',
        meta: {
            title: '消息中心',
            subTitle: 'Notice',
            icon: BellOutlined
        }
    }, {
        name: 'components-modal',
        path: '/components/modal',
        meta: {
            title: '弹窗提示',
            subTitle: 'Modal',
            icon: SwitcherOutlined
        }
    }, {
        name: 'components-captcha',
        path: '/components/captcha',
        meta: {
            title: '滑块验证',
            subTitle: 'Captcha',
            icon: ScanOutlined,
            tag: {icon: LikeFilled, color: '#4caf50'}
        }
    }, {
        name: 'components-search',
        path: '/components/search',
        meta: {
            title: '搜索联想',
            subTitle: 'Search',
            icon: SearchOutlined
        }
    }, {
        name: 'components-password',
        path: '/components/password',
        meta: {
            title: '密码设置',
            subTitle: 'Password',
            icon: SafetyCertificateOutlined
        }
    }, {
        name: 'components-upload',
        path: '/components/upload',
        meta: {
            title: '文件上传',
            subTitle: 'Upload',
            icon: CloudUploadOutlined
        }
    }, {
        name: 'components-anchor',
        path: '/components/anchor',
        meta: {
            title: '锚点链接',
            subTitle: 'Anchor',
            icon: BorderlessTableOutlined
        }
    }, {
        name: 'components-menu',
        path: '/components/menu',
        meta: {
            title: '左侧菜单',
            subTitle: 'Menu',
            icon: OrderedListOutlined
        }
    }, {
        name: 'components-dropdown',
        path: '/components/dropdown',
        meta: {
            title: '下拉菜单',
            subTitle: 'Dropdown',
            icon: MenuOutlined
        }
    }]
}, {
    name: 'advanced',
    path: '/advanced',
    meta: {
        title: '高级应用',
        subTitle: 'Advanced Application',
        icon: GooglePlusOutlined
    }
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
    link: '/register',
    icon: ScheduleOutlined
}]
</script>