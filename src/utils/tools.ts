import { App } from 'vue'
import { $g } from './config'
import { $cookie } from './cookie'

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
        return upper ? str.toUpperCase() : str.toLowerCase()
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
        if (reg.lower.test(password)) strength++
        if (reg.upper.test(password)) strength++
        if (reg.number.test(password)) strength++
        if (reg.character.test(password)) strength++
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

    /**
     * parsing url parameters.
     * @param url 
     * @param params 
     */
    parseUrl(url: string, params: {}) {
        if (Object.keys(params).length > 0) {
            for (const i in params) {
                if (params.hasOwnProperty(i)) {
                    const reg = new RegExp('\{' + i + '\}', 'gi')
                    url = url.replace(reg, params[i])
                }
            }
        }
        return url
    }

    /**
     * Scroll to top.
     * @param el 
     * @param from 
     * @param to 
     * @param duration 
     * @param endCallback 
     */
    scrollTop(
        el: any,
        from = 0,
        to: number,
        duration = 500,
        endCallback?: any
    ) {
        if (!window.requestAnimationFrame) {
            const w = window as any
            w.requestAnimationFrame = (
                w.webkitRequestAnimationFrame ||
                w.mozRequestAnimationFrame ||
                w.msRequestAnimationFrame ||
                function(callback: any) {
                    return w.setTimeout(callback, 1000 / 60);
                }
            )
        }
        const difference = Math.abs(from - to)
        const step = Math.ceil(difference / duration * 50)
        function scroll(
            start: number,
            end: number,
            step: number
        ) {
            if (start === end) {
                endCallback && endCallback()
                return
            }
            let d = (start + step > end) ? end : start + step
            if (start > end) d = (start - step < end) ? end : start - step
            if (el === window) window.scrollTo(d, d)
            else el.scrollTop = d
            window.requestAnimationFrame(() => scroll(d, end, step))
        }
        scroll(from, to, step)
    }

    /**
     * Back to top ( default `document.body` ).
     * @param offset 
     * @param time 
     */
    backtoTop(offset = 0, time = 1000) {
        const top = this.isEmpty(offset)
            ? document.documentElement.scrollTop || document.body.scrollTop
            : offset
        this.scrollTop(document.body, top, 0, this.isEmpty(time) ? 1000 : time)
    }

    /**
     * Gets the actual height of the element from the top of the document.
     * @param el 
     */
    getElementTop (el: HTMLElement) {
        let actualTop = el.offsetTop
        let current = el.offsetParent as HTMLElement
        while (current !== null) {
            actualTop += current.offsetTop
            current = current.offsetParent as HTMLElement
        }
        return actualTop
    }

    /**
     * The theme of light-fresh.
     * @param theme 
     */
    setThemeVariables(theme = 'dark') {
        const id = `${$g.prefix}theme-variables`
        const last = document.getElementById(id)
        if (last) last.remove()
        let variables: any
        if (theme === 'light') {
            variables = this.parseVariables(`@mi-theme-color: #2F9688;
                @mi-body-color: #f5f7f9;
                @mi-header-bg-color: #2F9688;
                @mi-header-logo-bg-color: #226a62;
                @mi-header-logo-text-color: #ffffff;
                @mi-header-logo-border-bottom-color: #ffffff;
                @mi-header-trigger-hover-color: rgba(0, 0, 0, 0.1);
                @mi-header-paletter-item-border-color: #e1e1e1;
                @mi-breadcrumb-last-child-color: #999;
                @mi-table-color: #e4e4e4;
                @mi-table-text-color: #333;
                @mi-table-td-color: #ffffff;
                @mi-table-td-hover-color: #ffffff;
                @mi-table-border-color: #f1f1f1;
                @mi-sider-color: #fff;
                @mi-sider-shadow-color: rgba(175, 175, 175, 0.35);
                @mi-sider-border-color: #4c4c4c;
                @mi-menu-color: #666;
                @mi-menu-active-color: rgba(47, 150, 136, .2);
                @mi-menu-sub-color: #909090;
                @mi-menu-active-sub-color: rgba(47, 150, 136, .6);
                @mi-history-bg-color: #dedede;
                @mi-history-item-bg-color: #fff;
                @mi-history-item-text-color: #666;
                @mi-dropdown-bg-color: #fff;
                @mi-dropdown-text-color: #666;
                @mi-dropdown-item-hover-color: rgba(47, 150, 136, .2);
                @mi-modal-bg-color: #fff;
                @mi-modal-text-color: #333;
                @mi-modal-content-color: rgba(51, 51, 51, 0.85);
                @mi-modal-border-inline-color: #f3f3f3;
                @mi-modal-shadow-color: rgba(47, 150, 136, 0.15);
                @mi-modal-btn-primary-color: #ffffff;
                @mi-passport-color: #ffffff;
                @mi-passport-line-color: #3f3f3f;
                @mi-passport-bg-color: #212121;
                @mi-passport-icon-color: #9F9F9F;
                @mi-passport-text-color: #333;
                @mi-passport-strength-color: #999;
                @mi-passport-mask-bg-color: #ffffff;
                @mi-passport-remember-color: #ffffff;
                @mi-passport-submit-color: #ffffff;
                @mi-passport-submit-gradual-start-color: #000000;
                @mi-passport-submit-gradual-end-color: #2F9688;
                @mi-tab-nav-color: #999;
                @mi-tab-nav-border-bottom-color: rgba(162, 162, 162, 0.15);
                @mi-selection-color: #ffffff;
                @mi-selection-bg-color: #dedede;
                @mi-card-tab-color: #333;
                @mi-popover-bg-color: #ffffff;
                @mi-notice-title-color: #000000;
                @mi-notice-text-color: #666;
                @mi-notice-time-color: #b6b6b6;
                @mi-notice-content-color: rgba(0, 0, 0, 0.6);
                @mi-content-text-color: #333;
                @mi-footer-color: #666;
                @mi-radio-text-color: #333;
                @mi-btn-default-color: #666;
                @mi-btn-defaul-bg-color: #ffffff;
                @mi-btn-defaul-border-color: #e3e3e3;
                @mi-btn-ghost-border-color: #b5b5b5;
                @mi-btn-ghost-text-color: #666;
                @mi-subsidiary-color: #808695;
                @mi-form-label-color: #999;
                @mi-error-color: #ed4014;
                @mi-danger-color: #ff4d4f;
                @mi-success-color: #2F9688;
                @mi-warning-color: #ff9900;
                @mi-info-color: #2db7f5;
                @mi-font-color: #fff;
                @mi-link-color: #2F9688;
                @mi-primary-color: #2F9688;
                @mi-captcha-bg-color: #636363;`)
            const style = document.createElement('style') as any
            style.id = id
            style.setAttribute('type', 'text/css')
            if (style.styleSheet) {
                style.styleSheet.cssText = `
:root {
    ${variables.join(';')}
}
                `
            } else {
                const content = document.createTextNode(`
:root {
    ${variables.join(';')}
}
                `)
                style.appendChild(content)
            }
            document.head.appendChild(style)
        }
        if (theme === 'dark' || theme === 'light') {
            $g.theme = theme
            $cookie.set($g.caches.cookies.theme, $g.theme)
        }
    }

    private parseVariables(variables: string): string[] {
        const arr = this.trim(variables).split(';')
        if (arr.length > 0) {
            for (let i = 0, l = arr.length; i < l; i++) {
                const item = this.trim(arr[i]).split(':')
                if (item && item.length === 2) {
                    const name = this.trim(item[0]).replace('@', '--')
                    arr[i] = this.trim(`${name}:${this.trim(item[1])}`)
                }
            }
        }
        return arr
    }
}
export const $tools: MiTools = new MiTools()
const tools = {
    install(app: App) {
        app.config.globalProperties.$tools = $tools
    }
}
export default tools
