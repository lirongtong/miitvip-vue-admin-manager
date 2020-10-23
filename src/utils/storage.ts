import { App } from 'vue'

export declare interface StorageConfig {
    get(item: string): () => any;
    set(item: string, value: any): () => void;
    del(item: string | string[]): () => void;
    change: (type?: string) => this;
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $storage: StorageConfig
    }
}

class MiStorage {

    /**
     * storage prefix.
     * @type {string}
     */
    prefix!: string

    /**
     * storage instance, including localStorage and sessionStorage.
     * @type {Storage}
     */
    instance!: Storage

    constructor(type = 'local') {
        this.prefix = (import.meta as any).env.VITE_MAKEIT_ADMIN_PREFIX ?? 'mi-'
        this.change(type)
    }

    /**
     * Get Storage.
     * The key value supports string or array.
     * @param keys
     * @return {*}
     */
    get(keys: string | any[]): any {
        let data: any = {};
        if (Array.isArray(keys)) {
            for (let i = 0, len = keys.length; i < len; i++) {
                const key = keys[i]
                const item = `${this.prefix}${key}`
                data[key] = JSON.parse(this.instance.getItem(item) as string)
            }
        } else {
            data = null
            const key = `${this.prefix}${keys}`
            if (keys) data = JSON.parse(this.instance.getItem(key) as string)
        }
        return data
    }

    /**
     * Set Storage.
     * @param key
     * @param value
     */
    set(key: string, value: any) {
        const item = `${this.prefix}${key}`
        this.instance.setItem(item, JSON.stringify(value))
    }

    /**
     * Delete Storage.
     * @param keys
     */
    del(keys: string | string[]) {
        if (Array.isArray(keys)) {
            for (let i = 0, len = keys.length; i < len; i++) {
                const key = keys[i]
                const item = `${this.prefix}${key}`
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
        this.instance = type === 'local'
            ? localStorage
            : (type === 'session' ? sessionStorage : localStorage)
        return this
    }
}
export const $storage = new MiStorage()

const storage = {
    /**
     * storage prefix.
     * @type string
     */
    prefix: (import.meta as any).env.VITE_MAKEIT_ADMIN_PREFIX,

    /**
     * storage instance, including localStorage and sessionStorage.
     * @type Storage
     */
    instance: localStorage,

    /**
     * use ( install ).
     * @param app 
     */
    install(app: App) {
        app.config.globalProperties.$storage = $storage
    }
}
export default storage