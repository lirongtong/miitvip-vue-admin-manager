<template>
    <mi-search search-key="title" :data="data" @item-click="itemClick"></mi-search>
</template>

<script setup>
import { DashboardOutlined } from '@ant-design/icons-vue'

const data = [{
    title: '快速上手',
    content: '安装 npm i makeit-admin-pro',
    link: '/start',
    icon: DashboardOutlined
}, {
    title: '全局变量',
    content: '封装一些非常常用的公用全局变量',
    link: '/tools/global',
    avatar: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV_pUyOALE2LAAAtlj6Tt_s370.png'
}]

const itemClick = (data) => {
    console.log(data)
}
</script>