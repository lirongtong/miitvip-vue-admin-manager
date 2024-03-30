<template>
    <mi-code language="shell" :content="content" />
    <mi-code-demo title="基本用法" summary="最基础的用法，只需要配置 action 即可" language="bash" :code="content">
        <template #result>
            <mi-login action="v1/login" :footer="false" />
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