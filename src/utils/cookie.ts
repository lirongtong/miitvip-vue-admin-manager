/*
 * +-------------------------------------------+
 * |                  MIITVIP                  |
 * +-------------------------------------------+
 * | Copyright (c) 2020 makeit.vip             |
 * +-------------------------------------------+
 * | Author: makeit <lirongtong@hotmail.com>   |
 * | Homepage: https://www.makeit.vip          |
 * | Github: https://github.com/lirongtong     |
 * | Date: 2020-5-27 11:21                     |
 * +-------------------------------------------+
 */
import { App } from 'vue'
const cookie = {
    /**
     * use.
     * @param app 
     */
    install(app: App) {
        app.config.globalProperties.cookie = {
            /**
             * Get Cookie.
             * @param key
             * @return {string|null}
             */
            get(key: string): any {
                const name = `${(import.meta as any).env.VITE_MAKEIT_ADMIN_PREFIX}${key}=`
                const values = document.cookie.split(';')
                for (let i = 0, len = values.length; i < len; i++) {
                    let value = values[i]
                    while (value.charAt(0) === ' ') value = value.substring(1)
                    if (value.indexOf(name) !== -1) {
                        return value.substring(name.length, value.length)
                    }
                }
                return null
            },
            /**
             * Set Cookie.
             * @param name
             * @param value
             * @param expire
             */
            set(name: string, value: any, expire: number | null): void {
                let expires
                if (expire) {
                    const date = new Date()
                    date.setTime(date.getTime() + (expire * 24 * 60 * 60 * 1000))
                    expires = `expires=${date.toUTCString()}`
                }
                const params = [
                    `${(import.meta as any).env.VITE_MAKEIT_ADMIN_PREFIX}${name}=${escape(value)}`,
                    expires,
                    'path=/'
                ]
                document.cookie = params.join(';')
            },
            
            /**
             * Delete Cookie.
             * @param names
             */
            del(names: string | any[]): void {
                if (Array.isArray(names)) {
                    for (let i = 0, len = names.length; i < len; i++) {
                        const name = names[i]
                        if (name) this.set(name, '', -1)
                    }
                } else {
                    this.set(names, '', -1)
                }
            }
        }
    }
}
export default cookie