import { App, reactive } from 'vue'

export declare interface MenuItem {
    name: string;
    title: string;
    path?: string;
    icon?: string;
    tag?: Record<string, string>;
}

export declare interface MenuItems {
    /**
     * Path of the record. Should start with `/` unless the record is the child of
     * another record.
     * 
     * @example `/users/:id` matches `/users/1` as well as `/users/posva`.
     */
    path: string;

    /**
     * Name for the item.
     */
    name: string;

    /**
     * Array of nested menu items.
     */
    children?: MenuItems[];
    groups?: MenuItems[];

    /**
     * Interface to type `meta` fields in items records.
     */
    meta?: Record<string | number | symbol, any>;
}

export declare interface Config {
    /**
     * Independent project, or embedded project.
     * If it is an embedded project, the `header` and `sider` are not displayed, only content section is displayed.
     * @type {boolean}
     */
    embed: boolean;

    /**
     * Website title.
     * @type {string}
     */
    title: string;

    /**
     * Website author.
     * @type {string}
     */
    author: string;

    /**
     * Website keywords.
     * @type {string}
     */
    keywords: string;

    /**
     * Website description.
     * @type {string}
     */
    description: string;

    /**
     * All rights reserved.
     * @type {string}
     */
    powered: string;

    /**
     * Website logo.
     * @type {string | null}
     */
    logo: string | null;

    /**
     * Website default avatar.
     * @type {string | null}
     */
    avatar: string | null;

    /**
     * Prefix.
     * Anywhere you want to used, eg: cookie, storage, vuex ...
     * @type {string}
     */
    prefix: string;

    /**
     * Encrypted salt.
     * @type {string}
     */
    salt: string;

    /**
     * Delimiter.
     * Mainly used when decrypting encrypted strings.
     * @type {string}
     */
    separator: string;

    /**
     * General background image.
     * @type {{[index: string]: string}}
     */
    background: {[index: string]: any};

    /**
     * Api version.
     * @type {string}
     */
    apiVersion: string;

    /**
     * User information.
     * @type {Record}
     */
    userInfo: Record<string, any>;

    /**
     * Whether is mobile phone.
     * @type {boolean}
     */
    mobile: boolean;

    /**
     * General regular expression.
     * @type {{[index: string]: any}}
     */
    regExp: {[index: string]: any},

    /**
     * Cached key value.
     * Including `storages` and `cookies`
     * @type {storages: {}, cookies: {}}
     */
    caches: {
        storages: {[index: string]: any};
        cookies: {[index: string]: any};
    },

    /**
     * Sider menu.
     * @param {string[]} active Currently selected menu item.
     * @param {string[]} opens Currently selected sub menu item.
     * @param {any[]} items See interface `MenuItems`.
     * @param {boolean} accordion Whether to open the accordion menu.
     * @param {string[]} relationshipChain The relationship chain of the selected menu,
     *                                      from the root to bottom.
     * @type {object}
     */
    menus: {
        active: string[];
        opens: (string | number)[];
        items: MenuItems[];
        accordion: boolean;
        collapsed: boolean;
        drawer: boolean;
        dropdown: MenuItem[];
        relationshipChain: string[];
    },

    /**
     * Used at the bottom of the website (PC browser)
     * @type {string}
     */
    footer: string;

    /**
     * Used at the bottom of the website (mobile browser).
     * @type {string}
     */
    copyright: string;

    /**
     * Add an attribute of any name.
     * @type {any}
     */
    [propName: string]: any;

    /**
     * Dynamically add parameters.
     * If the key value is exists, the original value will be directly overwritten.
     * 
     * eg.,
     * ```ts
     * this.G.set('author', 'lirongtong')
     * ```
     * @param key 
     * @param value 
     */
    add(key: string, value: any): () => void;
}

export const config: {[index: string]: any} = reactive({
    embed: false,
    title: '管理系统 UI 框架',
    author: '麦可易特网',
    keywords: '麦可易特网, makeit, makeit.vip, miitvip, vue, typescript, ant-design-vue, component-ui, makeit-admin, vue3.0, vite, webpack, admin-manage, UI frame',
    description: `makeit's backend management system ( a unified template ). 麦可易特网统一后台管理模板，内含登录 / 注册等常用模块，开箱即用，持续更新 ...`,
    powered: 'Powered By makeit.vip',
    logo: null,
    avatar: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV7QkoCAeo6PAAARuoXj0Jc275.png',
    prefix: (import.meta as any).env.VITE_MAKEIT_ADMIN_PREFIX ?? 'mi-',
    salt: 'mi-bXrf4dJbLlf0u8X3',
    separator: '/!#!$/',
    background: {
        default: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV7Z_ieAVz4DAAAdR-zeJvg322.svg',
		captcha: 'https://file.makeit.vip/MIIT/M00/00/00/ajRkHV7d0JOAJYSMAAFwUxGzMIc287.jpg'
    },
    apiVersion: 'v1',
    userInfo: {},
    mobile: false,
    regExp: {
        phone: /^1[3456789]\d{9}$/,
        url: /^((https|http|ftp|rtsp|mms)?:\/\/)(([0-9A-Za-z_!~*'().&=+$%-]+: )?[0-9A-Za-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9A-Za-z_!~*'()-]+.)*([0-9A-Za-z][0-9A-Za-z-]{0,61})?[0-9A-Za-z].[A-Za-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9A-Za-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/,
        password: /^[A-Za-z0-9~!@#$%^&*()_+=\-.,]{6,32}$/,
        username: /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){3,15}$/,
        email: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    },
    caches: {
        storages: {
            user: 'user-info',
            collapsed: 'layout-menu-collapsed',
            routes: 'history-routes'
        },
        cookies: {
            token: {
                access: 'access-token',
                refresh: 'refresh-token'
            }
        }
    },
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
    footer: '&copy; Copyright 2020 <a href="https://www.makeit.vip" target="_blank">www.makeit.vip</a> All Rights Reserved. 版权所有 ( <a href="http://beian.miit.gov.cn" target="_blank">粤ICP备17018474号</a> )',
    copyright: '&copy; Copyright 2020 <a href="https://www.makeit.vip" target="_blank">makeit.vip</a>'
})

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        G: Config
    }
}

const G = {
    install(app: App) {
        app.config.globalProperties.G = {
            ...config,
            add: (key: string, value: any): void => {
                app.config.globalProperties.G[key] = value
            }
        }
    }
}
export default G