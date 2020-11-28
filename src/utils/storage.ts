import { App } from 'vue'
import { $g } from './config'

class MiStorage {
    /**
     * storage prefix.
     * @type {string}
     */
    prefix: string

    /**
     * storage instance, including localStorage and sessionStorage.
     * @type {Storage}
     */
    instance!: Storage

    constructor(type?: string) {
        this.prefix = $g.prefix
        this.change(type)
    }

    /**
     * Get Storage.
     * The key value supports string or array.
     * @param keys
     * @param prefix
     * @return {*}
     */
    get(keys: string | any[], prefix?: string): any {
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
     * Set Storage.
     * @param key
     * @param value
     * @param prefix
     */
    set(key: string, value: any, prefix?: string): void {
        const item = `${prefix ?? this.prefix}${key}`
        this.instance.setItem(item, JSON.stringify(value))
    }

    /**
     * Delete Storage.
     * @param keys
     */
    del(keys: string | string[], prefix?: string) {
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
     * Change storage type.
     * @param type
     */
    change(type?: string) {
        this.instance =
            type === 'local' ? localStorage : type === 'session' ? sessionStorage : localStorage
        return this
    }
}

export const $storage = new MiStorage()
const storage = {
    install(app: App) {
        app.config.globalProperties.$storage = $storage
        return app
    }
}
export default storage
