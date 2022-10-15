<template>
    <mi-menu-management :pagination-locale="zhCN"
        :data="{
            url: api.menus.data,
            method: 'get',
            callback: handleAfterGetData
        }" />
</template>

<script setup>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

    const handleAfterGetData = () => {
        console.info('after get menus. To do something ...')
    }
</script>