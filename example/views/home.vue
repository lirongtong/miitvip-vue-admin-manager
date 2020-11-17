<template>
    <mi-layout></mi-layout>
</template>

<script lang="ts">
    import { defineComponent, createVNode } from 'vue'
    import {
        ThunderboltOutlined, VerifiedOutlined,
        LoginOutlined, LogoutOutlined
    } from '@ant-design/icons-vue'
    export default defineComponent({
        created() {
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
            }]
        }
    })
</script>