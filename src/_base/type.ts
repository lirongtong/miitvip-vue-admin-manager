import { App, Plugin } from 'vue'

export const install = <T>(component: T) => {
    const c = component as any
    c.install = function(app: App) {
        app.component(c.displayName || c.name, component)
    }
    return component as T & Plugin
}