import { App } from 'vue'

import config from './utils/config'
import cookie from './utils/cookie'
import storage from './utils/storage'
import http from './utils/http'
import tools from './utils/tools'
import api from './utils/api'

import { default as Layout } from './components/layout'

const components = [config, cookie, storage, http, tools, api, Layout]

const install = (app: App) => {
    components.forEach((component) => {
        app.use(
            component as typeof component & {
                install: () => void
            }
        )
    })
    return app
}

export { config, cookie, storage, http, tools, api, Layout }

export default {
    version: `${process.env.VERSION}`,
    install
}
