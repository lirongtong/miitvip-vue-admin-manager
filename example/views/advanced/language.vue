<template>
    <mi-apps-language
        get-category-action="/v1/languages/categories"
        create-category-action="/v1/languages/categories"
        update-category-action="/v1/languages/categories"
        delete-category-action="/v1/languages/categories"
        set-default-category-action="/v1/languages/categories/default"
        check-category-exist-action="/v1/languages/categories/check"
        :translate="{
            baidu: {
                url: 'api/trans/vip/translate',
                appid: '20221021001405223',
                key: 'vh_Thbu18gZqhIr0sUt1'
            }
        }"
        get-content-action="/v1/languages"
        create-content-action="/v1/languages"
        update-content-status-action="/v1/languages/status"
        batch-create-content-action="/v1/languages/batch-create"
        update-content-action="/v1/languages"
        delete-content-action="/v1/languages"
        check-content-exist-action="/v1/languages/check"
        get-module-action="/v1/languages/modules"
        check-module-exist-action="/v1/languages/modules/check"
        create-module-action="/v1/languages/modules"
        delete-module-action="/v1/languages/modules"
        update-module-action="/v1/languages/modules" />
</template>

<script setup lang="ts">
const handleCustom = (data: any) => {
    console.log(data)
    return true
}

const handleAfter = (res?: any) => {
    console.log(res)
}
</script>