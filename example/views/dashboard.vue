<template>
    <mi-title title="快速上手" />
    <mi-code language="shell" :content="content" />
    <div style="height: 1200px">
        <mi-title title="引入组件" />
        <mi-code language="shell" :content="content" />
        <mi-title title="按需加载" />
        <mi-code language="shell" :content="content" />
        <mi-title title="定制方式" />
        <mi-code language="shell" :content="content" />
        <mi-title title="在线示例" />
        <mi-code language="shell" :content="content" />
        <mi-title title="配置参数" />
        <mi-code language="shell" :content="content" />
    </div>
</template>

<script setup lang="ts">
const content = `
# 初始化 vite 项目
$ npm init vite-app makeit-admin-pro

# 进入目录
$ cd makeit-admin-pro

# 安装依赖
$ npm install
$ npm i @miitvip/admin-pro
`
</script>