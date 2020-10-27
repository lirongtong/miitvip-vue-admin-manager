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
                    icon: 'ThunderboltOutlined'
                }
            }, {
                name: 'passport',
                path: '/passport',
                meta: {
                    title: 'Passport',
                    icon: 'SecurityScanOutlined'
                },
                children: [{
                    name: 'login',
                    path: '/passport/login',
                    meta: {
                        title: 'Login 登录',
                        icon: 'LoginOutlined'
                    }
                }, {
                    name: 'register',
                    path: '/passport/register',
                    meta: {
                        title: 'Register 注册',
                        icon: 'LogoutOutlined'
                    }
                }]
            }]
        }
    })
    export default homeComponent
</script>