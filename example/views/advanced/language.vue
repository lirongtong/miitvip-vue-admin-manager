<template>
    <mi-apps-language
        get-category-action="/v1/languages/categories"
        create-category-action="/v1/languages/categories"
        update-category-action="/v1/languages/categories/{id}"
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
        update-content-action="/v1/languages"
        delete-content-action="/v1/languages"
        check-content-exist-action="/v1/languages/check" />
</template>
