import { App, reactive, createVNode } from 'vue'
import {
    GithubOutlined,
    GoogleOutlined,
    QqOutlined,
    WeiboCircleOutlined
} from '@ant-design/icons-vue'

export const $MI_HOME = 'https://www.makeit.vip'
export const $MI_POWERED = 'Powered By makeit.vip'
export const $MI_ARATAR =
    'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV7QkoCAeo6PAAARuoXj0Jc275.png'

export declare interface MenuItems {
    /**
     * Path of the record. Should start with `/` unless the record is the child of
     * another record.
     *
     * @example `/users/:id` matches `/users/1` as well as `/users/posva`.
     */
    path: string

    /**
     * Name for the item.
     */
    name: string

    /**
     * Interface to type `meta` fields in items records.
     */
    meta?: Record<string | number, any>

    /**
     * Array of nested menu items.
     */
    children?: MenuItems[]
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $g: any
    }
}

export const $g = reactive({
    /**
     * Independent project, or embedded project.
     * If it is an embedded project, the `header` and `sider` are not displayed, only content section is displayed.
     * @type {boolean}
     */
    embed: false,

    /**
     * Website title.
     * @type {string}
     */
    title: '中后台管理系统',

    /**
     * Website name.
     * @type {string}
     */
    site: '麦可易特网',

    /**
     * Website author.
     * @type {string}
     */
    author: '麦可易特网',

    /**
     * Website keywords.
     * @type {string}
     */
    keywords:
        'makeit, makeit.vip, makeit-admin, admin-manage, makeit admin pro, miitvip, vue, vue3, vite, typescript, ant-design-vue component-ui, ui frame',

    /**
     * Website description.
     * @type {string}
     */
    description:
        "makeit's backend management system ( a unified template ). 麦可易特网中后台管理模板，内含登录 / 注册 / 验证码等常用模块，开箱即用，持续更新 ...",

    /**
     * All rights reserved.
     * @type {string}
     */
    powered: 'Powered By makeit.vip',

    /**
     * Website logo.
     * @type {string | null}
     */
    logo: null,

    /**
     * Website default avatar.
     * @type {string | null}
     */
    avatar: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV7QkoCAeo6PAAARuoXj0Jc275.png',

    /**
     * Prefix.
     * Anywhere you want to used, eg: cookie, storage, vuex ...
     * @type {string}
     */
    prefix: 'mi-',

    /**
     * Encrypted salt.
     * @type {string}
     */
    salt: 'mi-bXrf4dJbLlf0u8X3',

    /**
     * Delimiter.
     * Mainly used when decrypting encrypted strings.
     * @type {string}
     */
    separator: '/!#!$/',

    /**
     * General background image.
     * @type {{[index: string]: string}}
     */
    background: {
        default: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV7Z_ieAVz4DAAAdR-zeJvg322.svg',
        captcha: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV7d0JOAJYSMAAFwUxGzMIc287.jpg'
    },

    /**
     * Api version.
     * @type {string}
     */
    apiVersion: 'v1',

    /**
     * User information.
     * @type {Record}
     */
    userInfo: {},

    /**
     * Whether is mobile phone.
     * Assign value at `created`.
     * @type {boolean}
     */
    mobile: false,

    /**
     * General regular expression.
     * @type {{[index: string]: any}}
     */
    regExp: {
        phone: /^1[3456789]\d{9}$/,
        url: /^((https|http|ftp|rtsp|mms)?:\/\/)(([0-9A-Za-z_!~*'().&=+$%-]+: )?[0-9A-Za-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9A-Za-z_!~*'()-]+.)*([0-9A-Za-z][0-9A-Za-z-]{0,61})?[0-9A-Za-z].[A-Za-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9A-Za-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/,
        password: /^[A-Za-z0-9~!@#$%^&*()_+=\-.,]{6,32}$/,
        username: /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){3,15}$/,
        email: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    },

    /**
     * Cached key value.
     * Including `storages` and `cookies`
     * @type {storages: {}, cookies: {}}
     */
    caches: {
        storages: {
            user: 'user-info',
            collapsed: 'layout-menu-collapsed',
            routes: 'history-routes',
            captcha: {
                login: 'login-captcha-key',
                register: 'register-captcha-key',
                email: 'email-captcha-key'
            }
        },
        cookies: {
            auto: 'auto-login',
            token: {
                access: 'access-token',
                refresh: 'refresh-token'
            }
        }
    },

    socialites: {
        domain: 'https://account.makeit.vip/v1/oauth',
        items: [
            { name: 'github', icon: createVNode(GithubOutlined), iconSize: 18 },
            { name: 'weibo', icon: createVNode(WeiboCircleOutlined), iconSize: 18 },
            { name: 'qq', icon: createVNode(QqOutlined), iconSize: 18 },
            { name: 'google', icon: createVNode(GoogleOutlined), iconSize: 18 }
        ]
    },

    /**
     * Sider menu.
     * @param {string[]} active Currently selected menu item.
     * @param {string[]} opens Currently selected sub menu item.
     * @param {any[]} items See interface `MenuItems`.
     * @param {boolean} accordion Whether to open the accordion menu.
     * @param {string[]} relationshipChain The relationship chain of the selected menu, from the root to bottom.
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
        relationshipChain: []
    },

    /**
     * Used at the bottom of the website (PC browser)
     * @type {string}
     */
    footer:
        '&copy; Copyright 2020 <a href="https://www.makeit.vip" target="_blank">www.makeit.vip</a> All Rights Reserved. 版权所有 ( <a href="http://beian.miit.gov.cn" target="_blank">粤ICP备17018474号</a> )',

    /**
     * Used at the bottom of the website (mobile browser).
     * @type {string}
     */
    copyright:
        '&copy; Copyright 2020 <a href="https://www.makeit.vip" target="_blank">makeit.vip</a>'
})

const global = {
    install(app: App) {
        app.config.globalProperties.$g = $g
        return app
    }
}
export default global
