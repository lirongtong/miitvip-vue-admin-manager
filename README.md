<p align="center">
    <a href="https://admin.makeit.vip/">
        <img width="200" src="https://file.makeit.vip/MIIT/M00/00/00/ajRkHV_pUyOALE2LAAAtlj6Tt_s370.png">
    </a>
</p>

<h1 align="center">
    <a href="https://admin.makeit.vip/" target="_blank">
        <font color="#f6ca9d">Makeit Admin Pro 2.x</font>
    </a>
</h1>

<div align="center">

基于 Vue3.x + Vite2.x + Ant Design Vue 构建的适用于中后台管理系统的组合模板框架。

( A unified template used to backend management system based on Vue3.x + Vite2.x + Ant Design Vue. )

[![npm package](https://img.shields.io/npm/v/makeit-admin-pro.svg?style=flat-square)](https://www.npmjs.com/package/makeit-admin-pro)
[![npm downloads](http://img.shields.io/npm/dm/makeit-admin-pro.svg?style=flat-square)](http://www.npmtrends.com/makeit-admin-pro)
![MIT](https://img.shields.io/badge/license-MIT-ff69b4.svg)
![npm](https://img.shields.io/badge/npm-8.1.3-orange.svg)
![nodejs](https://img.shields.io/badge/nodejs-17.7.1-red.svg)
![webpack](https://img.shields.io/badge/webpack-5.70.0-orange.svg)
![vue](https://img.shields.io/badge/vue-3.2.36-green.svg)
![vite](https://img.shields.io/badge/vite-2.9.9-yellow.svg)
![axios](https://img.shields.io/badge/axios-0.27.2-red.svg)
![ant design vue](https://img.shields.io/badge/ant%20design%20vue-3.x-blueviolet.svg)
![vue router](https://img.shields.io/badge/vue%20router-4.0.15-inactive.svg)
![vuex](https://img.shields.io/badge/vuex-4.0.2-informational.svg)
![vue-i18n](https://img.shields.io/badge/vue%20i18n-9.1.10-default.svg)

<p>
    <a href="https://admin.makeit.vip/">
        <img src="https://file.makeit.vip/MIIT/M00/00/00/ajRkHWAQMteAH3u5AAg_R8651XE245.png">
    </a>
</p>

<p>
    <a href="https://admin.makeit.vip/">
        <img src="https://file.makeit.vip/MIIT/M00/00/00/ajRkHWAQMwOAM2FJAAGzeH165Ws053.png">
    </a>
</p>

<p>
    <a href="https://admin.makeit.vip/">
        <img src="https://file.makeit.vip/MIIT/M00/00/00/ajRkHWAQMx-ABFkCAAQKq4vcmIM480.jpg">
    </a>
</p>

</div>

## 关于

> `Makeit Admin Pro`，基于 `Vue3.x + Vite2.x` 版本，并结合 `Ant Design Vue` 组件库开发的一套适合中后台管理项目的统一 `UI` 框架，项目内含统一的页面布局 / 注册页面 / 登录页面 / 忘记密码 / 滑块验证码组件 / 搜索联想组件 / 动态菜单配置 / 权限管理配置等常用模块，开箱即用（有部分组件已经单独抽离并发布于 `Npm`）。集成这套框架的目的，主要是为了免去中后台管理项目中，基础又重复的页面，如页面的基础布局，登录 / 注册 / 忘记密码等页面，让开发人员能更加专注于业务内容页面的开发。该框架封装了 `Axios` / `Cookie` / `Storage` 等基础功能，可通过如 `this.$cookie` 形式直接调用，同时也易于扩展。现阶段还在不断完善，持续开发更新中 ...
> >
> 限于本人的技术水平，有些问题可能考虑的并不周全，若对该框架的 `UI` 或功能组件的使用有更好的建议，亦或有更多的定制化需求，组件存在 `BUG` 等，欢迎来 [这里](https://github.com/lirongtong/miitvip-vue-admin-manager/issues) 提 `issues`，我将尽可能的抽时间去解决相应的 `BUG`，去完善合理的定制化需求。

## 安装

```bash
npm i makeit-admin-pro
```

## 使用

```ts
import { createApp } from 'vue'
import MakeitAdminPro from 'makeit-admin-pro'
import 'makeit-admin-pro/dist/miitvip.min.css'
import App from './app.vue'

const app = createApp(App)
app.use(MakeitAdminPro)
app.mount('#app')
```

## 布局

```vue
<template>
    <mi-layout>
        <template v-slot:headerExtra>
            <mi-search :data="searchData"
                search-key="title"
                :width="120"
                :height="48"
                placeholder="搜索组件"
                :list-width="320"
                :list-height="335"
                :gap="4"
                :page-size="3"
                :list-radius="8"
                border-color="transparent"
                background-color="transparent" />
        </template>
    </mi-layout>
</template>
```

```ts
<script setup>
    import { getCurrentInstance } from 'vue'
    import { DashboardOutlined, LayoutOutlined } from '@ant-design/icons-vue'

    const { appContext: {config: {globalProperties: vm}} } = getCurrentInstance()

    vm.$g.menus.items = [{
        name: 'dashboard',
        path: '/dashboard',
        meta: {
            title: '控制中心',
            subTitle: 'Dashboard',
            icon: DashboardOutlined,
            tag: {color: '#f50', content: 'Hot'}
        }
    }, {
        // ... sider menu
    }]
    
    const searchData = [{
        title: '页面布局',
        content: '基于 Layout 组件的二次定制',
        link: '/layout',
        icon: LayoutOutlined
    }, {
        // ... search data
    }]
</script>
```

## 登录

```vue
<template>
    <mi-login :action="api.login" />
</template>
```

## 注册

```vue
<template>
    <mi-register :action="api.register" />
</template>
```

## 更多

> 更多内容及使用请查看在线示例：[https://admin.makeit.vip](https://admin.makeit.vip)
