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
import {Router} from 'vue-router'

export declare interface Cookie {
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
    del(item: string): () => void;
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        cookie: Cookie
    }
}

const cookie = {
    /**
     * use.
     * @param app 
     */
    install(app: App, prefix: string = 'mi-') {
        app.config.globalProperties.cookie = {
            /**
             * Get Cookie.
             * @param key
             * @return {string|null}
             */
            get(key: string): any {
                const name = `${prefix}${key}=`
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
                    `${prefix}${name}=${escape(value)}`,
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