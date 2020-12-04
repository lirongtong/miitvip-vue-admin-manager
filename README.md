<p align="center">
    <a href="https://admin.makeit.vip/">
        <img width="200" src="https://file.makeit.vip/MIIT/M00/00/00/ajRkHV7QkoCAeo6PAAARuoXj0Jc275.png">
    </a>
</p>

<h1 align="center" color="green">
    <a href="https://admin.makeit.vip/" target="_blank" style="color: #41b995">
        Makeit Admin Pro
    </a>
</h1>

<div align="center">

A unified template used to backend management based on Vue3.0 + Ant Design Vue + Vite

[![npm package](https://img.shields.io/npm/v/makeit-admin-pro.svg?style=flat-square)](https://www.npmjs.org/package/makeit-admin-pro)
[![npm_downloads](http://img.shields.io/npm/dm/makeit-admin-pro.svg?style=flat-square)](http://www.npmtrends.com/makeit-admin-pro)
![MIT](https://img.shields.io/badge/license-MIT-ff69b4.svg)
![webpack](https://img.shields.io/badge/webpack-5.3.2-orange.svg)
![vue](https://img.shields.io/badge/vue-3.0.3-green.svg)
![vite](https://img.shields.io/badge/vite-1.0.0-yellow.svg)
![axios](https://img.shields.io/badge/axios-0.21.0-red.svg)
![ant design vue](https://img.shields.io/badge/ant%20design%20vue-2.0.0-blueviolet.svg)
![vue router](https://img.shields.io/badge/vue%20router-4.0.0-inactive.svg)
![vuex](https://img.shields.io/badge/vuex-4.0.0-informational.svg)

<a href="https://admin.makeit.vip/">
    <img src="https://file.makeit.vip/MIIT/M00/00/00/ajRkHV_AaACAOsS9AAKiYZr6iiw886.png">
</a>

<a href="https://admin.makeit.vip/">
    <img src="https://file.makeit.vip/MIIT/M00/00/00/ajRkHV_AaAaATms4AALLSSrBvlw858.png">
</a>
</div>

## 关于

> Makeit Admin Pro，基于 Vue3.0 + Vite 开发，结合 Ant Design Vue 组件库开发的一套适合中后台管理项目的统一 UI 框架，包含统一的页面布局 / 注册页面 / 登录页面 / 验证码 / 动态配置项目菜单等常用模块，开箱即用。集成这套框架的目的，就是为了免去那些中后台管理项目中，基础又重复的页面，包括布局，登录注册页面等等，同时也集成了项目开发中常用的工具类函数，方便调用及扩展。现阶段还在不断完善，持续开发更新中 ...

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
import 'ant-design-vue/dist/antd.min.css'
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