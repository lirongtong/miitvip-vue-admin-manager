import { App } from 'vue'
import { config } from './config'

export class Links {
    login = 'login';
	logout = 'logout';
	register = 'register';
	refresh = 'oauth/refresh';
	captcha = {
		init: 'captcha/init',
		verification: 'captcha/verification'
	}
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        api: Links
    }
}

class Api {
    _version?: string = config.apiVersion
    _api: {[index: string]: any} = {}

    constructor() {
        Object.defineProperty(this, 'version', {
            get(): any {
				return this._version
			},
			set(v: string) {
				this._version = v.trim();
				this.parse()
			}
        })

        const links = new Links()
		const keys = Object.keys(links)
		const values = Object.values(links)
		for (let i = 0, len = keys.length; i < len; i++) {
			this._api[keys[i]] = values[i]
		}
		this.parse()
    }

    parse(api?: {[index: string]: any}): void {
        api = api ?? this._api
        for (const i in api) {
            if (Object.prototype.hasOwnProperty.call(api, i)) {
                if (typeof api[i] === 'object' && Object.keys(api[i]).length > 0) {
					this.parse(api[i]);
				} else {
                    const reg = config.regExp.url
                    if (!reg.rest(api[i])) {
                        if (this._version && api[i].indexOf(`${this._version}/`) === -1)
                            api[i] = `${this._version}/${api[i]}`
                    }
                }
            }
        }
    }
}
export const $api = new Api()

const api = {
    install(app: App) {
        app.config.globalProperties.api = $api
    }
}
export default api