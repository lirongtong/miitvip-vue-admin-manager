<template>
    <mi-code language="bash" :content="content" />
    <mi-code-demo title="基本用法" summary="最基础的用法效果" language="bash" :code="content">
        <template #effect>
            <mi-login action="" :footer="false" />
        </template>
    </mi-code-demo>
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