<template>
    <mi-theme>
        <mi-layout />
    </mi-theme>
</template>

<script lang="ts" setup>
import { DashboardOutlined, ThunderboltOutlined, CrownOutlined, SisternodeOutlined, GlobalOutlined, SendOutlined, SaveOutlined, ToolOutlined, SnippetsOutlined, LoginOutlined, ScheduleOutlined, QuestionCircleOutlined, AppstoreAddOutlined, FireFilled, LayoutOutlined, BellOutlined, SwitcherOutlined, ScanOutlined, LikeFilled, SearchOutlined, ClockCircleOutlined, SafetyCertificateOutlined, BorderlessTableOutlined, OrderedListOutlined, MenuOutlined, CodeOutlined, InfoCircleOutlined, ExclamationCircleOutlined, HighlightOutlined, VerticalAlignTopOutlined, GithubOutlined, WarningOutlined, AlignCenterOutlined, ToTopOutlined, PicRightOutlined, SecurityScanOutlined, TransactionOutlined, AppleOutlined, CoffeeOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { useStoreMenu, useStoreSearch } from '../../src/index'

// update menus
const menuStore = useStoreMenu()
const searchStore = useStoreSearch()
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
    },
    {
        name: 'advanced',
        path: '/advanced',
        meta: {
            title: '高级应用',
            subTitle: 'Advanced',
            icon: AppleOutlined,
            tag: { content: '授权', color: '#e6300b' }
        },
        children: [
            {
                name: 'advanced-language',
                path: '/advanced/language',
                meta: {
                    title: '语系管理',
                    subTitle: 'Language',
                    icon: CoffeeOutlined
                }
            },
            {
                name: 'advanced-menu',
                path: '/advanced/menu',
                meta: {
                    title: '菜单管理',
                    subTitle: 'Menu',
                    icon: MenuUnfoldOutlined
                }
            }
        ]
    }
])
searchStore.updateData([
    {
        title: `关于 MAP`,
        summary: `框架特性 · 设计初衷`,
        icon: ExclamationCircleOutlined,
        path: '/about'
    },
    {
        title: `控制中心`,
        summary: `纵观全局 · 运筹帷幄`,
        icon: DashboardOutlined,
        path: '/dashboard'
    },
    {
        title: `快速上手`,
        summary: `一目十行 · 滴水成冰`,
        icon: ThunderboltOutlined,
        path: '/start'
    },
    {
        title: `主题定制`,
        summary: `精妙绝伦 · 美不胜收`,
        icon: CrownOutlined,
        path: '/theming'
    },
    {
        title: `全局变量`,
        summary: `以一驭万 · 顾全大局`,
        icon: GlobalOutlined,
        path: '/tools/global'
    },
    {
        title: `请求响应`,
        summary: `为民请命 · 响应风从`,
        icon: SendOutlined,
        path: '/tools/request'
    },
    {
        title: `本地缓存`,
        summary: `临危不惧 · 稳如泰山`,
        icon: SaveOutlined,
        path: '/tools/cache'
    },
    {
        title: `工具函数`,
        summary: `笔墨纸砚 · 不拘绳墨`,
        icon: ToolOutlined,
        path: '/tools/function'
    },
    {
        title: `登录页面`,
        summary: `先发制人 · 先声夺人`,
        icon: LoginOutlined,
        path: '/pages/login'
    },
    {
        title: `注册页面`,
        summary: `欣欣向荣 · 马到成功`,
        icon: ScheduleOutlined,
        path: '/pages/register'
    },
    {
        title: `忘记密码`,
        summary: `吃水忘源 · 得新忘旧`,
        icon: QuestionCircleOutlined,
        path: '/pages/forget'
    },
    {
        title: `基础布局`,
        summary: `气势磅礴 · 海纳百川`,
        icon: LayoutOutlined,
        path: '/components/layout'
    },
    {
        title: `消息中心`,
        summary: `长目飞耳 · 喜出望外`,
        icon: BellOutlined,
        path: '/components/notice'
    },
    {
        title: `弹窗提示`,
        summary: `云窗雾阁 · 巧夺天工`,
        icon: SwitcherOutlined,
        path: '/components/modal'
    },
    {
        title: `滑块验证`,
        summary: `呕心沥血 · 一丝不苟`,
        icon: ScanOutlined,
        path: '/components/captcha'
    },
    {
        title: `联想搜索`,
        summary: `浮想联翩 · 蜻蜓点水`,
        icon: SearchOutlined,
        path: '/components/search'
    },
    {
        title: `密码设置`,
        summary: `守口如瓶 · 法不传六耳`,
        icon: SafetyCertificateOutlined,
        path: '/components/password'
    },
    {
        title: `锚点连接`,
        summary: `席地而坐 · 安家落户`,
        icon: BorderlessTableOutlined,
        path: '/components/anchor'
    },
    {
        title: `菜单选项`,
        summary: `何去何从 · 爬罗剔抉`,
        icon: OrderedListOutlined,
        path: '/components/menu'
    },
    {
        title: `下拉列表`,
        summary: `近水楼台 · 顺水推舟`,
        icon: MenuOutlined,
        path: '/components/dropdown'
    },
    {
        title: `精美时钟`,
        summary: `弹指之间 · 时光荏苒`,
        icon: ClockCircleOutlined,
        path: '/components/clock'
    },
    {
        title: `代码高亮`,
        summary: `光彩夺目 · 熠熠生辉`,
        icon: CodeOutlined,
        path: '/components/code'
    },
    {
        title: `引用说明`,
        summary: `繁征博引 · 深文罗织`,
        icon: WarningOutlined,
        path: '/components/quote'
    },
    {
        title: `标题设置`,
        summary: `独辟蹊径 · 画龙点睛`,
        icon: AlignCenterOutlined,
        path: '/components/title'
    },
    {
        title: `回到顶部`,
        summary: `班师回朝 · 久客思归`,
        icon: ToTopOutlined,
        path: '/components/back2top'
    },
    {
        title: `授权登陆`,
        summary: `越俎代庖 · 搀行夺市`,
        icon: GithubOutlined,
        path: '/components/socialite'
    },
    {
        title: `菜单管理`,
        summary: `蛛丝马迹 · 烟消云散`,
        icon: PicRightOutlined,
        path: '/advanced/menu'
    },
    {
        title: `权限管理`,
        summary: `一手遮天 · 卓尔不群`,
        icon: SecurityScanOutlined,
        path: '/advanced/authority'
    },
    {
        title: `应用管理`,
        summary: `博览群书 · 千秋万古`,
        icon: AppstoreAddOutlined,
        path: '/advanced/app'
    },
    {
        title: `语言管理`,
        summary: `口若悬河 · 豪言壮语`,
        icon: TransactionOutlined,
        path: '/advanced/language'
    }
])
</script>