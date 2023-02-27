<template>
    <mi-apps-management :pagination-locale="zhCN"
        :data="{
            url: api.apps.data,
            method: 'get',
            callback: handleAfterGetData
        }"
        :create-apps="{ url: api.apps.data }"
        :update-apps="{ url: api.apps.update }"
        :delete-apps="{ url: api.apps.update }" />
</template>

<script setup>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

    const handleAfterGetData = () => {
        console.info('after get apps. To do something ...')
    }
</script>