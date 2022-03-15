import { App, Plugin } from 'vue'

export const install = <T>(component: T, alias?: string) => {
    const comp = component as any
    comp.install = (app: App) => {
        app.component(comp.name, comp)
        if (alias) app.config.globalProperties[alias] = comp
    }
    return comp as T & Plugin
}
