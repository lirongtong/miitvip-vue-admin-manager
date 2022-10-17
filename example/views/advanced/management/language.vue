<template>
    <mi-language-management :pagination-locale="zhCN"
        :data="{
            url: api.languages.data,
            method: 'get',
            callback: handleAfterGetData
        }"
        :create-language="{url: api.languages.data}"
        :update-language="{url: api.languages.update}"
        :delete-language="{url: api.languages.update}"
        :check-language-exist="{url: api.languages.check}"
        :category="{url: api.languages.category.data}"
        :create-category="{url: api.languages.category.data}"
        :update-category="{url: api.languages.category.update}"
        :delete-category="{url: api.languages.category.update}"
        :check-category-exist="{url: api.languages.category.check}" />
</template>

<script setup>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    const handleAfterGetData = () => {
        console.info('after get languages configuration. do something ...')
    }
</script>