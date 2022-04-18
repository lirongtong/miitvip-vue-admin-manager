import { App } from 'vue'
import { $g } from './global'

/**
 * storage ( 封装自 localstorage / sessionstorage )
 * note: 默认类型 localstorage
 * 
 * eg,.
 * ```
 * this.$storage.change('session').set('name', 'makeit')
 * ```
 * @class
 */
class MiStorage {
    prefix: string
    instance!: Storage

    /**
     * 构造.
     * 初始化 storage ( local / session )
     * @constructor
     * @param type 
     */
    constructor(type?: string) {
        this.prefix = $g.prefix
        this.change(type)
    }

    /**
     * 获取 storage ( get ).
     * @param keys 
     * @param prefix 
     * @returns 
     */
    get(
        keys: string | any[],
        prefix?: string
    ): any {
        let data: any = {}
        if (Array.isArray(keys)) {
            for (let i = 0, len = keys.length; i < len; i++) {
                const key = keys[i]
                const item = `${prefix ?? this.prefix}${key}`
                data[key] = JSON.parse(this.instance.getItem(item))
            }
        } else {
            data = null
            const key = `${prefix ?? this.prefix}${keys}`
            if (keys) data = JSON.parse(this.instance.getItem(key))
        }
        return data
    }

    /**
     * 设置 storage ( set ).
     * @param key 
     * @param value 
     * @param prefix 
     */
    set(
        key: string,
        value: any,
        prefix?: string
    ): void {
        const item = `${prefix ?? this.prefix}${key}`
        this.instance.setItem(item, JSON.stringify(value))
    }

    /**
     * 删除 storage ( delete ).
     * @param keys 
     * @param prefix 
     */
    del(
        keys: string | string[],
        prefix?: string
    ) {
        if (Array.isArray(keys)) {
            for (let i = 0, len = keys.length; i < len; i++) {
                const key = keys[i]
                const item = `${prefix ?? this.prefix}${key}`
                this.instance.removeItem(item)
            }
        } else {
            const item = `${this.prefix}${keys}`
            this.instance.removeItem(item)
        }
    }

    /**
     * 切换 storage ( 默认为 localStorage ).
     * change storage type.
     * 
     * @param type 
     * @returns 
     */
    change(type?: string) {
        this.instance =
            type === 'local' ? localStorage : type === 'session' ? sessionStorage : localStorage
        return this
    }
}

export const $storage = new MiStorage()
export default {
    install(app: App) {
        app.config.globalProperties.$storage = $storage
        return app
    }
}