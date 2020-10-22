import { App } from 'vue'
import MiLayout from './components/layout'

const components: {[index: string]: any} = {
    MiLayout
}
const install = (app: App) => {
    Object.keys(components).forEach((name) => {
        app.use(components[name])
    })
}

export default class MakeitAdmin {
    static install: (app: App) => void
    static version: string
    constructor() {}
}
MakeitAdmin.install = install
MakeitAdmin.version = `${process.env.VERSION}`