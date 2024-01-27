import type { App } from 'vue'
import { $g } from './global'
import { DeviceSize } from './types'
import {
    argbFromHex,
    themeFromSourceColor,
    hexFromArgb,
    type Scheme
} from '@material/material-color-utilities'
import { theme as AntdvTheme } from 'ant-design-vue'

class MiTools {
    /**
     * 创建 meta 标签.
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
     * 创建 style 标签并写入 css variables
     * @param tokens
     * @param id
     */
    createCssVariablesElement(tokens: string[], id?: string) {
        if (tokens.length > 0) {
            id = id ?? `${$g.prefix}common-css-variables`
            const oldStyle = document.querySelector(`#${id}`)
            if (oldStyle) oldStyle.remove()
            const style = document.createElement('style')
            style.setAttribute('id', id)
            style.textContent = `:root {${tokens.join('')}}`
            const head = document.head || document.getElementsByTagName('head')[0]
            const first = head.firstChild
            head.insertBefore(style, first)
        }
    }

    /**
     * 设置标题.
     * @param title
     */
    setTitle(title?: string): void {
        const powered = $g.powered || `Powered By makeit.vip`
        title = title ?? $g.title ?? 'Makeit Admin Pro'
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
        const k = $g?.keywords || ''
        const key = keywords ? (Array.isArray(keywords) ? keywords.join(', ') : keywords) : null
        const content = (key ? (overwritten ? key : `${k} ${key}`) : k) as string
        const element = document.querySelector(`meta[name="keywords"]`)
        if (element) element.setAttribute('content', content)
        else this.createMeta('keywords', content)
    }

    /**
     * 设置描述内容.
     * @param desc
     * @param overwritten
     */
    setDescription(desc?: string, overwritten?: boolean): void {
        const d = $g?.description || ''
        desc = desc ? (overwritten ? desc : `${desc} ${d}`) : d
        const description = document.querySelector(`meta[name="description"]`)
        if (description) description.setAttribute('content', desc as string)
        else this.createMeta('description', desc)
    }

    /**
     * 设置全局变量 - 窗口大小
     * @param width
     * @param height
     */
    setWinSize(width?: number, height?: number) {
        if (typeof window !== 'undefined') {
            if (!$g.winSize) $g.winSize = {}
            $g.winSize.width = width ?? window.innerWidth
            $g.winSize.height = height ?? window.innerHeight
        }
    }

    /**
     * 判断是否为空
     * @param str
     * @param format
     * @returns
     */
    isEmpty(str: any, format = false): boolean | string {
        let result: any = str === null || str == '' || typeof str === 'undefined'
        if (format) result = this.formatEmpty(str)
        return result
    }

    /**
     * 是否有效
     * @param value
     * @returns
     */
    isValid(value: any): boolean {
        return value !== undefined && value !== null && value !== ''
    }

    /**
     * 是否为数字
     * @param number
     * @returns
     */
    isNumber(number: any): boolean {
        return typeof number === 'number' && isFinite(number)
    }

