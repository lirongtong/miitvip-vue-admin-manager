/*
 * +-------------------------------------------+
 * |                  MIITVIP                  |
 * +-------------------------------------------+
 * | Copyright (c) 2020 makeit.vip             |
 * +-------------------------------------------+
 * | Author: makeit <lirongtong@hotmail.com>   |
 * | Homepage: https://www.makeit.vip          |
 * | Github: https://github.com/lirongtong     |
 * | Date: 2020-5-27 14:08                     |
 * +-------------------------------------------+
 */
import { App } from 'vue'

export declare interface MiStorage {
    /**
     * get cookie.
     * @param item 
     */
    get(item: string): () => any;

    /**
     * set cookie.
     * @param item 
     * @param value 
     */
    set(item: string, value: any): () => void;

    /**
     * del cookie.
     * @param item 
     */
    del(item: string | string[]): () => void;

    /**
     * change type.
     * @param type 
     */
    change: (type?: string) => this;
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        storage: MiStorage
    }
}

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
    install(app: App, type = 'local', prefix?: string) {
        if (type === 'session') storage.instance = sessionStorage
        if (prefix) storage.prefix = prefix
        app.config.globalProperties.storage = {
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
                        const item = `${storage.prefix}${key}`
                        data[key] = JSON.parse(storage.instance.getItem(item) as string)
                    }
                } else {
                    data = null
                    const key = `${storage.prefix}${keys}`
                    if (keys) data = JSON.parse(storage.instance.getItem(key) as string)
                }
                return data
            },

            /**
             * Set Storage.
             * @param key
             * @param value
             */
            set(key: string, value: any) {
                const item = `${storage.prefix}${key}`;
                storage.instance.setItem(item, JSON.stringify(value));
            },
            
            /**
             * Delete Storage.
             * @param keys
             */
            del(keys: string | string[]) {
                if (Array.isArray(keys)) {
                    for (let i = 0, len = keys.length; i < len; i++) {
                        const key = keys[i],
                            item = `${storage.prefix}${key}`;
                            storage.instance.removeItem(item);
                    }
                } else {
                    const item = `${storage.prefix}${keys}`;
                    storage.instance.removeItem(item);
                }
            },

            /**
             * Change storage type.
             * @param type 
             */
            change(type?: string) {
                storage.instance = type === 'local'
                    ? localStorage
                    : (type === 'session' ? sessionStorage : localStorage)
                return this
            }
        }
    }
}
export default storage