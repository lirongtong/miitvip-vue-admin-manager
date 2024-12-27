import * as AntdvIcons from '@ant-design/icons-vue'

export const menusData = [
    {
        name: 'about',
        path: '/about',
        meta: {
            title: '关于 MAP',
            subTitle: 'About us',
            icon: AntdvIcons?.InfoCircleOutlined
        }
    },
    {
        name: 'dashboard',
        path: '/dashboard',
        meta: {
            title: '控制中心',
            subTitle: 'Control Center',
            icon: AntdvIcons?.DashboardOutlined,
            tag: {bgColor: '#f50', content: 'Hot'}
        }
    },
    {
        name: 'start',
        path: '/start',
        meta: {
            title: '快速上手',
            subTitle: 'Getting Started',
            icon: AntdvIcons?.ThunderboltOutlined
        }
    },
    {
        name: 'theming',
        path: '/theming',
        meta: {
            title: '主题定制',
            subTitle: 'Custom Theme',
            icon: AntdvIcons?.CrownOutlined
        }
    },
    {
        name: 'tools',
        path: '/tools',
        meta: {
            title: '系统工具',
            subTitle: 'System Tools',
            icon: AntdvIcons?.SisternodeOutlined
        },
        children: [{
            name: 'tools-global',
            path: '/tools/global',
            meta: {
                title: '全局变量',
                subTitle: 'Global Variables',
                icon: AntdvIcons?.GlobalOutlined
            }
        }, {
            name: 'tools-request',
            path: '/tools/request',
            meta: {
                title: '请求响应',
                subTitle: 'Request & Response',
                icon: AntdvIcons?.SendOutlined
            }
        }, {
            name: 'tools-cache',
            path: '/tools/cache',
            meta: {
                title: '本地缓存',
                subTitle: 'Local Cache',
                icon: AntdvIcons?.SaveOutlined
            }
        }, {
            name: 'tools-function',
            path: '/tools/function',
            meta: {
                title: '工具函数',
                subTitle: 'Utility Function',
                icon: AntdvIcons?.ToolOutlined
            }
        }]
    },
    {
        name: 'pages',
        path: '/pages',
        meta: {
            title: '常用页面',
            subTitle: 'General Pages',
            icon: AntdvIcons?.SnippetsOutlined
        },
        children: [{
            name: 'pages-login',
            path: '/pages/login',
            meta: {
                title: '登录页面',
                subTitle: 'Login Page',
                icon: AntdvIcons?.LoginOutlined
            }
        }, {
            name: 'pages-register',
            path: '/pages/register',
            meta: {
                title: '注册页面',
                subTitle: 'Register Page',
                icon: AntdvIcons?.ScheduleOutlined
            }
        }, {
            name: 'pages-forget',
            path: '/pages/forget',
            meta: {
                title: '忘记密码',
                subTitle: 'Forget Page',
                icon: AntdvIcons?.QuestionCircleOutlined
            }
        }]
    },
    {
        name: 'items',
        path: '/items',
        meta: {
            title: '定制排版',
            subTitle: 'Items',
            icon: AntdvIcons?.OrderedListOutlined
        },
        children: [{
            name: 'items-text',
            path: '/items/text',
            meta: {
                title: '文案排版',
                subTitle: 'Text Item',
                icon: AntdvIcons?.UnorderedListOutlined
            }
        }, {
            name: 'items-image',
            path: '/items/image',
            meta: {
                title: '图片排版',
                subTitle: 'Image Item',
                icon: AntdvIcons?.FileImageOutlined
            }
        }, {
            name: 'items-list',
            path: '/items/list',
            meta: {
                title: '列表排版',
                subTitle: 'List Item',
                icon: AntdvIcons?.ExceptionOutlined
            }
        }, {
            name: 'items-detail',
            path: '/items/detail',
            meta: {
                title: '详情排版',
                subTitle: 'Detail Item',
                icon: AntdvIcons?.ClusterOutlined
            }
        }]
    },
    {
        name: 'components',
        path: '/components',
        meta: {
            title: '定制组件',
            subTitle: 'Components',
            icon: AntdvIcons?.AppstoreAddOutlined,
            tag: {icon: AntdvIcons?.FireFilled, color: '#ed4014'}
        },
        children: [{
            name: 'components-layout',
            path: '/components/layout',
            meta: {
                title: '基础布局',
                subTitle: 'Layout',
                icon: AntdvIcons?.LayoutOutlined
            }
        }, {
            name: 'components-notice',
            path: '/components/notice',
            meta: {
                title: '消息中心',
                subTitle: 'Notice',
                icon: AntdvIcons?.BellOutlined
            }
        }, {
            name: 'components-modal',
            path: '/components/modal',
            meta: {
                title: '弹窗提示',
                subTitle: 'Modal',
                icon: AntdvIcons?.SwitcherOutlined
            }
        }, {
            name: 'components-captcha',
            path: '/components/captcha',
            meta: {
                title: '滑块验证',
                subTitle: 'Captcha',
                icon: AntdvIcons?.ScanOutlined,
                tag: {icon: AntdvIcons?.LikeFilled, color: '#4caf50'}
            }
        }, {
            name: 'components-search',
            path: '/components/search',
            meta: {
                title: '搜索联想',
                subTitle: 'Search',
                icon: AntdvIcons?.SearchOutlined
            }
        }, {
            name: 'components-clock',
            path: '/components/clock',
            meta: {
                title: '精美钟表',
                subTitle: 'Clock',
                icon: AntdvIcons?.ClockCircleOutlined
            }
        }, {
            name: 'components-password',
            path: '/components/password',
            meta: {
                title: '密码设置',
                subTitle: 'Password',
                icon: AntdvIcons?.SafetyCertificateOutlined
            }
        }, {
            name: 'components-anchor',
            path: '/components/anchor',
            meta: {
                title: '锚点链接',
                subTitle: 'Anchor',
                icon: AntdvIcons?.BorderlessTableOutlined
            }
        }, {
            name: 'components-menu',
            path: '/components/menu',
            meta: {
                title: '导航菜单',
                subTitle: 'Menu',
                icon: AntdvIcons?.OrderedListOutlined
            }
        }, {
            name: 'components-dropdown',
            path: '/components/dropdown',
            meta: {
                title: '下拉菜单',
                subTitle: 'Dropdown',
                icon: AntdvIcons?.MenuOutlined
            }
        }, {
            name: 'components-code',
            path: '/components/code',
            meta: {
                title: '代码高亮',
                subTitle: 'Code',
                icon: AntdvIcons?.CodeOutlined
            }
        }, {
            name: 'components-title',
            path: '/components/title',
            meta: {
                title: '标题设置',
                subTitle: 'Title',
                icon: AntdvIcons?.HighlightOutlined
            }
        }, {
            name: 'components-quote',
            path: '/components/quote',
            meta: {
                title: '引用说明',
                subTitle: 'Quote',
                icon: AntdvIcons?.ExclamationCircleOutlined
            }
        }, {
            name: 'components-backtop',
            path: '/components/backtop',
            meta: {
                title: '回到顶部',
                subTitle: 'Backtop',
                icon: AntdvIcons?.VerticalAlignTopOutlined
            }
        }, {
            name: 'components-socialite',
            path: '/components/socialite',
            meta: {
                title: '授权登陆',
                subTitle: 'Socialite',
                icon: AntdvIcons?.GithubOutlined
            }
        }]
    },
    {
        name: 'advanced',
        path: '/advanced',
        meta: {
            title: '高级应用',
            subTitle: 'Advanced',
            icon: AntdvIcons?.AppleOutlined,
            tag: { content: '授权', bgColor: '#e6300b' }
        },
        children: [
            {
                name: 'advanced-language',
                path: '/advanced/language',
                meta: {
                    title: '语系管理',
                    subTitle: 'Language',
                    icon: AntdvIcons?.CoffeeOutlined
                }
            },
            {
                name: 'advanced-menu',
                path: '/advanced/menu',
                meta: {
                    title: '菜单管理',
                    subTitle: 'Menus',
                    icon: AntdvIcons?.MenuUnfoldOutlined
                }
            }
        ]
    }
]

export default menusData