<template>
    <mi-language-management :pagination-locale="zhCN"
        :data="{url: '/v1/languages'}"
        :add-language="{url: '/v1/language'}"
        :update-language="{url: '/v1/language/{id}'}"
        :delete-language="{url: '/v1/language/{id}'}"
        :add-category="{url: '/v1/category'}"
        :update-category="{url: '/v1/category/{id}'}"
        :delete-category="{url: '/v1/category/{id}'}" />
</template>

<script setup>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
</script>