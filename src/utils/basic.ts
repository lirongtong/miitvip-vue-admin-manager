import { type App } from 'vue'
import { createPinia } from 'pinia'
import i18n from '../locales'
import Global, { $g } from './global'
import { default as Api, api } from './api'
import Cookie, { $cookie } from './cookie'
import Storage, { $storage } from './storage'
import Request, { $request } from './request'
import Tools, { $tools } from './tools'
import Prism from '../directives/prism'
import Limit from '../directives/limit'
import Theme from '../components/theme'

const pinia = createPinia()
const components = [pinia, i18n, Global, Api, Cookie, Storage, Request, Prism, Limit, Tools]

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $g: typeof $g
        api: typeof api
        $tools: typeof $tools
        $cookie: typeof $cookie
        $storage: typeof $storage
        $request: typeof $request
    }
}

let __tree_shaking_basic__ = false
export default {
    install(app: App) {
        __tree_shaking_basic__ = true
        // 默认主题
        $tools.createThemeProperties('#f0c26f')
        // 标题
        $tools.setTitle()
        // 关键词
        $tools.setKeywords($g.keywords, true)
        // 描述
        $tools.setDescription($g.description, true)
        // 注册组件
        components.forEach((component) => [
            app.use(component as typeof component & { install: () => void })
        ])
        // 主题
        if (typeof app.component(Theme.name) === 'undefined') {
            app.component(Theme.name, Theme)
        }
        return app
    }
}

export { __tree_shaking_basic__ }