<template>
    <mi-layout></mi-layout>
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
                animation: 'newspaper'
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