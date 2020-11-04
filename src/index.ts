import { App } from 'vue'

import config from './utils/config'
import cookie from './utils/cookie'

import { default as Layout } from './components/layout'

const components = [
    config, cookie, Layout
]

const install = (app: App) => {
    components.forEach(component => {
        app.use(component as typeof component & {
            install: () => void
        })
    })
}

export {
    Layout
}

export default {
    version: `${process.env.VERSION}`,
    install
}