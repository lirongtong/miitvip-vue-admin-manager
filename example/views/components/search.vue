<template>
    <Row type="flex" :align="'middle'" justify="center">
        <mi-search search-key="title" :search-action="handleSearch" :search-delay=".3" placeholder="自定义搜索动作 ..." :width="240" list-no-data-text="请输入「 关于 」试试 ..."  />
        <mi-search search-key="title" search-action="/v1/users" :search-delay=".3" placeholder="远程搜索 ..." :width="240" list-no-data-text="请输入关键词<br />进行远程搜索 ..." />
    </Row>
</template>

<script setup lang="ts">
import { Row } from 'ant-design-vue'

const handleSearch = (keyword?: string) => {
    console.log('keyword: ', keyword)
    // do something.
    // return search result data.
    return [
        {
            title: `关于 MAP`,
            summary: `框架特性 · 设计初衷`,
            path: '/about',
            custom: `自定义字段内容一`
        }
    ]
}
</script>