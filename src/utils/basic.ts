/* eslint-disable import/no-unresolved */
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
import { register, SwiperContainer, SwiperSlide } from 'swiper/element/bundle'

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
    export interface GlobalComponents {
        SwiperContainer: SwiperContainer
        SwiperSlide: SwiperSlide
    }
}

let __tree_shaking_basic__ = false
export default {
    install(app: App) {
        __tree_shaking_basic__ = true
        // 默认主题
        $tools.createThemeProperties($g.theme.primary || '#FFD464')
        // 窗口大小
        $tools.setWinSize()
        // 轮播
        register()
        // 注册组件
        components.forEach((component) => [
            app.use(component as typeof component & { install: () => void })
        ])
        return app
    }
}

export { __tree_shaking_basic__ }
