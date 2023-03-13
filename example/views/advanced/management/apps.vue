<template>
    <mi-apps-management :pagination-locale="zhCN"
        :data="{
            url: api.apps.data,
            method: 'get',
            callback: handleAfterGetData
        }"
        :create-app="{ url: api.apps.data }"
        :update-app="{ url: api.apps.create }"
        :delete-app="{ url: api.apps.update }" />
</template>

<script setup>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

    const handleAfterGetData = () => {
        console.info('after get apps. To do something ...')
    }
</script>