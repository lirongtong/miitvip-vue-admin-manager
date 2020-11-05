import { App, Plugin } from 'vue'

export const install = <T>(component: T) => {
    const C = component as any
    C.install = (app: App) => {
        app.component(C.name, component)
    }
    return component as T & Plugin
}
