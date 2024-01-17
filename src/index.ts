import type { App } from 'vue'
import Basic from './utils/basic'

import { default as Theme } from './components/theme'
import { default as Layout } from './components/layout'

import * as components from './components'
export * from './components'

let _init = false
const install = (app: App) => {
    if (!_init) {
        _init = true
        app.use(Basic)
        Object.keys(components).forEach((key: string) => {
            const component = components[key]
            if (component?.install) app.use(component)
        })
    }
    return app
}

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        MiTheme: typeof Theme
        MiLayout: typeof Layout
    }
}

export default { install }
