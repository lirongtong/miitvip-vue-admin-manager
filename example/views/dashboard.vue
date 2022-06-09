<template>
    <mi-search search-key="title" :data="[{
        title: '快速上手',
        content: '安装 npm i makeit-admin-pro',
        link: '/start'
    }]">
        <template v-slot:itemTemplate>
            <div class="info">
                <div class="title"><mi-search-key name="title"></mi-search-key></div>
                <div class="content"><mi-search-key name="content"></mi-search-key></div>
            </div>
        </template>
    </mi-search>
</template>