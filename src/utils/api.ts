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
    version: string
    api: {[index: string]: any}

    constructor() {
        this.version = config.apiVersion
        this.api = new Proxy({}, {
            get: (
                target: {[index: string]: any},
                name: string
            ) => {
                return name in target ? target[name] : 'No Prop'
            },
            set: (
                target: {[index: string]: any},
                name: string,
                value: any
            ) => {
                target[name] = value
                return true
            }
        })

        const links = new Links()
		const keys = Object.keys(links)
		const values = Object.values(links)
		for (let i = 0, len = keys.length; i < len; i++) {
			this.api[keys[i]] = values[i]
        }
        this.parse()
    }

    /**
     * Parse the api.
     * Put the version number in front of each link.
     * You can also modify the version number through `this.api.version = 'v2'`
     * @param api 
     */
    parse(api?: {[index: string]: any}) {
        api = api ?? this.api
        for (const i in api) {
            if (Object.prototype.hasOwnProperty.call(api, i)) {
                if (
                    typeof api[i] === 'object' &&
                    Object.keys(api[i]).length > 0
                ) {
                    this.parse(api[i])
                } else {
                    const reg = config.regExp.url
                    if (
                        !reg.test(api[i]) &&
                        this.version
                    ) {
                        api[i] = api[i].indexOf(`${this.version}/`) !== -1
                            ? api[i]
                            : `${this.version}/${api[i]}`
                    }
                }
            }
        }
    }
}
export const $api = new Api()
export default {
    install(app: App) {
        app.config.globalProperties.api = $api.api
    }
}