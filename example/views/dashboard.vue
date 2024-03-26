<template>
    <h2>快速上手</h2>
    <mi-code language="shell" :content="content" />
    <div style="height: 1200px">
        <h2>引入组件</h2>
        <mi-code language="shell" :content="content" />
        <h2>按需加载</h2>
        <mi-code language="shell" :content="content" />
        <h2>定制方式</h2>
        <mi-code language="shell" :content="content" />
        <h2>在线示例</h2>
        <mi-code language="shell" :content="content" />
        <h2>配置参数</h2>
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
$ npm i makeit-admin-pro
`
</script>