    /**
     * 判断是否为 URL
     * @param url
     * @returns
     */
    isUrl(url: string): boolean {
        try {
            const info = new URL(url)
            if (
                ($g.protocols || ['https', 'http', 'ftp', 'mms', 'rtsp']).includes(
                    info.protocol.replace(':', '')
                )
            )
                return true
            return false
        } catch {
            return false
        }
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
     * 格式化空字符串
     * @param str
     * @param formatter
     * @returns
     */
    formatEmpty(str?: string, formatter?: string): string | undefined {
        if (this.isEmpty(str)) return formatter ?? ($g.emptyString || '-')
        return str
    }

    /**
     * 替换 URL 参数
     * @param url
     * @param params
     * @returns
     */
    replaceUrlParams(url: string, params?: Record<string, any>): string {
        if (Object.keys(params || {}).length > 0) {
            for (const i in params) {
                if (params[i]) {
                    const reg = new RegExp(`{${i}}`, 'ig')
                    url = url.replace(reg, params[i])
                }
            }
        }
        return url
    }

    /**
     * 随机生成字符串.
     * @returns {string}
     */
    random(): string {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    /**
     * 生成范围内的随机数.
     * @param start
     * @param end
     * @returns {number}
     */
    randomNumberInRange(start: number, end: number): number {
        return Math.round(Math.random() * (end - start) + start)
    }

    /**
     * 生成唯一的 UID.
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
        str = (prefix || $g.prefix) + str
        return upper ? str.toUpperCase() : str.toLowerCase()
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
        if (rid) window.cancelAnimationFrame(rid)
    }

    /**
     * 获取制定元素距离顶部或左侧的距离 ( 可视区域 )
     * @param el
     * @param pos
     * @returns
     */
    getElementActualTopOrLeft(el: HTMLElement, pos = 'top') {
        let actual = pos === 'left' ? el.offsetLeft : el.offsetTop
        let current = el.offsetParent as HTMLElement
        while (current !== null) {
            actual += pos === 'left' ? current.offsetLeft : current.offsetTop
            current = current.offsetParent as HTMLElement
        }
        return actual
    }

    /**
     * 指定 DOM 从指定位置滚动至另外一个指定位置
     * @param el document.body || window
     * @param from
     * @param to
     * @param duration
     * @param endCallback
     */
    scrollToPos(el: any, from = 0, to: number, duration = 800, endCallback?: Function) {
        const difference = Math.abs(from - to)
        const step = Math.ceil((difference / duration) * 50)
        if (duration === 0) {
            el.scrollTop = 0
            endCallback && endCallback()
            return
        }
        let rid: number
        function scroll(start: number, end: number, step: number, vm: any) {
            if (start === end) {
                if (rid) vm.caf(rid)
                endCallback && endCallback()
                return
            }
            let d = start + step > end ? end : start + step
            if (start > end) d = start - step < end ? end : start - step
            if (el === window) window.scrollTo(d, d)
            else el.scrollTop = d
            rid = vm.raf(() => scroll(d, end, step, vm))
        }
        scroll(from, to, step, this)
    }

    /**
     * 回到顶部
     * @param offset
     * @param duration
     * @param endCallback
     */
    back2top(offset: null | number = null, duration = 1000, endCallback?: Function) {
        const top = this.isEmpty(offset)
            ? document.documentElement.scrollTop || document.body.scrollTop
            : offset
        this.scrollToPos(window, top, 0, duration, endCallback)
    }

    /**
     * 回到指定元素位置
     * @param el
     * @param duration
     * @param endCallback
     */
    back2pos(el: any, offset = 0, duration = 1000, endCallback?: Function) {
        if (el instanceof HTMLElement) {
            const cur = document.documentElement.scrollTop || document.body.scrollTop
            const pos = this.getElementActualTopOrLeft(el) - offset
            this.scrollToPos(window, cur, pos, duration, endCallback)
        }
    }

    /**
     * 单位转换
     * @param value
     * @param base
     */
    px2rem(value: number | string, base?: number): number {
        const val = parseInt((value || '').toString().replace('px', ''))
        return this.isNumber(val)
            ? Math.round((val / (base || $g.baseSize || 16)) * 1000) / 1000
            : 0
    }

    /**
     * Hex 转 rgb 数值
     * @param color
     * @returns
     */
    hex2rgbValues(color: string): number[] {
        const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
        if (reg.test(color)) {
            if (color.length === 4) {
                let newColor = '#'
                for (let i = 1; i < 4; i++) {
                    newColor += color.slice(i, i + 1).concat(color.slice(i, i + 1))
                }
                color = newColor
            }
            const changeColor: number[] = []
            for (let i = 1; i < 7; i += 2) {
                changeColor.push(parseInt('0x' + color.slice(i, i + 2)))
            }
            return changeColor
        } else return []
    }

    /**
     * Hex 转 rgb
     * @param color
     * @returns
     */
    hex2rgb(color?: string) {
        if (color) {
            const rgb = this.hex2rgbValues(color)
            return rgb.length > 0 ? `rgb(${rgb.join(',')})` : color
        } else return color
    }

    /**
     * Hex 转 rgba
     * @param color
     * @param opacity
     * @returns
     */
    hex2rgba(color?: string, opacity = 1): string | undefined {
        if (color) {
            const rgb = this.hex2rgbValues(color)
            return rgb.length > 0 ? `rgba(${rgb.join(',')}, ${opacity})` : color
        } else return color
    }

    /**
     * 转 rem
     * @param num
     * @returns
     */
    convert2rem(num: any): any {
        return this.isNumber(num)
            ? `${this.px2rem(num)}rem`
            : num
              ? /%|px|rem|em|rpx/g.test(num)
                  ? num
                  : `${this.px2rem(parseInt(num))}rem`
              : null
    }

    /**
     * 添加事件监听.
     * 注: scroll 事件的监听等请务必使用此方法设定.
     * 避免多人重复定义被覆盖.
     * @param el
     * @param event
     * @param listener
     * @param useCapture
     */
    on(
        el: Window | HTMLElement,
        event: keyof HTMLElementEventMap,
        listener: (this: HTMLElement, evt: HTMLElementEventMap[keyof HTMLElementEventMap]) => any,
        useCapture?: false
    ) {
        if (!!document.addEventListener) {
            if (el && event && listener) el.addEventListener(event, listener, useCapture)
        } else {
            if (el && event && listener) (el as any).attachEvent(`on${event}`, listener)
        }
    }

    /**
     * 移除事件监听.
     * @param el
     * @param event
     * @param listener
     * @param useCapture
     */
    off(
        el: Window | HTMLElement,
        event: keyof HTMLElementEventMap,
        listener: (this: HTMLElement, evt: HTMLElementEventMap[keyof HTMLElementEventMap]) => any,
        useCapture?: false
    ) {
        if (!!document.addEventListener) {
            if (el && event && listener) el.removeEventListener(event, listener, useCapture)
        } else {
            if (el && event && listener) (el as any).detachEvent(`on${event}`, listener)
        }
    }

    /**
     * 主题变量
     * @param record
     * @returns
     */
    setThemeModuleTokens(record: Record<string, any>, target?: HTMLElement) {
        const tokens: string[] = []
        let id = ''
        for (const key in record) {
            tokens.push(`--mi-${key}: ${record[key]};`)
            if (this.isEmpty(id)) {
                const keys = (key || '').split('-') || []
                if (keys.length > 0) keys.pop()
                id = `${$g.prefix}components-${keys.join('-')}-css-variables`
            }
            if (target) target.style.setProperty(`--mi-${key}`, record[key])
        }
        if (!target) this.createCssVariablesElement(tokens, id)
    }

    /**
     * 根据主色调生成主题变量
     * @param theme 主题色 ( hex )
     * @param target 变量插入的节点
     */
    createThemeProperties(theme?: string, target?: HTMLElement) {
        try {
            const themes = themeFromSourceColor(argbFromHex(theme || '#FFD464'))
            this.setThemeSchemeProperties(themes.schemes[$g.theme?.type || 'dark'], target)
        } catch (err) {
            throw new Error('The `theme` variable only supports HEX (e.g. `#FFFFFF`).')
        }
    }

    /**
     * 设置全局的主题变量
     * @param scheme
     * @returns
     */
    setThemeSchemeProperties(scheme: Scheme, target?: HTMLElement) {
        const tokens: string[] = [`--mi-radius: ${$tools.convert2rem($g?.theme?.radius)};`]
        for (const [key, value] of Object.entries(scheme.toJSON())) {
            const token = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
            const color = hexFromArgb(value)
            const rgb = this.hex2rgbValues(color)
            tokens.push(`--mi-${token}: ${color};`, `--mi-rgb-${token}: ${rgb.join(',')};`)
            if (target) target.style.setProperty(`--mi-${token}`, color)
        }
        if (!target) this.createCssVariablesElement(tokens)
    }

    /**
     * 获取局部的主题变量
     * @param properties
     * @returns
     */
    getThemeModuleProperties(properties: Record<string, any>): Record<string, any> {
        const vars = {} as Record<string, any>
        Object.keys(properties || {}).forEach((key: string) => {
            if (/^--*/.test(key)) {
                const label = key.replace(/--/g, '')
                vars[label] = properties[key]
            }
        })
        return vars
    }

    /**
     * 解析局部的主题变量
     * @param properties
     * @returns
     */
    parseThemeModuleProperties(properties: Record<string, any>): Record<string, any> {
        const themes = this.getThemeModuleProperties(properties)
        const vars = { components: {} } as Record<string, any>
        for (const key in themes) {
            const keys = (key || '').split('-') || []
            if (keys[0] && !vars.components[keys[0]]) {
                vars.components[keys[0]] = {}
            }
            let cur = vars.components[keys[0]]
            for (let i = 1, l = keys.length; i < l; i++) {
                if (!cur[keys[i]]) {
                    if (i === l - 1) cur[keys[i]] = themes[key]
                    else cur[keys[i]] = {}
                }
                cur = cur?.[keys[i]] || {}
            }
        }
        return vars
    }

    /**
     * 合并组件局部主题变量
     * @param properties 组件内的默认主题变量
     * @param customProperties 自定义组件主题变量
     * @returns
     */
    assignThemeModuleProperties(
        properties: Record<string, any>,
        customProperties: Record<string, any>
    ): Record<string, any> {
        const themes = this.getThemeModuleProperties(properties) || {}
        if (Object.keys(themes).length > 0) {
            for (const key in themes) {
                const keys = (key || '').split('-') || []
                let current = customProperties?.components
                for (let i = 0, l = keys.length; i < l; i++) {
                    current = current?.[keys[i]] || {}
                    if (i === l - 1 && typeof current === 'string') {
                        themes[key] = current
                        break
                    }
                }
            }
        }
        return themes
    }

    /**
     * 设定局部主题变量
     * @param properties 内置局部变量
     * @param customProperties 自定义变量
     */
    applyThemeModuleProperties(
        properties: Record<string, any>,
        customProperties: Record<string, any>,
        target?: HTMLElement
    ) {
        const themeVars = this.getThemeModuleProperties(properties) || {}
        for (const key in customProperties) {
            if (typeof customProperties[key] === 'string') {
                themeVars[key] = customProperties[key]
            }
        }
        if (Object.keys(themeVars).length > 0) this.setThemeModuleTokens(themeVars, target)
    }

    /**
     * 销毁局部主题变量
     * @param properties
     */
    destroyThemeModuleProperties(properties: Record<string, any>) {
        let label = ''
        const keys = Object.keys(properties || {})
        for (let i = 0, l = keys.length; i < l; i++) {
            const key = keys[i]
            if (/^--*/.test(key)) {
                label = key.replace(/--/g, '')
                break
            }
        }
        const labels = (label || '').split('-') || []
        if (labels.length > 0) labels.pop()
        const token = `${$g.prefix}components-${labels.join('-')}-css-variables`
        const elem = document.getElementById(token)
        if (elem) elem.remove()
    }

    /**
     * 根据窗口尺寸获取配置的大小值
     * @param value 大小值
     *
     * @see DeviceSize
     * @see Breakpoints
     */
    distinguishSize(value?: string | number | DeviceSize) {
        if (value) {
            if (typeof value === 'string' || typeof value === 'number') {
                return value
            } else {
                const width = $g?.winSize?.width || 0
                if (!width) return null
                const values = Object.values(value)
                const breakpoints = {
                    md: $g?.breakpoints?.md || 768,
                    lg: $g?.breakpoints?.lg || 992
                }
                if (values.length > 0) {
                    if (width < breakpoints.md) return value?.mobile || values[0]
                    if (width >= breakpoints.lg) return value?.laptop || values[0]
                    if (width >= breakpoints.md && width < breakpoints.lg) {
                        return value?.tablet || values[0]
                    }
                } else return null
            }
        }
        return null
    }

    /**
     * Antdv 的主题配置
     * @param config
     * @returns
     */
    getAntdvThemeProperties(props?: Record<string, any>) {
        const theme = {
            borderRadius: $g.theme?.radius,
            colorPrimary: $g.theme?.primary
        } as any
        return {
            algorithm:
                $g.theme.type === 'dark' ? AntdvTheme.darkAlgorithm : AntdvTheme.defaultAlgorithm,
            token: Object.assign(theme, props)
        }
    }

    /**
     * 截取字符串
     * @param str
     * @param len
     * @returns
     */
    beautySub(str: string, len: number = 0): string {
        if (str && len) {
            const slice = str.substring(0, len)
            const reg = $g.regExp.chinese || /^[\u4e00-\u9fa5]*$/
            const charNum = ~~(slice.match(reg) && slice.match(reg).length)
            const realNum = slice.length * 2 - charNum - 1
            return `${str.substring(0, realNum)}${realNum < str.length ? '...' : ''}`
        } else return str
    }
}

/**
 * 通用函数 ( `this.$tools.func(...args)` )
 *  - {@link $tools.createMeta} 创建 `Meta` 标签
 *  - {@link $tools.setTitle} 设置标题
 *  - {@link $tools.setKeywords} 设置关键词
 *  - {@link $tools.setDescription} 设置描述内容
 *  - {@link $tools.setWinSize} 设置全局变量 - 窗口大小
 *  - {@link $tools.isEmpty} 判断是否为空
 *  - {@link $tools.isValid} 判断是否有效
 *  - {@link $tools.isNumber} 判断是否为数字
 *  - {@link $tools.isUrl} 判断是否为 `URL`
 *  - {@link $tools.isMobile} 判断是否为移动端
 *  - {@link $tools.formatEmpty} 格式化空字符串
 *  - {@link $tools.replaceUrlParams} 替换 `URL` 参数
 *  - {@link $tools.random} 随机生成字符串
 *  - {@link $tools.randomNumberInRange} 生成范围内的随机数
 *  - {@link $tools.uid} 生成唯一的 `UID`
 *  - {@link $tools.raf} `requestAnimationFrame`
 *  - {@link $tools.caf} `cancelAnimationFrame`
 *  - {@link $tools.getElementActualTopOrLeft} 获取指定元素距离顶端或者左侧的距离 ( 可视区域 )
 *  - {@link $tools.scrollToPos} 指定 `DOM` 从指定位置滚动至另外一个指定位置
 *  - {@link $tools.back2top} 回到顶部
 *  - {@link $tools.back2pos} 回到指定 `DOM` 位置
 *  - {@link $tools.px2rem} 转 rem ( 不带单位的数字 )
 *  - {@link $tools.hex2rgbValues} Hex 转 rgb 数值
 *  - {@link $tools.hex2rgb} Hex 转 rgb
 *  - {@link $tools.hex2rgba} Hex 转 rgba
 *  - {@link $tools.convert2rem} 转 rem ( 附带单位的字符串 )
 *  - {@link $tools.on} 添加事件监听
 *  - {@link $tools.off} 移除事件监听
 *  - {@link $tools.createThemeProperties} 根据主色调生成主题变量
 *  - {@link $tools.setThemeSchemeProperties} 设置主题变量 ( 全局 )
 *  - {@link $tools.getThemeModuleProperties} 获取主题变量 ( 局部 )
 *  - {@link $tools.parseThemeModuleProperties} 解析局部的主题变量
 *  - {@link $tools.applyThemeModuleProperties} 设定局部的主题变量
 *  - {@link $tools.assignThemeModuleProperties} 合并局部的主题变量
 *  - {@link $tools.destroyThemeModuleProperties} 销毁局部主题变量
 *  - {@link $tools.distinguishSize} 根据屏幕尺寸大小选取所需尺寸
 *  - {@link $tools.getAntdvThemeProperties} Antdv 的主题配置
 *  - {@link $tools.beautySub} 截取字符串
 */
export const $tools: MiTools = new MiTools()

export default {
    install(app: App) {
        app.config.globalProperties.$tools = $tools
        return app
    }
}
