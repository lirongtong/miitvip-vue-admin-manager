import { App } from 'vue'

import config from './utils/config'
import cookie from './utils/cookie'
import storage from './utils/storage'

import { default as Layout } from './components/layout'

const components = [config, cookie, storage, Layout]

const install = (app: App) => {
    components.forEach((component) => {
        app.use(component as typeof component & {
            install: () => void
        })
        return app
    })
}

export {
    config,
    cookie,
    storage,
    Layout
}

export default {
    version: `${process.env.VERSION}`,
    install
}
