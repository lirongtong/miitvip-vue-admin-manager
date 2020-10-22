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
const storage = {
    /**
     * use.
     * @param app 
     */
    install(app: App) {
        app.config.globalProperties.storage = {
            /**
             * Get Storage.
             * @param keys
             * @return {*}
             */
            get(keys: string | any[]): any {
                let data: any = {};
                if (Array.isArray(keys)) {
                    for (let i = 0, len = keys.length; i < len; i++) {
                        const key = keys[i]
                        const item = `${(import.meta as any).env.VITE_MAKEIT_ADMIN_PREFIX}${key}`
                        data[key] = JSON.parse(localStorage.getItem(item) as string)
                    }
                } else {
                    data = null
                    const key = `${(import.meta as any).env.VITE_MAKEIT_ADMIN_PREFIX}${keys}`
                    if (keys) data = JSON.parse(localStorage.getItem(key) as string)
                }
                return data
            },

            /**
             * Set Storage.
             * @param key
             * @param value
             */
            set(key: string, value: any) {
                const item = `${(import.meta as any).env.VITE_MAKEIT_ADMIN_PREFIX}${key}`;
                localStorage.setItem(item, JSON.stringify(value));
            },
            
            /**
             * Delete Storage.
             * @param keys
             */
            del(keys: string | string[]) {
                if (Array.isArray(keys)) {
                    for (let i = 0, len = keys.length; i < len; i++) {
                        const key = keys[i],
                            item = `${(import.meta as any).env.VITE_MAKEIT_ADMIN_PREFIX}${key}`;
                        localStorage.removeItem(item);
                    }
                } else {
                    const item = `${(import.meta as any).env.VITE_MAKEIT_ADMIN_PREFIX}${keys}`;
                    localStorage.removeItem(item);
                }
            }
        }
    }
}
export default storage