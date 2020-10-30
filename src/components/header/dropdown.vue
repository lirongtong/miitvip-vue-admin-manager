<template>
    <a-menu theme="dark">
        <a-menu-item key="1"><UserOutlined />个人中心</a-menu-item>
        <a-menu-item key="2"><SettingOutlined />系统设置</a-menu-item>
        <a-menu-item key="3"><PoweroffOutlined />退出登录</a-menu-item>
    </a-menu>
</template>

<script lang="ts">
    import { defineComponent, reactive } from 'vue'
    import { MenuItem } from '/@src/utils/config'

    export default defineComponent({
        props: {
            items: {
                type: Object,
                default: () => {}
            }
        },
        setup() {
            const menus: MenuItem[] = reactive([])
            return { menus }
        }
    })
</script>