<template>
    <mi-layout>
        <template v-slot:headerExtra>
            <mi-search :data="searchData" search-key="title" :width="120" :height="48" :placeholder="t('search.components')" :list-width="320" :list-height="335" :gap="4" :page-size="3" :list-radius="8" border-color="transparent" background-color="transparent"></mi-search>
        </template>
    </mi-layout>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'

import {
    DashboardOutlined, SisternodeOutlined, GlobalOutlined, SendOutlined,
    LayoutOutlined, LoginOutlined, ScheduleOutlined, ThunderboltOutlined,
    CrownOutlined, SaveOutlined, ToolOutlined, SnippetsOutlined, QuestionCircleOutlined,
    AppstoreAddOutlined, OrderedListOutlined, BellOutlined, GooglePlusOutlined,
    SwitcherOutlined, ScanOutlined, LikeFilled, SearchOutlined, SafetyCertificateOutlined,
    BorderlessTableOutlined, MenuOutlined, FireFilled, RetweetOutlined, GithubOutlined,
    LogoutOutlined, CodeOutlined, PicRightOutlined, TransactionOutlined
} from '@ant-design/icons-vue'

const { appContext: {config: {globalProperties: vm}} } = getCurrentInstance()
const store = useStore()
const router = useRouter()
const { locale, t } = useI18n()

vm.$g.menus.items = [{
    name: 'dashboard',
    path: '/dashboard',
    meta: {
        title: locale.value === 'en-us' ? 'Dashboard' : '控制中心',
        icon: DashboardOutlined,
        tag: {color: '#f50', content: 'Hot'}
    }
}, {
    name: 'start',
    path: '/start',
    meta: {
        title: locale.value === 'en-us' ? 'Getting Started' : '快速上手',
        icon: ThunderboltOutlined
    }
}, {
    name: 'theme',
    path: '/theme',
    meta: {
        title: '主题定制',
        icon: CrownOutlined
    }
}, {
    name: 'tools',
    path: '/tools',
    meta: {
        title: '系统工具',
        icon: SisternodeOutlined
    },
    children: [{
        name: 'tools-global',
        path: '/tools/global',
        meta: {
            title: '全局变量',
            icon: GlobalOutlined
        }
    }, {
        name: 'tools-request',
        path: '/tools/request',
        meta: {
            title: '请求响应',
            icon: SendOutlined
        }
    }, {
        name: 'tools-caches',
        path: '/tools/caches',
        meta: {
            title: '本地缓存',
            icon: SaveOutlined
        }
    }, {
        name: 'tools-functions',
        path: '/tools/functions',
        meta: {
            title: '工具函数',
            icon: ToolOutlined
        }
    }]
}, {
    name: 'pages',
    path: '/pages',
    meta: {
        title: '基础页面',
        icon: SnippetsOutlined
    },
    children: [{
        name: 'pages-login',
        path: '/pages/login',
        meta: {
            title: '登录页面',
            icon: LoginOutlined
        }
    }, {
        name: 'pages-register',
        path: '/pages/register',
        meta: {
            title: '注册页面',
            icon: ScheduleOutlined
        }
    }, {
        name: 'pages-forget',
        path: '/pages/forget',
        meta: {
            title: '忘记密码',
            icon: QuestionCircleOutlined
        }
    }]
}, {
    name: 'components',
    path: '/components',
    meta: {
        title: '定制组件',
        icon: AppstoreAddOutlined,
        tag: {icon: FireFilled, color: '#ed4014'}
    },
    children: [{
        name: 'components-layout',
        path: '/components/layout',
        meta: {
            title: '基础布局',
            icon: LayoutOutlined
        }
    }, {
        name: 'components-notice',
        path: '/components/notice',
        meta: {
            title: '消息中心',
            icon: BellOutlined
        }
    }, {
        name: 'components-modal',
        path: '/components/modal',
        meta: {
            title: '弹窗提示',
            icon: SwitcherOutlined
        }
    }, {
        name: 'components-captcha',
        path: '/components/captcha',
        meta: {
            title: '滑块验证',
            icon: ScanOutlined,
            tag: {icon: LikeFilled, color: '#4caf50'}
        }
    }, {
        name: 'components-search',
        path: '/components/search',
        meta: {
            title: '搜索联想',
            icon: SearchOutlined
        }
    }, {
        name: 'components-password',
        path: '/components/password',
        meta: {
            title: '密码设置',
            icon: SafetyCertificateOutlined
        }
    }, {
        name: 'components-anchor',
        path: '/components/anchor',
        meta: {
            title: '锚点链接',
            icon: BorderlessTableOutlined
        }
    }, {
        name: 'components-menu',
        path: '/components/menu',
        meta: {
            title: '左侧菜单',
            icon: OrderedListOutlined
        }
    }, {
        name: 'components-dropdown',
        path: '/components/dropdown',
        meta: {
            title: '下拉菜单',
            icon: MenuOutlined
        }
    }, {
        name: 'components-history',
        path: '/components/history',
        meta: {
            title: '历史路由',
            icon: RetweetOutlined
        }
    }, {
        name: 'components-code',
        path: '/components/code',
        meta: {
            title: '代码高亮',
            icon: CodeOutlined
        }
    }]
}, {
    name: 'advanced',
    path: '/advanced',
    meta: {
        title: locale.value === 'en-us' ? 'Advanced Apps' : '高级应用',
        icon: GooglePlusOutlined
    },
    children: [{
        name: 'advanced-management-menu',
        path: '/advanced/management/menu',
        meta: {
            title: locale.value === 'en-us' ? 'Menu Management' : '菜单管理',
            icon: PicRightOutlined
        }
    }, {
        name: 'advanced-management-language',
        path: '/advanced/management/language',
        meta: {
            title: locale.value === 'en-us' ? 'Language Management' : '语言管理',
            icon: TransactionOutlined
        }
    }, {
        name: 'advanced-management-apps',
        path: '/advanced/management/apps',
        meta: {
            title: locale.value === 'en-us' ? 'Apps Management' : '应用管理',
            icon: AppstoreAddOutlined
        }
    }]
}]

vm.$g.menus.dropdown = [{
    name: 'github',
    title: 'Github',
    path: 'https://github.com/lirongtong/miitvip-vue-admin-manager',
    icon: GithubOutlined,
    tag: { content: 'Hot' }
},
{
    name: 'npmjs',
    title: 'NpmJS',
    path: 'https://www.npmjs.com/package/makeit-admin-pro',
    icon: AppstoreAddOutlined,
    tag: { icon: FireFilled }
},
{
    name: 'logout',
    title: '退出登录',
    icon: LogoutOutlined,
    callback: () => {
        vm.$modal.confirm({
            content: '确定退出当前系统 ? ',
            onOk: () => {
                store.dispatch('passport/logout').then((res) => {
                    if (res?.ret?.code === 200) router.push({path: '/login'})
                    else message.error(res?.ret?.message)
                }).catch((err) => message.error(err.message))
            }
        })
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