import { App } from 'vue'
import { $g } from './global'

class MiCookie {
    prefix = $g.prefix

    /**
     * 获取 cookie ( get ) .
     * @param key 
     * @param prefix 
     * @returns 
     */
    get(
        key: string,
        prefix?: string
    ): any {
        const name = `${prefix ?? this.prefix}${key}=`
        const values = document.cookie.split(';')
        const len = values.length
        for (let i = 0; i < len; i++) {
            let value = values[i]
            while (value.charAt(0) === ' ') value = value.substring(1)
            if (value.indexOf(name) !== -1) {
                return value.substring(name.length, value.length)
            }
        }
        return null
    }

    /**
     * 设置 cookie ( set ).
     * @param name 
     * @param value 
     * @param expire 
     * @param prefix 
     */
    set(
        name: string,
        value: any,
        expire?: number | null,
        prefix?: string
    ): void {
        let expires = null
        if (expire) {
            const date = new Date()
            date.setTime(date.getTime() + expire * 24 * 60 * 60 * 1000)
            expires = `expires=${date.toUTCString()}`
        }
        const params = [`${prefix ?? this.prefix}${name}=${escape(value)}`, expires, 'path=/']
        document.cookie = params.join(';')
    }

    /**
     * 删除 cookie ( delete ).
     * @param names 
     * @param prefix 
     */
    del(
        names: string | any[],
        prefix?: string
    ): void {
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

export const $cookie = new MiCookie()
export default {
    install(app: App) {
        app.config.globalProperties.$cookie = $cookie
        return app
    }
}