<template>
    <mi-layout></mi-layout>
</template>

<script lang="ts">
    import { defineComponent, createVNode } from 'vue'
    import {
        ThunderboltOutlined, VerifiedOutlined, AlignLeftOutlined,
        LoginOutlined, LogoutOutlined, OrderedListOutlined, CreditCardOutlined,
        ShoppingCartOutlined, ToolOutlined, FormOutlined, CheckSquareOutlined,
        MessageOutlined, MailOutlined, SettingOutlined,
        UserOutlined, PoweroffOutlined
    } from '@ant-design/icons-vue'
    export default defineComponent({
        created() {
            this.$g.menus.dropdown = [{
                name: 'personal',
                path: 'https://admin.makeit.vip/profile',
                title: '个人中心',
                icon: createVNode(UserOutlined)
            }, {
                name: 'setting',
                path: 'https://admin.makeit.vip/setting',
                title: '系统设置',
                icon: createVNode(SettingOutlined)
            }, {
                name: 'logout',
                title: '退出登录',
                icon: createVNode(PoweroffOutlined)
            }]
            this.$g.menus.items = [{
                name: 'start',
                path: '/start',
                meta: {
                    title: '快速上手',
                    subTitle: 'Getting Start',
                    icon: createVNode(ThunderboltOutlined),
                    tag: {color: '#f50', content: 'Hot'}
                }
            }, {
                name: 'passport',
                path: '/passport',
                meta: {
                    title: '登录注册',
                    subTitle: 'Passport',
                    icon: createVNode(VerifiedOutlined)
                },
                children: [{
                    name: 'login',
                    path: '/passport/login',
                    meta: {
                        title: '登录页面',
                        subTitle: 'Login',
                        icon: createVNode(LoginOutlined)
                    }
                }, {
                    name: 'register',
                    path: '/passport/register',
                    meta: {
                        title: '注册页面',
                        subTitle: 'Register',
                        icon: createVNode(LogoutOutlined)
                    }
                }]
            }, {
                name: 'list',
                path: '/list',
                meta: {
                    title: '列表页面',
                    subTitle: 'List',
                    icon: createVNode(OrderedListOutlined)
                },
                children: [{
                    name: 'normal',
                    path: '/list/normal',
                    meta: {
                        title: '基础列表',
                        subTitle: 'Normal',
                        icon: createVNode(AlignLeftOutlined)
                    }
                }, {
                    name: 'card',
                    path: '/list/card',
                    meta: {
                        title: '卡片列表',
                        subTitle: 'Card',
                        icon: createVNode(CreditCardOutlined)
                    }
                }, {
                    name: 'goods',
                    path: '/list/goods',
                    meta: {
                        title: '商品列表',
                        subTitle: 'Goods',
                        icon: createVNode(ShoppingCartOutlined),
                        tag: {icon: 'FireFilled', color: '#ed4014'}
                    }
                }]
            }, {
                name: 'tools',
                path: '/tools',
                meta: {
                    title: '常用工具',
                    subTitle: 'Tools',
                    icon: createVNode(ToolOutlined)
                },
                children: [{
                    name: 'editor',
                    path: '/tools/editor',
                    meta: {
                        title: '编辑器',
                        subTitle: 'Editor',
                        icon: createVNode(FormOutlined)
                    }
                }, {
                    name: 'captcha',
                    path: '/tools/captcha',
                    meta: {
                        title: '验证码',
                        subTitle: 'Captcha',
                        icon: createVNode(CheckSquareOutlined)
                    },
                    children: [{
                        name: 'captcha-message',
                        path: '/tools/captcha/message',
                        meta: {
                            title: '短信验证码',
                            subTitle: 'Message',
                            icon: createVNode(MessageOutlined),
                            tag: {icon: 'PhoneOutlined', color: 'green'}
                        }
                    }, {
                        name: 'captcha-email',
                        path: 'https://admin.makeit.vip/tools/captcha/email',
                        meta: {
                            title: '邮箱验证码',
                            subTitle: 'Email',
                            icon: createVNode(MailOutlined)
                        }
                    }]
                }]
            }]
        }
    })
</script>