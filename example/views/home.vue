<template>
    <mi-layout></mi-layout>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    const homeComponent = defineComponent({
        created() {
            this.G.menus.dropdown = [{
                name: 'personal',
                path: '/profile',
                title: '个人中心',
                icon: 'UserOutlined',
                tag: {icon: 'StarOutlined', color: '#ed4014'}
            }, {
                name: 'setting',
                path: '/setting',
                title: '系统设置',
                icon: 'SettingOutlined'
            }, {
                name: 'logout',
                title: '退出登录',
                icon: 'PoweroffOutlined'
            }];
            this.G.menus.items = [{
                name: 'start',
                path: '/start',
                meta: {
                    title: '快速上手',
                    subTitle: 'Geeting Start',
                    icon: 'ThunderboltOutlined',
                    tag: {color: '#f50', content: 'New'}
                }
            }, {
                name: 'passport',
                path: '/passport',
                meta: {
                    title: '登录注册',
                    subTitle: 'Passport',
                    icon: 'VerifiedOutlined'
                    
                },
                children: [{
                    name: 'login',
                    path: '/passport/login',
                    meta: {
                        title: '登录页面',
                        subTitle: 'Login',
                        icon: 'LoginOutlined'
                    }
                }, {
                    name: 'register',
                    path: '/passport/register',
                    meta: {
                        title: '注册页面',
                        subTitle: 'Register',
                        icon: 'LogoutOutlined'
                    }
                }]
            }, {
                name: 'list',
                path: '/list',
                meta: {
                    title: '列表页面',
                    subTitle: 'List',
                    icon: 'OrderedListOutlined'
                },
                children: [{
                    name: 'normal',
                    path: '/list/normal',
                    meta: {
                        title: '基础列表',
                        subTitle: 'Normal',
                        icon: 'AlignLeftOutlined'
                    }
                }, {
                    name: 'card',
                    path: '/list/card',
                    meta: {
                        title: '卡片列表',
                        subTitle: 'Card',
                        icon: 'CreditCardOutlined'
                    }
                }, {
                    name: 'goods',
                    path: '/list/goods',
                    meta: {
                        title: '商品列表',
                        subTitle: 'Goods',
                        icon: 'ShoppingCartOutlined',
                        tag: {icon: 'FireFilled', color: '#ed4014'}
                    }
                }]
            }, {
                name: 'tools',
                path: '/tools',
                meta: {
                    title: '常用工具',
                    subTitle: 'Tools',
                    icon: 'ToolOutlined'
                },
                children: [{
                    name: 'editor',
                    path: '/tools/editor',
                    meta: {
                        title: '编辑器',
                        subTitle: 'Editor',
                        icon: 'FormOutlined'
                    }
                }, {
                    name: 'captcha',
                    path: '/tools/captcha',
                    meta: {
                        title: '验证码',
                        subTitle: 'Captcha',
                        icon: 'CheckSquareOutlined'
                    },
                    children: [{
                        name: 'captcha-message',
                        path: '/tools/captcha/message',
                        meta: {
                            title: '短信验证码',
                            subTitle: 'Message',
                            icon: 'MessageOutlined',
                            tag: {icon: 'PhoneOutlined', color: 'green'}
                        }
                    }, {
                        name: 'captcha-email',
                        path: 'https://admin.makeit.vip/tools/captcha/email',
                        meta: {
                            title: '邮箱验证码',
                            subTitle: 'Email',
                            icon: 'MailOutlined'
                        }
                    }]
                }]
            }]
        }
    })
    export default homeComponent
</script>