<template>
    <Row type="flex" :align="'middle'" justify="center">
        <mi-search
            search-key="title"
            :data="searchData"
            placeholder="请输入关键词，关联搜索 ..."
            :width="240"
            :height="42" />
    </Row>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Row } from 'ant-design-vue'
import { InfoCircleOutlined, DashboardOutlined, ThunderboltOutlined } from '@ant-design/icons-vue'

const searchData = reactive([
    {
        title: `关于 MAP`,
        summary: `框架特性 · 设计初衷`,
        icon: InfoCircleOutlined,
        path: '/about'
    },
    {
        title: `控制中心`,
        summary: `纵观全局 · 运筹帷幄`,
        icon: DashboardOutlined,
        path: '/dashboard'
    },
    {
        title: `快速上手`,
        summary: `一目十行 · 滴水成冰`,
        icon: ThunderboltOutlined,
        path: '/start'
    }
])
</script>