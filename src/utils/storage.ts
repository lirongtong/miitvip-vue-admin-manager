import type { App } from 'vue'
import { $g } from './global'

class MiStorage {
    prefix: string = $g?.prefix || 'mi-'
    instance!: Storage

    constructor(type?: string) {
        this.change(type)
    }

    getKey(key: string, prefix?: string): string {
        return `${prefix ?? this.prefix}${key}`
    }

    /**
     * get
     * @param keys
     * @param prefix
     * @returns
     */
    get(keys: string | string[], prefix?: string): any {
        let data: { [index: string]: any } | null = {}
        if (Array.isArray(keys)) {
            for (let i = 0, len = keys.length; i < len; i++) {
                const key = keys[i]
                data[key] = JSON.parse(
                    this.instance.getItem(this.getKey(key, prefix)) as string
                ) as any
            }
        } else {
            data = null
            if (keys) {
                data = JSON.parse(this.instance.getItem(this.getKey(keys, prefix)) as string) as any
            }
        }
        return data
    }

    /**
     * set
     * @param key
     * @param value
     * @param prefix
     */
    set(key: string, value: any, prefix?: string): void {
        this.instance.setItem(this.getKey(key, prefix), JSON.stringify(value))
    }

    /**
     * delete
     * @param keys
     * @param prefix
     */
    del(keys: string | string[], prefix?: string) {
        if (Array.isArray(keys)) {
            for (let i = 0, len = keys.length; i < len; i++) {
                const key = keys[i]
                this.instance.removeItem(this.getKey(key, prefix))
            }
        } else this.instance.removeItem(this.getKey(keys, prefix))
    }

    /**
     * change ( default: localStorage )
     * @param type
     * @returns
     */
    change(type?: string): MiStorage {
        if (typeof window !== 'undefined') {
            this.instance =
                type === 'local' ? localStorage : type === 'session' ? sessionStorage : localStorage
        }
        return this
    }
}

/**
 * 本地存储 ( `localStorage & sessionStorage` )
 *  - default: `localStorage`
 *
 * e.g.
 * ```
 * this.$storage.get('name')
 * this.$storage.set('name', 'value')
 * this.$storage.change('session').set('name', 'value')
 * ```
 */
export const $storage: MiStorage = new MiStorage()
export default {
    install(app: App) {
        app.config.globalProperties.$storage = $storage
        return app
    }
}
