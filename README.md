<p align="center">
    <a href="https://admin.makeit.vip/">
        <img width="200" src="https://file.makeit.vip/MIITVIP/M00/00/00/K4vDRGPcbmmAG8_sAAAtlj6Tt_s562.png">
    </a>
</p>

<h1 align="center">
    <a href="https://admin.makeit.vip/" target="_blank">
        <font color="#f6ca9d">Makeit Admin Pro 2.x</font>
    </a>
</h1>

<div align="center">

基于 Vue3.x + Vite4.x + Ant Design Vue 构建的适用于中后台管理系统的组合模板框架。

( A unified template used to backend management system based on Vue3.x + Vite4.x + Ant Design Vue. )

[![npm package](https://img.shields.io/npm/v/makeit-admin-pro.svg?style=flat-square)](https://www.npmjs.com/package/makeit-admin-pro)
[![npm downloads](http://img.shields.io/npm/dm/makeit-admin-pro.svg?style=flat-square)](http://www.npmtrends.com/makeit-admin-pro)
![MIT](https://img.shields.io/badge/license-MIT-ff69b4.svg)
![npm](https://img.shields.io/badge/npm-8.1.3-orange.svg)
![nodejs](https://img.shields.io/badge/nodejs-17.7.1-red.svg)
![webpack](https://img.shields.io/badge/webpack-5.70.0-orange.svg)
![vue](https://img.shields.io/badge/vue-3.2.47-green.svg)
![vite](https://img.shields.io/badge/vite-4.1.1-yellow.svg)
![axios](https://img.shields.io/badge/axios-1.3.2-red.svg)
![ant design vue](https://img.shields.io/badge/ant%20design%20vue-3.x-blueviolet.svg)
![vue router](https://img.shields.io/badge/vue%20router-4.1.6-inactive.svg)
![vuex](https://img.shields.io/badge/vuex-4.1.0-informational.svg)
![vue-i18n](https://img.shields.io/badge/vue%20i18n-9.2.2-default.svg)

</div>

## 关于

> :triangular_flag_on_post: `Makeit Admin Pro`，基于 `Vue3.x + Vite4.x`，并结合 `Ant Design Vue` 组件库开发的一套适合中后台管理项目的统一 `UI` 框架。
> >
> :beginner: 该框架含统一的页面布局 / 注册页面 / 登录页面 / 忘记密码 / 滑块验证码组件 / 搜索联想组件 / 动态菜单配置 / 权限管理配置等常用模块，开箱即用（部分组件已抽离并发布于 `Npm`，可单独安装使用）。
> >
> :lollipop: 集成这套框架的主要目的为了免去中后台管理项目中，基础又重复的页面构建，如各个项目的基础布局，登录 / 注册 / 忘记密码等模块，让开发人员能更加专注于业务内容的开发，无需花费过多的时间在基础构建上。该框架封装了 `Axios` / `Cookie` / `Storage` 等常用的基础基础功能，如 `cookie` 可通过如 `this.$cookie` 形式直接调用，同时也支持开发人员自行定制，易于扩展。现阶段还在不断完善，持续开发更新中 ...
> >
> :bug: 该框架并不一定适合所有人的需求，若您看到或是尝试使用了该框架 :innocent: 对该框架的 `UI` 或功能组件的使用有更好的建议，或有更多的定制化需求，组件存在 `BUG` 等，欢迎来 [这里](https://github.com/lirongtong/miitvip-vue-admin-manager/issues) 提 `issues`，我将尽力去解决相应的 `BUG`。对于合理的定制化需求，我也会采纳并且去完善相应的定制化需求。
> >
> :warning: 注：现在 [https://admin.makeit.vip](https://admin.makeit.vip) 站点内看到的页面是基于 1.x 版本的效果，2.x 版本的示例站点正在开发中，2.x 版本的页面效果及组件效果都做了诸多调整，敬请期待 ~

## 全局应用

:white_check_mark: 主题配置 ( `css variables` )

:white_check_mark: 国际化 ( `vue-i18n` )

:white_check_mark: Cookie ( `document.cookie` )

:white_check_mark: Storage ( `localStorage & sessionStorage` )

:white_check_mark: Request ( `axios` )

:white_check_mark: Global ( 全局配置 `global configuration` )

:white_check_mark: Tools ( 全局公用函数库 `common functions` )

## 基础组件

:white_check_mark: 基础布局 ( `Layout` ) :sparkling_heart:

:white_check_mark: 滑块验证码 ( `Captcha` ) :collision:

:white_check_mark: 锚点链接 ( `Anchor` ) :balloon:

:white_check_mark: 时钟 ( `Clock` - 仿 `Apple Watch` 表盘 ) :clock130:

:white_check_mark: 下拉菜单 ( `Dropdown` ) :palm_tree:

:white_check_mark: 忘记密码 ( `Forget` ) :hammer:

:white_check_mark: 历史路由 ( `History` ) :guitar:

:white_check_mark: 登录组件 ( `Login` ) :cherries:

:white_check_mark: 注册组件 ( `Register` ) :european_castle:

:white_check_mark: 菜单组件 ( `Menu` ) :rocket:

:white_check_mark: 弹窗动效 ( `Modal` ) :traffic_light:

:white_check_mark: 消息中心 ( `Notice` ) :round_pushpin:

:white_check_mark: 密码设置 ( `Password` ) :u7981:

:white_check_mark: 搜索组件 ( `Search` ) :bookmark_tabs:

:white_check_mark: 代码高亮 ( `Code` ) :flight_arrival:

## 高级应用

:x: 权限控制 :sunglasses:

:white_check_mark: 菜单配置 ( 动态路由 ) :triangular_flag_on_post:

:white_check_mark: 语言配置 :snowflake:

:x: 富文本编辑器 :ocean:

:x: 地域选择 :heart_eyes_cat:

:x: 异常页面 ( `404` ) :sleeping:

:x: 个人中心 :heart_eyes:

:sparkles: ······

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
    <mi-login :action="api.login"
        :background="bg"
        :captcha-init-action="api.captcha.init"
        :captcha-verify-action="api.captcha.verify" />
</template>

<script setup>
import bg from '@images/login-bg.jpg'
</script>
```

## 注册

```vue
<template>
    <mi-register :action="api.register"
        :background="bg"
        :email-verify-action="api.validator.email"
        :username-verify-action="api.validator.name" />
</template>

<script setup>
import bg from '@images/login-bg.jpg'
</script>
```

## 更多

> 更多内容及使用请查看在线示例：[https://admin.makeit.vip](https://admin.makeit.vip)
