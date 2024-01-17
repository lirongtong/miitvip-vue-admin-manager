import type { App } from 'vue'
import { $g } from './global'

class MiCookie {
    prefix: string = $g?.prefix || 'mi-'

    /**
     * 获取 cookie 名称
     * @param key
     * @param prefix
     * @returns
     */
    getName(key: string, prefix?: string) {
        return `${prefix ?? this.prefix}${key}=`
    }

    /**
     * 获取 cookie
     * @param key
     * @param prefix
     * @returns
     */
    get(key: string, prefix?: string): any {
        const name = this.getName(key, prefix)
        const values = document.cookie.split(';')
        const len = values.length
        for (let i = 0; i < len; i++) {
            let value = decodeURIComponent(values[i])
            while (value.charAt(0) === ' ') value = value.substring(1)
            if (value.indexOf(name) !== -1) {
                return value.substring(name.length, value.length)
            }
        }
        return null
    }

    /**
     * 设置 cookie
     * @param name
     * @param value
     * @param expire
     * @param prefix
     */
    set(name: string, value: any, expire?: number | null, prefix?: string): void {
        let expires: string | null = null
        if (expire) {
            const date = new Date()
            date.setTime(date.getTime() + expire * 24 * 60 * 60 * 1000)
            expires = `expires=${date.toUTCString()}`
        }
        const params = [
            `${this.getName(name, prefix)}${encodeURIComponent(value)}`,
            expires,
            'path=/'
        ]
        document.cookie = params.join(';')
    }

    /**
     * 删除 cookie
     * @param names
     * @param prefix
     */
    del(names: string | any[], prefix?: string): void {
        if (Array.isArray(names)) {
            const len = names.length
            for (let i = 0; i < len; i++) {
                const name = names[i]
                if (name) this.set(name, '', -1, prefix)
            }
        } else {
            this.set(names, '', -1, prefix)
        }
    }
}

/**
 * Cookie 缓存 ( `document.cookie` )
 *
 * e.g.
 * ```
 * this.$cookie.get('key')
 * this.$cookie.set('key', 'value')
 * ```
 */
export const $cookie: MiCookie = new MiCookie()
export default {
    install(app: App) {
        app.config.globalProperties.$cookie = $cookie
        return app
    }
}
