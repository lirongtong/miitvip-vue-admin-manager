<template>
    <mi-theme>
        <mi-layout />
    </mi-theme>
</template>

<script lang="ts" setup>
import { DashboardOutlined, ThunderboltOutlined, CrownOutlined, SisternodeOutlined, GlobalOutlined, SendOutlined, SaveOutlined, ToolOutlined, SnippetsOutlined, LoginOutlined, ScheduleOutlined, QuestionCircleOutlined, AppstoreAddOutlined, FireFilled, LayoutOutlined, BellOutlined, SwitcherOutlined, ScanOutlined, LikeFilled, SearchOutlined, ClockCircleOutlined, SafetyCertificateOutlined, BorderlessTableOutlined, OrderedListOutlined, MenuOutlined, CodeOutlined, InfoCircleOutlined, ExclamationCircleOutlined, HighlightOutlined, VerticalAlignTopOutlined, GithubOutlined } from '@ant-design/icons-vue'
import { useStoreMenu } from '../../src/index'

// update menus
const menuStore = useStoreMenu()
menuStore.updateMenus([
    {
        name: 'about',
        path: '/about',
        meta: {
            title: '关于 MAP',
            subTitle: 'About us',
            icon: InfoCircleOutlined
        }
    },
    {
        name: 'dashboard',
        path: '/dashboard',
        meta: {
            title: '控制中心',
            subTitle: 'Control Center',
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
        name: 'theming',
        path: '/theming',
        meta: {
            title: '主题定制',
            subTitle: 'Custom Theme',
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
    },
    {
        name: 'pages',
        path: '/pages',
        meta: {
            title: '常用页面',
            subTitle: 'General Pages',
            icon: SnippetsOutlined
        },
        children: [{
            name: 'pages-login',
            path: '/pages/login',
            meta: {
                title: '登录页面',
                subTitle: 'Login Page',
                icon: LoginOutlined
            }
        }, {
            name: 'pages-register',
            path: '/pages/register',
            meta: {
                title: '注册页面',
                subTitle: 'Register Page',
                icon: ScheduleOutlined
            }
        }, {
            name: 'pages-forget',
            path: '/pages/forget',
            meta: {
                title: '忘记密码',
                subTitle: 'Forget Page',
                icon: QuestionCircleOutlined
            }
        }]
    },
    {
        name: 'components',
        path: '/components',
        meta: {
            title: '定制组件',
            subTitle: 'Components',
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
            name: 'components-clock',
            path: '/components/clock',
            meta: {
                title: '精美钟表',
                subTitle: 'Clock',
                icon: ClockCircleOutlined
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
                title: '导航菜单',
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
        }, {
            name: 'components-code',
            path: '/components/code',
            meta: {
                title: '代码高亮',
                subTitle: 'Code',
                icon: CodeOutlined
            }
        }, {
            name: 'components-title',
            path: '/components/title',
            meta: {
                title: '标题设置',
                subTitle: 'Title',
                icon: HighlightOutlined
            }
        }, {
            name: 'components-quote',
            path: '/components/quote',
            meta: {
                title: '引用说明',
                subTitle: 'Quote',
                icon: ExclamationCircleOutlined
            }
        }, {
            name: 'components-backtop',
            path: '/components/backtop',
            meta: {
                title: '回到顶部',
                subTitle: 'Backtop',
                icon: VerticalAlignTopOutlined
            }
        }, {
            name: 'components-socialite',
            path: '/components/socialite',
            meta: {
                title: '授权登陆',
                subTitle: 'Socialite',
                icon: GithubOutlined
            }
        }]
    }
])
</script>