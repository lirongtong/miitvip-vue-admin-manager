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
        return window.requestAnimationFrame(callback) ||
            window.setTimeout(callback, 1000 / 60)
    }

    /**
     * cancelAnimationFrame.
     * @param rid 
     */
    caf(rid: number) {
        window.cancelAnimationFrame(rid)
    }
}

export const $tools: MiTools = new MiTools()

export default {
    install(app: App) {
        app.config.globalProperties.$tools = $tools
        return app
    }
}
