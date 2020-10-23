import { App } from 'vue'

export declare interface Config {
    /**
     * Website title.
     * @type string
     */
    title: string;

    /**
     * Website author.
     * @type string
     */
    author: string;

    /**
     * Website keywords.
     * @type string
     */
    keywords: string;

    /**
     * Website description.
     * @type string
     */
    description: string;

    /**
     * @type string
     */
    powered: string;

    /**
     * Prefix.
     * Anywhere you want to used, eg: cookie, storage, vuex ...
     * @type string
     */
    prefix: string;

    /**
     * Encrypted salt.
     * @type string
     */
    salt: string;

    /**
     * Delimiter.
     * Mainly used when decrypting encrypted strings.
     * @type string
     */
    separator: string;

    /**
     * Whether is mobile phone.
     * @type boolean
     */
    mobile: boolean;

    /**
     * General regular expression.
     * @type object
     */
    regExp: {},

    /**
     * Used at the bottom of the website (PC browser)
     * @type string
     */
    footer: string;

    /**
     * Used at the bottom of the website (mobile browser).
     * @type string
     */
    copyright: string;

    /**
     * Add an attribute of any name.
     * @type any
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

const config: {[index: string]: any} = {
    title: '后台管理系统 UI 框架',
    author: '麦可易特网',
    keywords: '麦可易特网, makeit, makeit.vip, miitvip, vue, typescript, ant-design-vue, component-ui, makeit-admin, vue3.0, vite, webpack, admin-manage, UI frame',
    description: `makeit's backend management system ( a unified template ). 麦可易特网统一后台管理模板，内含登录 / 注册等常用模块，开箱即用，持续更新 ...`,
    powered: 'Powered By makeit.vip',
    prefix: 'mi-',
    salt: 'mi-bXrf4dJbLlf0u8X3',
    separator: '/!#!$/',
    mobile: false,
    regExp: {
        phone: /^1[3456789]\d{9}$/,
        url: /^((https|http|ftp|rtsp|mms)?:\/\/)(([0-9A-Za-z_!~*'().&=+$%-]+: )?[0-9A-Za-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9A-Za-z_!~*'()-]+.)*([0-9A-Za-z][0-9A-Za-z-]{0,61})?[0-9A-Za-z].[A-Za-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9A-Za-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/,
        password: /^[A-Za-z0-9~!@#$%^&*()_+=\-.,]{6,32}$/,
        username: /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){3,15}$/,
        email: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    },
    footer: '&copy; Copyright 2020 <a href="https://www.makeit.vip" target="_blank">www.makeit.vip</a> All Rights Reserved. 版权所有 ( <a href="http://beian.miit.gov.cn" target="_blank">粤ICP备17018474号</a> )',
    copyright: '&copy; Copyright 2020 <a href="https://www.makeit.vip" target="_blank">makeit.vip</a>'
}

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