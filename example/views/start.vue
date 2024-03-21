<template>
    <mi-code language="shell" :content="content" />
    <div style="height: 1200px"></div>
</template>

<script setup lang="ts">
const content = `
# 初始化 vite 项目
$ npm init vite-app makeit-admin-pro

# 进入目录
$ cd makeit-admin-pro

# 安装依赖
$ npm install

# 安装 @makeit/admin-pro
$ npm i @makeit/admin-pro
`
</script>