<p align="center">
    <a href="https://admin.makeit.vip/">
        <img width="200" src="https://file.makeit.vip/MIIT/M00/00/00/ajRkHV_pUyOALE2LAAAtlj6Tt_s370.png">
    </a>
</p>

<h1 align="center">
    <a href="https://admin.makeit.vip/" target="_blank" style="color: #f6ca9d">
        Makeit Admin Pro
    </a>
</h1>

<div align="center">

A unified template used to backend management based on Vue3.0 + Ant Design Vue + Vite

[![npm package](https://img.shields.io/npm/v/makeit-admin-pro.svg?style=flat-square)](https://www.npmjs.org/package/makeit-admin-pro)
[![npm_downloads](http://img.shields.io/npm/dm/makeit-admin-pro.svg?style=flat-square)](http://www.npmtrends.com/makeit-admin-pro)
![MIT](https://img.shields.io/badge/license-MIT-ff69b4.svg)
![webpack](https://img.shields.io/badge/webpack-4.46.0-orange.svg)
![vue](https://img.shields.io/badge/vue-3.0.11-green.svg)
![vite](https://img.shields.io/badge/vite-2.3.2-yellow.svg)
![axios](https://img.shields.io/badge/axios-0.21.1-red.svg)
![ant design vue](https://img.shields.io/badge/ant%20design%20vue-2.1.6-blueviolet.svg)
![vue router](https://img.shields.io/badge/vue%20router-4.0.6-inactive.svg)
![vuex](https://img.shields.io/badge/vuex-4.0.0-informational.svg)

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

> Makeit Admin Pro，基于 Vue3.0 + Vite 开发，结合 Ant Design Vue 组件库开发的一套适合中后台管理项目的统一 UI 框架，包含统一的页面布局 / 注册页面 / 登录页面 / 验证码 / 搜索联想 / 动态配置项目菜单等常用模块，开箱即用。集成这套框架的目的，就是为了免去那些中后台管理项目中，基础又重复的页面，包括布局，登录注册页面等等，同时也集成了项目开发中常用的工具类函数，方便调用及扩展。现阶段还在不断完善，持续开发更新中 ...

> 若对框架的使用有更好的建议，或者有更多的定制化需求，亦或者组件存在 `BUG`，欢迎来 [这里](https://github.com/lirongtong/miitvip-vue-admin-manager/issues) 提 `issues`，我将尽快抽时间去完善，去解决 `BUG`，不胜感激。

## 安装

```bash
npm i makeit-admin-pro
```

## 使用
```ts
import { createApp } from 'vue'
import { createStore } from 'vuex'
import router from './router'
import MakeitAdminPro from 'makeit-admin-pro'
import App from './app.vue'
import 'ant-design-vue/dist/antd.css'
import 'makeit-admin-pro/dist/miitvip.min.css'

const app = createApp(App)
app.use(router)
app.use(createStore({}))
app.use(MakeitAdminPro)
app.mount('#app')
```

## 布局
```vue
<template>
    <mi-layout></mi-layout>
</template>
```

## 登录
```vue
<template>
    <mi-login :action="api.login"></mi-login>
</template>
```

## 注册
```vue
<template>
    <mi-register :action="api.register"></mi-register>
</template>
```

## 更多
> 更多内容及使用请查看在线示例：[https://admin.makeit.vip](https://admin.makeit.vip)