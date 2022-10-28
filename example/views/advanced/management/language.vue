<template>
    <mi-language-management :pagination-locale="zhCN"
        :data="{
            url: api.languages.data,
            method: 'get',
            callback: handleAfterGetData
        }"
        :create-language="{url: api.languages.data}"
        :batch-create-language="{url: api.languages.batchCreate}"
        :update-language="{url: api.languages.update}"
        :delete-language="{url: api.languages.update}"
        :check-language-exist="{url: api.languages.check}"
        :category="{url: api.languages.category.data}"
        :create-category="{url: api.languages.category.data}"
        :update-category="{url: api.languages.category.update}"
        :delete-category="{url: api.languages.category.update}"
        :default-category="{url: api.languages.category.default}"
        :check-category-exist="{url: api.languages.category.check}"
        :translate="{
            url: 'api/trans/vip/translate',
            appid: '20221021001405223',
            key: 'vh_Thbu18gZqhIr0sUt1'
        }" />
</template>

<script setup>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    const handleAfterGetData = () => {
        console.info('after get languages configuration. do something ...')
    }
</script>