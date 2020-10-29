import { App } from 'vue'

export declare interface Tools {
    getGlobalProperties(name?: string): () => any;
    setGlobalProperties(item: string, key: string, value: any): () => void;
    setTitle(title?: string): () => void;
    setKeywords(keywords?: string | string[], overwritten?: boolean): () => void;
    setDescription(desc?: string, overwritten?: boolean): () => void;
    randomNumberInRange(start: number, end: number): () => number;
    uid(upper: boolean): () => string;
    isMobile: () => boolean;
    isNumber(number: any): () => boolean;
    checkEmail(email: string): () => boolean;
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $tools: Tools
    }
}

const tools = {
    install(app: App) {
        app.config.globalProperties.$tools = {

            /**
             * Get global properties.
             * @param name 
             */
            getGlobalProperties(name?: string): any {
                const properties = app.config.globalProperties
                return name ? (properties[name] ?? {}) : properties
            },

            /**
             * Set global properties.
             * @param item 
             * @param key 
             * @param value 
             */
            setGlobalProperties(item: string, key: string, value: any): void {
                if (!app.config.globalProperties[item]) app.config.globalProperties[item] = {}
                app.config.globalProperties[item][key] = value
            },

            /**
             * Set title.
             * @param title 
             */
            setTitle(title?: string): void {
                const config = this.getGlobalProperties('G')
                const powered = this.powered ?? 'Powered by makeit.vip'
                title = config.title ?? '后台管理系统 UI 框架'
                if (title !== config.title) this.setGlobalProperties('G', 'title', title)
                document.title = `${title} - ${powered}`
            },

            /**
             * Set keywords.
             * @param keywords 
             * @param overwritten 
             */
            setKeywords(keywords?: string | string[], overwritten?: boolean): void {
                overwritten = overwritten !== undefined ? overwritten : false
                const k = app.config.globalProperties.G.keywords
                const key = keywords ? (Array.isArray(keywords) ? keywords.join(', ') : keywords) : null
                keywords = key ? (overwritten ? key : `${k} ${key}`) : k
                const element = document.querySelector(`meta[name="keywords"]`)
                if (element) element.setAttribute('content', keywords as string)
                else this.createMeta('keywords', keywords)
            },

            /**
             * Set description.
             * @param desc 
             */
            setDescription(desc?: string, overwritten?: boolean): void {
                const d = app.config.globalProperties.G.description
                desc = desc ? (overwritten ? desc : `${desc} ${d}`) : d
                const description = document.querySelector(`meta[name="description"]`)
                if (description) description.setAttribute('content', desc as string)
                else this.createMeta('description', desc)
            },

            /**
             * Create meta element.
             * @param name 
             * @param content 
             */
            createMeta(name: string, content: string): void {
                const head = document.getElementsByTagName('head'),
                    meta = document.createElement('meta')
                meta.name = name.trim()
                meta.content = content.trim()
                if (head) head[0].appendChild(meta)
            },

            random(): string {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
            },

            /**
             * Generate a random number within the specified range.
             * @param start 
             * @param end 
             * @returns {number}
             */
            randomNumberInRange(start: number, end: number): number {
                return Math.round(Math.random() * (end - start) + start)
            },

            /**
             * Generate unique string.
             * @param upper 
             * @returns {string}
             */
            uid(upper = false): string {
                const str = (this.random() + this.random() + this.random() + this.random() + this.random() + this.random() + this.random() + this.random()).toLocaleUpperCase()
                return upper ? str.toUpperCase() : str
            },

            /**
             * Whether it is a mobile phone.
             * @returns {boolean}
             */
            isMobile(): boolean {
                const agent = navigator.userAgent,
                    agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
                let mobile = false
                for (let i = 0, len = agents.length; i < len; i++) {
                    if (agent.indexOf(agents[i]) > 0) {
                        mobile = true
                        break
                    }
                }
                return mobile
            },

            /**
             * Whether it is a number.
             * @param number 
             */
            isNumber(number: any): boolean {
                return typeof number === 'number' && isFinite(number);
            },

            /**
             * Check the validity of the email.
             * @param email 
             * @returns {boolean}
             */
            checkEmail(email: string): boolean {
                const G = this.getGlobalProperties('G')
                const regExp = G.regExp
                return regExp.emial.test(email)
            }
        }
    }
}
export default tools