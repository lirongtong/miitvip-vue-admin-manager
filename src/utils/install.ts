import type { App, Plugin } from 'vue'
import Basic, { __tree_shaking_basic__ } from './basic'

/**
 * 通用组件安装方法
 * @desc common installation function
 * @param component 组件
 * @param alias 别名
 * @returns
 */
export const install = <T>(component: T, alias?: string) => {
    const comp = component as any
    comp.install = (app: App) => {
        if (!__tree_shaking_basic__) app.use(Basic)
        if (typeof app.component(comp.name) === 'undefined') app.component(comp.name, component)
        if (alias) app.config.globalProperties[alias] = comp
    }
    return comp as T & Plugin
}
