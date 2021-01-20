<template>
    <mi-layout>
        <template v-slot:headerExtra v-if="!$tools.isMobile()">
            <mi-search class-name="mi-search-custom" :data="searchData" search-key="title" :height="64" :width="120" border-color="transparent" text-color="#f6ca9d" search-key-color="#f6ca9d" background-color="transparent" placeholder="搜索组件 ..." :list-width="320" list-border-color="#f6ca9d" :list-box-shadow="false" list-background="#1d1e23" :pagination="true" :page-size="3" page-color="rgba(255, 255, 255, .8)">
                <template v-slot:itemTemplate>
                    <div class="info">
                        <div class="title"><mi-search-key name="title"></mi-search-key></div>
                        <div class="content"><mi-search-key name="content"></mi-search-key></div>
                    </div>
                </template>
            </mi-search>
        </template>
    </mi-layout>
    <mi-modal v-model:visible="visible" title="您的支持，是我们最大的动力" :footer="null" :width="408" :animation="animation">
        <img :src="src" style="border-radius: 4px;width: 366px;" />
    </mi-modal>
</template>

<script lang="ts">
    import { defineComponent, createVNode } from 'vue'
    import {
        ThunderboltOutlined, GlobalOutlined, SendOutlined, SaveOutlined,
        LoginOutlined, LayoutOutlined, OrderedListOutlined, ScheduleOutlined,
        SwitcherOutlined, ToolOutlined, BellOutlined, ScanOutlined,
        MessageOutlined, FireFilled, SearchOutlined, AlipayCircleOutlined,
        SafetyCertificateOutlined, MenuOutlined, GithubOutlined, AppstoreAddOutlined,
        WechatOutlined
    } from '@ant-design/icons-vue'
    import Alipay from '../assets/images/alipay.jpg'
    import Wechat from '../assets/images/wechat.jpg'

    export default defineComponent({
        data() {
            return {
                visible: false,
                src: Alipay,
                animation: 'newspaper',
                searchData: [{
                    title: '快速上手',
                    content: '安装 npm i makeit-admin-pro',
                    link: '/start'
                }, {
                    title: '全局变量',
                    content: '封装一些非常常用的公用全局变量',
                    link: '/global'
                }, {
                    title: '请求响应',
                    content: '该模块封装自 axios',
                    link: '/http'
                }, {
                    title: '本地缓存',
                    content: 'Cookie 及 Document 源的对象 Storage',
                    link: '/caches'
                }, {
                    title: '基础布局',
                    content: '基于 Ant Design Vue 的 Layout 二次定制',
                    link: '/components/layout'
                }, {
                    title: '菜单选项',
                    content: '动态配置左侧菜单',
                    link: '/components/menu'
                }, {
                    title: '登录页面',
                    content: '封装好的页面，直接调用就可完美展现',
                    link: '/components/login'
                }, {
                    title: '注册页面',
                    content: '封装好的页面，直接调用就可完美展现',
                    link: '/components/register'
                }, {
                    title: '消息中心',
                    content: '以弹窗形式展示消息列表，支持多 Tab',
                    link: '/components/notice'
                }, {
                    title: '弹窗动效',
                    content: '多功能、多动效的页面浮层',
                    link: '/components/modal'
                }, {
                    title: '气泡提示',
                    content: '可替代系统默认的 Title 显示的组件',
                    link: '/components/tooltip'
                }, {
                    title: '滑块验证码',
                    content: '滑块验证，适用性广，多方位提升安全性能',
                    link: '/components/captcha'
                }, {
                    title: '搜索联想',
                    content: '根据给定关键词，联想搜索相关内容',
                    link: '/components/search'
                }, {
                    title: '密码设置',
                    content: '在表单内，能快速定义密码设定的内容',
                    link: '/components/password'
                }, {
                    title: '下拉菜单',
                    content: '传入数据后快速生成定制化的菜单选项',
                    link: '/components/dropdown'
                }]
            }
        },
        created() {
            this.$g.menus.dropdown = [{
                name: 'github',
                title: 'Github',
                path: 'https://github.com/lirongtong/miitvip-vue-admin-manager',
                icon: createVNode(GithubOutlined),
                tag: {content: 'Hot'}
            }, {
                name: 'npmjs',
                title: 'NpmJS',
                path: 'https://www.npmjs.com/package/makeit-admin-pro',
                icon: createVNode(AppstoreAddOutlined),
                tag: {icon: createVNode(FireFilled)}
            }, {
                name: 'wechat',
                title: 'Wechat',
                callback: () => this.handlePayModal('wechat'),
                icon: createVNode(WechatOutlined)
            }, {
                name: 'alipay',
                title: 'Alipay',
                callback: () => this.handlePayModal('alipay'),
                icon: createVNode(AlipayCircleOutlined)
            }]
            this.$g.menus.items = [{
                name: 'start',
                path: '/start',
                meta: {
                    title: '快速上手',
                    subTitle: 'Getting Started',
                    icon: createVNode(ThunderboltOutlined),
                    tag: {color: '#f50', content: 'Hot'}
                }
            }, {
                name: 'global',
                path: '/global',
                meta: {
                    title: '全局变量',
                    subTitle: 'Global Config',
                    icon: createVNode(GlobalOutlined)
                }
            }, {
                name: 'http',
                path: '/http',
                meta: {
                    title: '请求响应',
                    subTitle: 'Request / Response',
                    icon: createVNode(SendOutlined)
                }
            }, {
                name: 'caches',
                path: '/caches',
                meta: {
                    title: '本地缓存',
                    subTitle: 'Cookie Storage',
                    icon: createVNode(SaveOutlined)
                }
            }, {
                name: 'tools',
                path: '/tools',
                meta: {
                    title: '工具函数',
                    subTitle: 'Common Tools',
                    icon: createVNode(ToolOutlined)
                }
            }, {
                name: 'components-layout',
                path: '/components/layout',
                meta: {
                    title: '基础布局',
                    subTitle: 'Layout',
                    icon: createVNode(LayoutOutlined)
                }
            }, {
                name: 'components-menu',
                path: '/components/menu',
                meta: {
                    title: '菜单选项',
                    subTitle: 'Menus',
                    icon: createVNode(OrderedListOutlined)
                }
            }, {
                name: 'components-login',
                path: '/components/login',
                meta: {
                    title: '登录页面',
                    subTitle: 'Login',
                    icon: createVNode(LoginOutlined)
                }
            }, {
                name: 'components-register',
                path: '/components/register',
                meta: {
                    title: '注册页面',
                    subTitle: 'Register',
                    icon: createVNode(ScheduleOutlined)
                }
            }, {
                name: 'components-notice',
                path: '/components/notice',
                meta: {
                    title: '消息中心',
                    subTitle: 'Notice',
                    icon: createVNode(BellOutlined),
                    tag: {content: '1', color: '#f90'}
                }
            }, {
                name: 'components-modal',
                path: '/components/modal',
                meta: {
                    title: '弹窗动效',
                    subTitle: 'Modal',
                    icon: createVNode(SwitcherOutlined)
                }
            }, {
                name: 'components-tooltip',
                path: '/components/tooltip',
                meta: {
                    title: '气泡提示',
                    subTitle: 'Tooltip',
                    icon: createVNode(MessageOutlined)
                }
            }, {
                name: 'components-captcha',
                path: '/components/captcha',
                meta: {
                    title: '滑块验证',
                    subTitle: 'Captcha',
                    icon: createVNode(ScanOutlined),
                    tag: {icon: createVNode(FireFilled), color: '#ed4014'}
                }
            }, {
                name: 'components-search',
                path: '/components/search',
                meta: {
                    title: '搜索联想',
                    subTitle: 'Search',
                    icon: createVNode(SearchOutlined),
                    tag: {content: 'New', color: '#ed4014'}
                }
            }, {
                name: 'components-password',
                path: '/components/password',
                meta: {
                    title: '密码设置',
                    subTitle: 'Password',
                    icon: createVNode(SafetyCertificateOutlined)
                }
            }, {
                name: 'components-dropdown',
                path: '/components/dropdown',
                meta: {
                    title: '下拉菜单',
                    subTitle: 'Dropdown',
                    icon: createVNode(MenuOutlined)
                }
            }]
        },
        methods: {
            handlePayModal(type: string) {
                if (type === 'wechat') {
                    this.animation = 'newspaper'
                    this.src = Wechat
                }
                if (type === 'alipay') {
                    this.animation = 'slit'
                    this.src = Alipay
                }
                this.visible = !this.visible
            }
        }
    })
</script>