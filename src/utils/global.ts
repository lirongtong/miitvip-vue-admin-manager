import { App, reactive } from 'vue'
import {
    GithubOutlined,
    WeiboCircleOutlined,
    QqOutlined,
    GoogleOutlined
} from '@ant-design/icons-vue'

export const MI_POWERED = 'Powered By makeit.vip'
export const MI_AVATAT = 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV_pUyOALE2LAAAtlj6Tt_s370.png'

const now = new Date().getFullYear()

/**
 * 全局通用变量.
 * Global variable.
 */
export const $g = reactive({
    name: 'Makeit Admin Pro',
    title: 'Makeit Admin Pro',
    site: 'Admin Pro',
    author: 'makeit.vip',
    theme: {
        active: 'dark',
        thumbnails: {
            dark: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHWAJIqKARAkyAACmjWZTun0852.png',
            light: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHWAKve-Ac7D8AAH4rA17tm0600.png'
        }
    } as { [index: string]: any },
    background: {
        default: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV7Z_ieAVz4DAAAdR-zeJvg322.svg',
        captcha: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV7d0JOAJYSMAAFwUxGzMIc287.jpg'
    } as { [index: string]: any },
    keywords:
        'makeit, makeit.vip, makeit-admin, admin-manage, makeit admin pro, miitvip, vue, vue3, vite, typescript, ant-design-vue component-ui, ui frame, 麦可易特网',
    description:
        'Makeit Admin Pro，基于 Vue3.x + Vite2.x 版本，并结合 Ant Design Vue 组件库开发的一套适合中后台管理项目的统一 UI 框架 ( A unified template used to backend management system based on Vue3.x + Vite2.x + Ant Design Vue. )，项目内含统一的页面布局 / 注册页面 / 登录页面 / 忘记密码 / 滑块验证码组件 / 搜索联想组件 / 动态菜单配置 / 权限管理配置等常用模块，开箱即用（有部分组件已经单独抽离并发布于 Npm）。集成这套框架的目的，主要是为了免去中后台管理项目中，基础又重复的页面，如页面的基础布局，登录 / 注册 / 忘记密码等页面，让开发人员能更加专注于业务内容页面的开发。该框架封装了 Axios / Cookie / Storage等功能，能直接调用，且易于扩展。现阶段还在不断完善，持续开发更新中 ...',
    powered: MI_POWERED,

    /**
     * 前缀.
     * anywhere you want to used, eg: cookie, storage, vuex ...
     */
    prefix: 'mi-',

    logo: MI_AVATAT,
    avatar: MI_AVATAT,

    /**
     * 加密盐值 ( 可自行通过 env 配置进行覆盖 ).
     * Encrypted salt.
     */
    salt: 'mi-bXrf4dJbLlf0u8X3',

    /**
     * 分隔符 ( 可用于加密字串的切分, 用于解密等 ).
     * delimiter, Mainly used when decrypting encrypted strings.
     */
    separator: '/!#!$/',

    apiVersion: 'v1',
    fileServer: 'https://file.makeit.vip/',
    backToTop: true,
    userInfo: {} as any,
    isMobile: false,
    locale: 'zh-cn',
    methods: [
        'get',
        'post',
        'put',
        'patch',
        'delete',
        'options',
        'head',
        'link',
        'unlink',
        'purge'
    ],

    /**
     * 常用的正则规则.
     * regular rules.
     */
    regExp: {
        mobile: /^1[3456789]\d{9}$/,
        url: /^((https|http|ftp|rtsp|mms)?:\/\/)(([0-9A-Za-z_!~*'().&=+$%-]+: )?[0-9A-Za-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9A-Za-z_!~*'()-]+.)*([0-9A-Za-z][0-9A-Za-z-]{0,61})?[0-9A-Za-z].[A-Za-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9A-Za-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/,
        password: /^[A-Za-z0-9~!@#$%^&*()_+=\-.,]{6,32}$/,
        username: /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){3,15}$/,
        email: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    } as { [index: string]: any },

    /**
     * 缓存 Key 值 ( cached key value ).
     * 区分 `storage` 与 `cookie` 的缓存.
     * including `storages` and `cookies`.
     */
    caches: {
        cookies: {
            auto: 'auto-login',
            token: {
                access: 'access-token',
                refresh: 'refresh-token'
            },
            theme: 'theme'
        },
        storages: {
            user: 'user-info',
            email: 'user-email',
            routes: 'history-routes',
            collapsed: 'layout-menu-collapsed',
            locale: 'locale-language',
            captcha: {
                login: 'login-captcha-key',
                register: 'register-captcha-key',
                email: 'email-captcha-key'
            },
            password: {
                time: 'password-reset-code-sent-time',
                token: 'password-reset-verify-token',
                uid: 'password-reset-uid',
                input: 'password-reset-input'
            }
        }
    } as { [index: string]: any },

    socialites: {
        domain: 'http://local-api.makeit.vip/v1/oauth',
        items: [
            {
                name: 'github',
                icon: GithubOutlined
            },
            {
                name: 'weibo',
                icon: WeiboCircleOutlined
            },
            {
                name: 'qq',
                icon: QqOutlined
            },
            {
                name: 'google',
                icon: GoogleOutlined
            }
        ]
    } as { [index: string]: any },

    /**
     * side menu.
     * @param {string[]} active currently selected menu item.
     * @param {string[]} opens currently selected sub menu item.
     * @param {any[]} items see interface `MenuItems`.
     * @param {boolean} accordion whether to open the accordion menu.
     * @param {string[]} relationshipChain the relationship chain of the selected menu, from the root to bottom.
     * @type {object}
     */
    menus: {
        active: [],
        opens: [],
        items: [],
        accordion: true,
        collapsed: false,
        drawer: false,
        dropdown: [],
        relationshipChain: [],
        width: 256
    } as { [index: string]: any },
    breadcrumbs: [] as any[],

    copyright: {
        pc: `&copy; Copyright 2020 - ${now} <a href="https://www.makeit.vip" target="_blank">www.makeit.vip</a> All Rights Reserved. 版权所有 ( <a href="http://beian.miit.gov.cn" target="_blank">粤ICP备17018474号</a> )`,
        mobile: `&copy; Copyright ${now} <a href="https://www.makeit.vip" target="_blank">makeit.vip</a>`
    }
})

export default {
    install(app: App) {
        app.config.globalProperties.$g = $g
        app.provide('$g', $g)
        return app
    }
}
