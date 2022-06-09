import { App } from 'vue'
import { $g } from './global'

class MiTools {
    /**
     * 创建 meta 标签 ( Create meta element ).
     * @param name
     * @param content
     */
    createMeta(name: string, content: string): void {
        const head = document.getElementsByTagName('head')
        const meta = document.createElement('meta')
        meta.name = name.trim()
        meta.content = content.trim()
        if (head) head[0].appendChild(meta)
    }

    /**
     * 设置标题.
     * @param title
     */
    setTitle(title?: string): void {
        const powered = $g.powered ?? `powered by makeit.vip`
        title = $g.title ?? 'Makeit Admin Pro'
        if (title !== $g.title) $g.title = title
        document.title = `${title} - ${powered}`
    }

    /**
     * 设置关键词.
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
     * 设置描述.
     * @param desc
     * @param overwritten
     */
    setDescription(desc?: string, overwritten?: boolean): void {
        const d = $g.description
        desc = desc ? (overwritten ? desc : `${desc} ${d}`) : d
        const description = document.querySelector(`meta[name="description"]`)
        if (description) description.setAttribute('content', desc as string)
        else this.createMeta('description', desc)
    }

    /**
     * 是否为移动端.
     * 注: iPad Safari 获取的 ua 与 Mac Safari 一致, 需独立判断.
     * @returns
     */
    isMobile(): boolean {
        const ua = navigator.userAgent
        const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
        const isSafari = ua.indexOf('Safari') !== -1 && ua.indexOf('Version') !== -1
        const isIPhone = ua.indexOf('iPhone') !== -1 && ua.indexOf('Version') !== -1
        const isIPad = isSafari && !isIPhone && 'ontouchend' in document
        let mobile = false
        if (isIPad) {
            mobile = true
        } else {
            for (let i = 0, len = agents.length; i < len; i++) {
                if (ua.indexOf(agents[i]) > 0) {
                    mobile = true
                    break
                }
            }
        }
        return mobile
    }

    /**
     * Whether the `element / params` is valid.
     * @param value
     */
    isValid(value: any): boolean {
        return value !== undefined && value !== null && value !== ''
    }

    /**
     * random.
     * @returns {string}
     */
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
     * Unit conversion.
     * @param value
     * @param base
     */
    px2Rem(value: number, base = 16) {
        return Math.round((value / base) * 100) / 100
    }

    /**
     * requestAnimationFrame.
     * @param callback
     * @returns
     */
    raf(callback: FrameRequestCallback) {
        return window.requestAnimationFrame(callback) || window.setTimeout(callback, 1000 / 60)
    }

    /**
     * cancelAnimationFrame.
     * @param rid
     */
    caf(rid: number) {
        window.cancelAnimationFrame(rid)
    }

    /**
     * scroll to top ( animation ).
     * @param el
     * @param from
     * @param to
     * @param duration
     * @param endCallback
     */
    scrollTop(el: any, from = 0, to: number, duration = 800, endCallback?: Function) {
        const difference = Math.abs(from - to)
        const step = Math.ceil((difference / duration) * 50)
        let rid: number
        function scroll(start: number, end: number, step: number) {
            if (start === end) {
                if (rid) this.caf(rid)
                endCallback && endCallback()
                return
            }
            let d = start + step > end ? end : start + step
            if (start > end) d = start - step < end ? end : start - step
            if (el === window) window.scrollTo(d, d)
            else el.scrollTop = d
            rid = this.raf(() => scroll(d, end, step))
        }
        scroll(from, to, step)
    }

    /**
     * back to top.
     * @param offset
     * @param duration
     */
    back2top(offset = 0, duration = 1000) {
        const top = offset ?? (document.documentElement.scrollTop || document.body.scrollTop)
        this.scrollTop(document.body, top, 0, duration)
    }

    /**
     * add event listener.
     * @param el
     * @param event
     * @param listener
     * @param useCapture
     */
    on(
        el: Window | HTMLElement,
        event: keyof HTMLElementEventMap,
        listener: (this: HTMLElement, evt: HTMLElementEventMap[keyof HTMLElementEventMap]) => any,
        useCapture: false
    ) {
        if (!!document.addEventListener) {
            if (el && event && listener) el.addEventListener(event, listener, useCapture)
        } else {
            if (el && event && listener) (el as any).attachEvent(`on${event}`, listener)
        }
    }

    /**
     * remove event listener.
     * @param el
     * @param event
     * @param listener
     * @param useCapture
     */
    off(
        el: Window | HTMLElement,
        event: keyof HTMLElementEventMap,
        listener: (this: HTMLElement, evt: HTMLElementEventMap[keyof HTMLElementEventMap]) => any,
        useCapture: false
    ) {
        if (!!document.addEventListener) {
            if (el && event && listener) el.removeEventListener(event, listener, useCapture)
        } else {
            if (el && event && listener) (el as any).detachEvent(`on${event}`, listener)
        }
    }

    /**
     * transfer.
     * @param html
     * @returns
     */
    htmlEncode(html: string) {
        let temp = document.createElement('div') as HTMLDivElement
        temp.textContent !== null ? (temp.textContent = html) : (temp.innerText = html)
        const output = temp.innerHTML
        temp = null
        return output
    }
}

export const $tools: MiTools = new MiTools()

export default {
    install(app: App) {
        app.config.globalProperties.$tools = $tools
        return app
    }
}
