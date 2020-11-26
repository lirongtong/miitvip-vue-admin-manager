import { App } from 'vue'
import { $g } from './config'

class MiTools {
    /**
     * Set title.
     * @param title
     */
    setTitle(title?: string): void {
        const powered = $g.powered ?? 'Powered by makeit.vip'
        title = $g.title ?? '中后台管理系统'
        if (title !== $g.title) $g.title = title
        document.title = `${title} - ${powered}`
    }

    /**
     * Set keywords.
     * @param keywords
     * @param overwritten
     */
    setKeywords(keywords?: string | string[], overwritten?: boolean): void {
        overwritten = overwritten !== undefined ? overwritten : false
        const k = $g.keywords
        const key = keywords ? (Array.isArray(keywords) ? keywords.join(', ') : keywords) : null
        keywords = key ? (overwritten ? key : `${k} ${key}`) : k
        const element = document.querySelector(`meta[name="keywords"]`)
        if (element) element.setAttribute('content', keywords as string)
        else this.createMeta('keywords', keywords)
    }

    /**
     * Set description.
     * @param desc
     */
    setDescription(desc?: string, overwritten?: boolean): void {
        const d = $g.description
        desc = desc ? (overwritten ? desc : `${desc} ${d}`) : d
        const description = document.querySelector(`meta[name="description"]`)
        if (description) description.setAttribute('content', desc as string)
        else this.createMeta('description', desc)
    }

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
    }

    random(): string {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    /**
     * Generate a random number within the specified range.
     * @param start
     * @param end
     * @returns {number}
     */
    randomNumberInRange(start: number, end: number): number {
        return Math.round(Math.random() * (end - start) + start)
    }

    /**
     * Generate unique string.
     * @param upper
     * @returns {string}
     */
    uid(upper = false, prefix?: string): string {
        let str = (
            this.random() +
            this.random() +
            this.random() +
            this.random() +
            this.random() +
            this.random() +
            this.random() +
            this.random()
        ).toLocaleUpperCase()
        if (prefix) str = prefix + str
        return upper ? str.toUpperCase() : str
    }

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
    }

    /**
     * Whether it is a number.
     * @param number
     */
    isNumber(number: any): boolean {
        return typeof number === 'number' && isFinite(number)
    }

    /**
     * Check the validity of the email.
     * @param email
     * @returns {boolean}
     */
    checkEmail(email: string): boolean {
        const regExp = $g.regExp
        return regExp.email.test(email)
    }

    /**
     * Check Password by rules.
     * @param password 
     */
    checkPassword(password: string): boolean {
        const regExp = $g.regExp
        return regExp.password.test(password)
    }

    /**
     * Get the password strength.
     * return a number level ( 1 - 4 ).
     * @param password 
     */
    getPasswordStrength(password: string): number {
        const reg = {
			lower: /[a-z]/,
			upper: /[A-Z]/,
			number: /[\d]/,
			character: /[~!@#$%^&*()_+=\-.,]/
		}
		let strength = 0
		if(reg.lower.test(password)) strength++
		if(reg.upper.test(password)) strength++
		if(reg.number.test(password)) strength++
		if(reg.character.test(password)) strength++
		return strength
    }

    /**
     * Whether the `element / params` is valid.
     * @param value
     */
    isValid(value: any): boolean {
        return value !== undefined && value !== null && value !== ''
    }

    /**
     * The prefix of the default class name.
     * @param suffixCls
     * @param customizePrefixCls
     */
    getPrefixCls(suffixCls: string, customizePrefixCls?: string) {
        if (customizePrefixCls) return customizePrefixCls
        return `mi-${suffixCls}`
    }

    /**
     * Trim string spaces.
     * @param str
     */
    trim(str: string): string {
        return (str || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
    }

    /**
     * Whether the element has a specified class name.
     * @param el
     * @param cls
     */
    hasClass(el: HTMLElement, cls: string): boolean {
        if (!el || !cls) return false
        if (cls.indexOf(' ') !== -1) throw new Error('class name should not contain space.')
        if (el.classList) {
            return el.classList.contains(cls)
        } else {
            return ` ${el.className} `.indexOf(` ${cls} `) > -1
        }
    }

    /**
     * Add class to the element.
     * @param el
     * @param cls
     */
    addClass(el: HTMLElement, cls: string) {
        if (!el) return
        let curCls = el.className
        const classes = (cls || '').split(' ')
        for (let i = 0, l = classes.length; i < l; i++) {
            const clsName = classes[i]
            if (!clsName) continue
            if (el.classList) {
                el.classList.add(clsName)
            } else {
                if (!this.hasClass(el, clsName)) {
                    curCls += ` ${clsName}`
                }
            }
        }
        if (!el.classList) el.className = curCls
    }

    /**
     * Delete the specified class name in the element.
     * @param el
     * @param cls
     */
    removeClass(el: HTMLElement, cls: string) {
        if (!el || !cls) return
        const classes = cls.split(' ')
        let curCls = ` ${el.className} `
        for (let i = 0, l = classes.length; i < l; i++) {
            const clsName = classes[i]
            if (!clsName) continue
            if (el.classList) {
                el.classList.remove(clsName)
            } else {
                if (this.hasClass(el, clsName)) {
                    curCls = curCls.replace(` ${clsName} `, '')
                }
            }
        }
        if (!el.classList) el.className = this.trim(curCls)
    }

    /**
     * errors.
     * @param name
     */
    importError(name: string) {
        throw new Error(
            `[${name}] must be required. Please import and install [${name}] before makeit-admin-pro\r\n`
        )
    }

    /**
     * Event binding.
     * @param element
     * @param event
     * @param listener
     * @param useCapture
     */
    on(
        element: Window | HTMLElement,
        event: keyof HTMLElementEventMap,
        listener: (
            this: HTMLDivElement,
            evt: HTMLElementEventMap[keyof HTMLElementEventMap]
        ) => any,
        useCapture = false
    ) {
        if (!!document.addEventListener) {
            if (element && event && listener) element.addEventListener(event, listener, useCapture)
        } else {
            if (element && event && listener) (element as any).attachEvent(`on${event}`, listener)
        }
    }

    /**
     * Event unbind.
     * @param element
     * @param event
     * @param listener
     * @param useCapture
     */
    off(
        element: Window | HTMLElement,
        event: keyof HTMLElementEventMap,
        listener: (
            this: HTMLDivElement,
            evt: HTMLElementEventMap[keyof HTMLElementEventMap]
        ) => any,
        useCapture = false
    ) {
        if (!!document.addEventListener) {
            if (element && event && listener)
                element.removeEventListener(event, listener, useCapture)
        } else {
            if (element && event && listener) (element as any).detachEvent(`on${event}`, listener)
        }
    }

    /**
     * Format string content.
     * @param str
     * @param formatter
     */
    formatEmpty(str?: string, formatter?: string): string {
        if (this.isEmpty(str)) return formatter ?? '-'
        return str
    }

    /**
     * Whether the string content is empty.
     * @param str
     * @param format
     */
    isEmpty(str: any, format = false): boolean | string {
        let result: any = str === null || str == '' || typeof str === 'undefined'
        if (format) result = this.formatEmpty(str)
        return result
    }
}
export const $tools: MiTools = new MiTools()
const tools = {
    install(app: App) {
        app.config.globalProperties.$tools = $tools
    }
}
export default tools
