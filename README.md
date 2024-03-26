<div align="center">

[![makeit.vip](https://file.makeit.vip/MIITVIP/M00/00/00/K4vDRGPcbmmAG8_sAAAtlj6Tt_s562.png "makeit.vip")](https://admin.makeit.vip)

</div>

<h1 align="center">

[*Makeit Admin Pro 3.x*](https://admin.makeit.vip)

</h1>

<div align="center">

<p align="center">

<div>

基于 `Vue3.x` 构建的适用于中后台管理系统的开箱即用的组合模板框架

</div>
<div>

( An out-of-box UI solution for enterprise applications built on Vue3.x )

</div>

<div>

( `3.x` 版本的 `npm` 包将由 `makeit-admin-pro` 改为 `@makeit/admin-pro`, 正在重构中，尚未发版 )

</div>

</p>

[![npm package](https://img.shields.io/npm/v/makeit-admin-pro.svg?style=flat-square)](https://www.npmjs.com/package/makeit-admin-pro)
[![npm downloads](http://img.shields.io/npm/dm/makeit-admin-pro.svg?style=flat-square)](http://www.npmtrends.com/makeit-admin-pro)
![MIT](https://img.shields.io/badge/license-MIT-ff69b4.svg)
![nodejs](https://img.shields.io/badge/nodejs-18.18.2-red.svg)
![vue](https://img.shields.io/badge/vue-3.4.7-green.svg)
![vite](https://img.shields.io/badge/vite-5.0.10-yellow.svg)
![ant design vue](https://img.shields.io/badge/ant%20design%20vue-4.1.2-blueviolet.svg)
![pinia](https://img.shields.io/badge/pinia-2.1.7-informational.svg)
![vue-i18n](https://img.shields.io/badge/vue%20i18n-9.8.0-default.svg)
![axios](https://img.shields.io/badge/axios-1.6.2-red.svg)
![swiper](https://img.shields.io/badge/swiper-11.0.5-green.svg)
![nprogress](https://img.shields.io/badge/nprogress-0.2.0-yellow.svg)
![vue-router](https://img.shields.io/badge/vue%20router-4.2.5-blueviolet.svg)

</div>

## 关于

> :triangular_flag_on_post: `Makeit Admin Pro` 是基于 `Vue 3.x + Vite 5.x + Ant Design Vue 4.x` 构建开发的一套适合中后台管理项目的 `UI` 框架。
> >
> :beginner: 框架内置了统一风格的页面布局 / 注册页面 / 登录页面 / 忘记密码 / 滑块验证码组件 / 搜索联想组件 / 动态菜单配置 / 权限管理配置等常用模块，开箱即用。
> >
> :lollipop: 设计这套框架的初衷是为了免去中后台管理项目中基础又重复的页面构建，将页面内的一系列行为进行封装形成重型组件（一个组件 ≈ 一个页面），如基础布局 `Layout`，登录 `Login` / 注册 `Register` / 忘记密码 `Forget` 等页面模块，让开发人员能更加专注于业务内容的开发，无需花费过多的时间在基础构建上，希望可以通过 `Makeit Admin Pro` 系列组件提供快速高效的搭建高质量的中后台应用，现阶段还在不断完善，持续开发更新中 ...
> >
> 体验地址：[https://admin.makeit.vip/](https://admin.makeit.vip/)

## 全局应用

:white_check_mark: 主题配置 ( `css modules + css variables` )

:white_check_mark: 国际化 ( `vue-i18n` )

:white_check_mark: Cookie ( `document.cookie` )

:white_check_mark: Storage ( `localStorage & sessionStorage` )

:white_check_mark: Request ( `axios` )

:white_check_mark: Global ( 全局配置 `global configuration` )

:white_check_mark: Tools ( 全局公用函数库 `global functions` )

## 基础组件

:white_check_mark: [基础布局](./src/components/layout/README.md) ( `Layout` ) :sparkling_heart:

:white_check_mark: [滑块验证码](./src/components/captcha/README.md) ( `Captcha` ) :collision:

:white_check_mark: [锚点链接](./src/components/anchor/README.md) ( `Anchor` ) :balloon:

:white_check_mark: [精美时钟](./src/components/clock/README.md) ( `Clock` ) :clock130:

:white_check_mark: [下拉菜单](./src/components/dropdown/README.md) ( `Dropdown` ) :palm_tree:

:white_check_mark: [忘记密码](./src/components/forget/README.md) ( `Forget` ) :hammer:

:white_check_mark: [链接地址](./src/components/link/README.md) ( `Link` ) :guitar:

:white_check_mark: [调色面板](./src/components/palette/README.md) ( `Palette` ) :books:

:white_check_mark: [登录页面](./src/components/login/README.md) ( `Login` ) :cherries:

:white_check_mark: [注册页面](./src/components/register/README.md) ( `Register` ) :european_castle:

:white_check_mark: [授权登录](./src/components/socialite/README.md) ( `Socialite` ) :dizzy:

:white_check_mark: [菜单导航](./src/components/menu/README.md) ( `Menu` ) :rocket:

:white_check_mark: [弹窗动效](./src/components/modal/README.md) ( `Modal` ) :traffic_light:

:white_check_mark: [消息中心](./src/components/notice/README.md) ( `Notice` ) :round_pushpin:

:white_check_mark: [密码设置](./src/components/password/README.md) ( `Password` ) :u7981:

:white_check_mark: [搜索组件](./src/components/search/README.md) ( `Search` ) :bookmark_tabs:

:white_check_mark: [代码高亮](./src/components/code/README.md) ( `Code` ) :flight_arrival:

:white_check_mark: [标题设置](./src/components/title/README.md) ( `Title` ) :palm_tree:

:white_check_mark: [引用说明](./src/components/quote/README.md) ( `Quotes` ) :hash:

:white_check_mark: [回到顶部](./src/components/backtop/README.md) ( `Backtop` ) :top:

## 高级应用

:x: 权限控制 :sunglasses:

:white_check_mark: 应用管理 :rose:

:white_check_mark: 菜单配置 ( 动态路由 ) :triangular_flag_on_post:

:white_check_mark: 语言配置 :snowflake:

:x: 富文本编辑器 :ocean:

:x: 地域选择 :heart_eyes_cat:

:x: 异常页面 ( `404` ) :sleeping:

:x: 个人中心 :heart_eyes:

:sparkles: ······

## 安装

```bash
npm i @makeit/admin-pro
```

## 全局引入

```ts
import { createApp } from 'vue'
import MakeitAdminPro from '@makeit/admin-pro'
import App from './app.vue'

const app = createApp(App)
app.use(MakeitAdminPro)
app.mount('#app')
```

## 按需加载

```ts
import { createApp } from 'vue'
import router from './router'
import App from './app.vue'
import { Layout, Notice } from '@makeit/admin-pro'

const app = createApp(App)
app.use(router)
const components = [Layout, Notice]
components.forEach((component) => app.use(component))
app.mount('#app')
```

## 布局

```html
<template>
    <mi-layout />
</template>

<script lang="ts" setup>
    import { useStoreMenu } from '@makeit/admin-pro'

    // 更新菜单
    const menuStore = useStoreMenu()
    menuStore.updateMenus([
        {
            name: 'dashboard',
            path: '/dashboard',
            meta: {
                title: '控制中心',
                subTitle: 'Dashboard',
                icon: DashboardOutlined,
                tag: {color: '#f50', content: 'Hot'}
            }
        }, {
            // ... sider menus
        }
    ])
</script>
```

## 登录

```vue
<template>
    <mi-login action="/v1/login" />
</template>
```

## 注册

```vue
<template>
    <mi-register action="/v1/register" />
</template>
```

## 更多

> 更多内容及使用请查看在线示例：[https://admin.makeit.vip](https://admin.makeit.vip)
