import { App } from 'vue'
import './styles'

import { default as Layout } from './components/layout'

const components = [
    Layout
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