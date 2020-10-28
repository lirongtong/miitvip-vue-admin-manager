<template>
    <mi-layout></mi-layout>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    const homeComponent = defineComponent({
        created() {
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
                    icon: 'SecurityScanOutlined'
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
            }]
        }
    })
    export default homeComponent
</script>