import { App } from 'vue'
import { config } from './config'

class MiCookie {
    prefix = config.prefix

    /**
     * Get Cookie.
     * @param key
     * @param prefix
     * @return {string|null}
     */
    get(key: string, prefix?: string): any {
        const name = `${prefix ?? this.prefix}${key}=`
        const values = document.cookie.split(';')
        for (let i = 0, len = values.length; i < len; i++) {
            let value = values[i]
            while (value.charAt(0) === ' ') value = value.substring(1)
            if (value.indexOf(name) !== -1) {
                return value.substring(name.length, value.length)
            }
        }
        return null
    }

    /**
     * Set Cookie.
     * @param name
     * @param value
     * @param expire
     */
    set(
        name: string,
        value: any,
        expire: number | null,
        prefix?: string
    ): void {
        let expires = null
        if (expire) {
            const date = new Date()
            date.setTime(date.getTime() + (expire * 24 * 60 * 60 * 1000))
            expires = `expires=${date.toUTCString()}`
        }
        const params = [
            `${prefix ?? this.prefix}${name}=${escape(value)}`,
            expires,
            'path=/'
        ]
        document.cookie = params.join(';')
    }

    /**
     * Delete Cookie.
     * @param names
     */
    del(names: string | any[], prefix?: string): void {
        if (Array.isArray(names)) {
            for (let i = 0, len = names.length; i < len; i++) {
                const name = names[i]
                if (name) this.set(name, '', -1)
            }
        } else {
            this.set(names, '', -1, prefix)
        }
    }
}

export const $MCookie = new MiCookie()
const cookie = {
    install(app: App) {
        app.config.globalProperties.$MCookie = $MCookie
    }
}
export default cookie