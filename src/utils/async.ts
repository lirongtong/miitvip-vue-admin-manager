import { App } from 'vue'
import baseMixins from './mixins'
import i18n from '../locales'
import global, { $g } from './global'
import cookie, { $cookie } from './cookie'
import storage, { $storage } from './storage'
import request, { $request } from './request'
import tools, { $tools } from './tools'

const components = [i18n, global, cookie, storage, request, tools]

let _init = false
const install = (app: App) => {
    if (!_init) {
        components.forEach((comp) => {
            app.use(
                comp as typeof comp & {
                    install: () => void
                }
            )
        })
        app.mixin(baseMixins)
        _init = true
    }
    return app
}

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $g: typeof $g
        $tools: typeof $tools
        $request: typeof $request
        $cookie: typeof $cookie
        $storage: typeof $storage
    }
}

export default { install }
