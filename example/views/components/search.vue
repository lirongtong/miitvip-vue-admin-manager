<template>
    <mi-search :data="params.data" search-key="title" border-color="#ff9412" :radius="42" search-key-color="#2F9688" :pagination="true" :page-size="6" list-background="#2F9688" item-color="#ff9412" page-color="#ff9412" :z-index="800" />

    <mi-search search-key="title" :data="params.data" :z-index="600">
        <template v-slot:itemTemplate>
            <div class="avatar">
                <mi-search-key type="image" tag="img" name="avatar" />
            </div>
            <div class="info">
                <div class="title">
                    <mi-search-key name="title" />
                </div>
                <div class="content">
                    <mi-search-key name="content" />
                </div>
            </div>
        </template>
    </mi-search>

</template>

<script setup lang="ts">
import { reactive } from 'vue'
const params = reactive({
    data: [
        {
            title: '快速上手',
            content: '封装了一些常用属性字段'
        },
        {
            title: '全局变量',
            content: '该模块暴露的变量为 $g'
        },
        {
            title: '请求响应',
            content: '该模块暴露的变量为 $http'
        },
        {
            title: '本地缓存',
            content: '该模块暴露的变量为 $storage'
        },
        {
            title: '工具函数',
            content: '该模块暴露的变量为 $tools'
        },
        {
            title: '基础布局',
            content: '基于 Ant Desing Vue 的 Layout 二次定制'
        },
        {
            title: '菜单选项',
            content: '左侧菜单模块'
        },
        {
            title: '登录页面',
            content: '封装了一些常用属性字段'
        },
        {
            title: '注册页面',
            content: '封装了一些常用属性字段'
        }
    ]
})
</script>