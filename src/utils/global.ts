import { type App, reactive } from 'vue'
import type { GlobalProperties } from './types'
import { __LOGO__ } from './images'

const MI_YEAR = new Date().getFullYear()
export const __MI_AUTHOR__ = 'makeit.vip'
export const __MI_POWERED__ = 'Powered By makeit.vip'
export const __MI_LOGO__ = __LOGO__
export const __MI_SITE__ = 'https://admin.makeit.vip'
export const __MI_SOCIALITE_DOMAIN__ = '/v1/oauth'

/**
 * 全局变量 - ( `this.$g` )
 * @param title 文档标题
 * @param site 站点名称
 * @param author 作者
 * @param powered 提供方
 * @param keywords 关键词
 * @param description 描述
 * @param prefix 前缀
 * @param salt 加密盐值
 * @param separator 加密字符串的分隔符
 * @param apiVersion API 版本
 * @param emptyFormatter 空串格式化的字符串
 * @param theme 主题配置属性
 * @param copyright 版权所有
 * @param protocols URL 校验协议数组
 * @param regExp 常用正则
 * @param caches 缓存 key 值
 * @param breakpoints 断点配置
 * @param winSize 窗口尺寸
 */
export const $g = reactive({
    title: 'Makeit Admin Pro',
    site: 'Admin Pro',
    author: __MI_AUTHOR__,
    powered: __MI_POWERED__,
    logo: __MI_LOGO__,
    locale: `zh-cn`,
    keywords: `vue, vue3, makeit, makeit.vip, makeitAdminPro, vueComponent, component, uiDesign, uiFrame, 麦可易特网, typescript, lirongtong, vite, makeit-admin-pro, adminManager, makeit-admin, @miitvip/admin-pro`,
    description: `Makeit Admin Pro 是基于 Vue3.x + Ant Design Vue4.x + Vite5.x 构建开发的一套适合中后台管理项目的 UI 框架。框架内置了统一风格的页面布局 / 注册页面 / 登录页面 / 忘记密码 / 滑块验证码组件 / 搜索联想组件 / 动态菜单配置 / 权限管理配置等常用模块，开箱即用。设计这套框架的初衷是为了免去中后台管理项目中基础又重复的页面构建，将页面内的一系列行为进行封装形成重型组件（一个组件≈一个页面），如基础布局 Layout / 登录Login / 注册 Register / 忘记密码 Forget 等模块，让开发人员能更加专注于业务内容的开发，无需花费过多的时间在基础构建上，希望可以通过 Makeit Admin Pro 系列组件提供快速高效的搭建高质量的中后台应用，现阶段还在不断完善，持续开发更新中 ....`,
    prefix: 'mi-',
    salt: 'mi-ZBmnY3mojbXvijFf',
    separator: '/!#!$/',
    apiVersion: 'v1',
    emptyFormatter: '-',
    theme: {
        type: 'dark',
        primary: '#FFD464',
        radius: 6
    },
    copyright: {
        laptop: `&copy; Copyright 2020 - ${MI_YEAR} <a href="https://www.makeit.vip" target="_blank">www.makeit.vip</a> All Rights Reserved. 版权所有 ( <a href="http://beian.miit.gov.cn" target="_blank">粤ICP备17018474号-2</a> )`,
        mobile: `&copy; Copyright ${MI_YEAR} <a href="https://www.makeit.vip" target="_blank">makeit.vip</a>`
    },
    protocols: ['https', 'http', 'ftp', 'mms', 'rtsp'],
    regExp: {
        phone: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
        password: /^[A-Za-z0-9~!@#$%^&*()_+=\-.,]{6,32}$/,
        username: /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){3,15}$/,
        email: /^[A-Za-z0-9\.\-_\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        chinese: /^[\u4e00-\u9fa5]*$/,
        hex: /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,
        rgb: /^(rgb|RGB)/
    },
    caches: {
        storages: {
            theme: {
                type: 'theme-type',
                hex: 'theme-color-hex'
            },
            user: 'user-info',
            email: 'user-email',
            locale: 'language-locale',
            collapsed: 'layout-menu-collapsed',
            languages: {
                custom: 'languages-custom',
                categories: 'languages-categories'
            },
            captcha: {
                login: 'login-captcha-key',
                register: 'register-captcha-key',
                email: 'email-captcha-key'
            },
            password: {
                reset: {
                    time: 'password-reset-code-sent-time',
                    token: 'password-reset-verify-token',
                    uid: 'password-reset-uid',
                    username: 'password-reset-username'
                }
            }
        },
        cookies: {
            autoLogin: 'auto-login',
            token: {
                access: 'access-token',
                refresh: 'refresh-token'
            }
        }
    },
    breakpoints: {
        xs: 480,
        sm: 576,
        md: 768,
        lg: 992,
        xm: 1024,
        xl: 1200,
        xxl: 1600,
        xxxl: 2000
    },
    winSize: {
        width: 0,
        height: 0
    }
}) as unknown as GlobalProperties

export default {
    install(app: App) {
        app.config.globalProperties.$g = $g
        return app
    }
}
