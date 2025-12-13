import type { App } from 'vue'
import { $g } from './global'
import type { DeviceSize, Position, KeyValue, Gap, TextSetting } from './types'
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
        if (document.head) {
            const meta = document.createElement('meta')
            meta.name = name.trim()
            meta.content = content.trim()
            document.head.appendChild(meta)
        }
    }

    /**
     * 创建 style 标签并写入 css variables
     * @param tokens
     * @param id
     * @param overwritten 强制覆盖
     * @param append head 末尾追加
     * @param scopeKey 默认全局
     */
    createCssVariablesElement(
        tokens: string[],
        id?: string,
        overwritten?: boolean,
        append?: boolean,
        scopeKey?: string
    ) {
        if (tokens.length > 0) {
            id = id ?? `${$g.prefix}common-css-variables`
            const oldStyle = document.querySelector(`#${id}`)
            if (!oldStyle || overwritten) {
                if (oldStyle) oldStyle.remove()
                const style = document.createElement('style')
                style.setAttribute('id', id)
                style.setAttribute('data-css-hash', Math.random().toString(36).slice(-8))
                style.textContent = `${scopeKey || `:root`} {${tokens.join('')}}`
                const head = document.head || document.getElementsByTagName('head')[0]
                const first = head.firstChild
                if (append) head.appendChild(style)
                else head.insertBefore(style, first)
            }
        }
    }

    /**
     * 设置标题.
     * @param title
     */
    setTitle(title?: string): void {
        const powered = $g.powered || `Powered By makeit.vip`
        title = title || $g.title || 'Makeit Admin Pro'
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
     * 通过 `query object` 形成 `url` 参数
     * @param query
     * @returns
     */
    getUrlParamsByObj(query?: {}) {
        return query
            ? encodeURIComponent(
                  Object.entries(query)
                      .map(([k, v]) => `${k}=${v}`)
                      .join('&')
              )
            : ''
    }

    /**
     * 密码强度 ( Get the password strength. )
     * return a number level ( 1 - 4 ).
     * @param password
     * @returns
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
     * 是否是 `Email`
     * @param email
     * @returns
     */
    isEmail(email: string) {
        if (email) return $g.regExp.email.test(email)
        else return false
    }

    /**
     * 是否为移动端.
     * 注: iPad Safari 获取的 ua 与 Mac Safari 一致, 需独立判断.
     * @returns
     */
    isMobile(): boolean {
        const ua = navigator.userAgent
        const agents = ['Android', 'iPhone', 'iPad', 'iPod']
        return (
            agents.some((agent) => ua.includes(agent)) ||
            (ua.includes('Macintosh') && 'ontouchend' in document)
        )
    }

    /**
     * 密码校验
     * @param password
     * @returns
     */
    checkPassword(password: string): boolean {
        return $g.regExp.password.test(password)
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
     * 格式化时间
     * @param formatter 格式 ( YMD H:m:s )
     * @returns
     */
    formatDateNow(formatter: string = 'Y-M-D H:m:s'): string {
        const date = new Date()
        const pad = (n: number) => n.toString().padStart(2, '0')
        const replacements: Record<string, string> = {
            Y: date.getFullYear().toString(),
            M: pad(date.getMonth() + 1),
            D: pad(date.getDate()),
            H: pad(date.getHours()),
            m: pad(date.getMinutes()),
            s: pad(date.getSeconds())
        }
        return formatter.replace(/[YMDHms]/g, (match) => replacements[match])
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
            this.random()
        ).toLocaleUpperCase()
        str = (prefix ?? $g.prefix) + str
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
    getElementActualOffsetTopOrLeft(el: HTMLElement, pos = 'top') {
        let actual = pos === 'left' ? el?.offsetLeft : el?.offsetTop
        let current = el?.offsetParent as HTMLElement
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
     * @param container 滚动容器
     * @param duration
     * @param endCallback
     */
    back2top(container: any, duration = 1000, endCallback?: Function) {
        const top = container
            ? container?.scrollTop || 0
            : document.documentElement.scrollTop || document.body.scrollTop
        this.scrollToPos(container, top, 0, duration, endCallback)
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
            const pos = this.getElementActualOffsetTopOrLeft(el) - offset
            this.scrollToPos(window, cur, pos, duration, endCallback)
        }
    }

    /**
     * 单位转换 px -> rem
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
     * 单位转换 rem -> px
     * @param value
     * @param base
     */
    rem2px(value: number | string, base?: number): number {
        const val = parseInt((value || '').toString().replace('rem', ''))
        return this.isNumber(val) ? Math.round(val * (base || $g.baseSize || 16) * 1000) / 1000 : 0
    }

    /**
     * Hex 转 rgb 数值
     * @param color
     * @returns
     */
    hex2rgbValues(color: string): number[] {
        const hex = color.replace(/^#/, '')
        const len = hex.length
        if (len !== 3 && len !== 6) return []
        const expand =
            len === 3
                ? hex
                      .split('')
                      .map((c) => c + c)
                      .join('')
                : hex

        return expand.match(/[a-f\d]{2}/gi)!.map((v) => parseInt(v, 16))
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
              ? /%|px|rem|em|rpx|auto/g.test(num)
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
        if (document.addEventListener) {
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
        if (document.addEventListener) {
            if (el && event && listener) el.removeEventListener(event, listener, useCapture)
        } else {
            if (el && event && listener) (el as any).detachEvent(`on${event}`, listener)
        }
    }

    /**
     * 获取模块css variabled 的唯一 id
     * @param record
     * @returns
     */
    getThemeModuleId(record: Record<string, any>) {
        let id = ''
        for (const key in record) {
            if (this.isEmpty(id)) {
                const keys = (key || '').split('-') || []
                if (keys.length > 0) keys.pop()
                id = `${$g.prefix}components-${keys.join('-')}-css-variables`
                break
            }
        }
        return id
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
     * @param primary 主题色 ( hex )
     * @param target 变量插入的节点
     */
    createThemeProperties(primary?: string, target?: HTMLElement) {
        try {
            const themes = themeFromSourceColor(argbFromHex(primary || '#63ACFF'))
            this.setThemeSchemeProperties(themes.schemes[$g?.theme?.type || 'dark'], target)
        } catch {
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
            if (target) {
                target.style.setProperty(`--mi-${token}`, color)
                target.style.setProperty(`--mi-rgb-${token}`, rgb as any)
            }
        }
        if (!target) this.createCssVariablesElement(tokens, undefined, true)
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
        const getCustomTokens = (data: Record<string, any>, name?: string) => {
            for (const key in data) {
                const index = `${name ? `${name}-` : ''}${key}`
                if (typeof data[key] === 'string') {
                    themeVars[index] = data[key]
                } else if (typeof data[key] === 'object') getCustomTokens(data[key], index)
            }
        }
        getCustomTokens(customProperties)
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
    distinguishSize(value?: string | number | DeviceSize, dynamicWidth?: number) {
        if (value === undefined) return null
        if (typeof value !== 'object') return value
        const width = dynamicWidth ?? ($g?.winSize?.width || 0)
        if (!width) return null
        const { md = 768, lg = 992 } = $g?.breakpoints ?? {}
        return width < md
            ? (value.mobile ?? Object.values(value)[0])
            : width < lg
              ? (value.tablet ?? Object.values(value)[0])
              : (value.laptop ?? value.tablet ?? Object.values(value)[0])
    }

    /**
     * 根据配置值获取转换后的间距值
     * @param gap
     *
     * @see distinguishSize
     */
    getGap(gap?: string | number | DeviceSize | Gap) {
        if (typeof gap !== 'undefined') {
            if (typeof gap === 'string' || typeof gap === 'number') {
                return gap
            } else if (typeof gap === 'object') {
                if ((gap as Gap)?.column || (gap as Gap)?.row) {
                    return {
                        column: this.distinguishSize((gap as Gap)?.column),
                        row: this.distinguishSize((gap as Gap)?.row)
                    }
                } else return this.distinguishSize(gap as DeviceSize)
            }
        } else return null
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
            const reg = /[\u4e00-\u9fa5]/g
            const charNum = ~~(slice.match(reg) && slice.match(reg).length)
            const realNum = slice.length * 2 - charNum
            return `${str.substring(0, realNum)}${realNum < str.length ? '...' : ''}`
        } else return str
    }

    /**
     * 防抖
     * @param func
     * @param delay
     * @returns
     */
    debounce(func: Function, delay?: number) {
        let timer = null
        return (...args: any) => {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                func.apply(this, args)
                timer = null
            }, delay ?? 0)
        }
    }

    /**
     * HTML转换
     * @param html
     * @returns
     */
    htmlEncode(html: string) {
        let temp: HTMLDivElement | null = document.createElement('div') as HTMLDivElement
        temp.textContent !== null ? (temp.textContent = html) : (temp.innerText = html)
        const output = temp.innerHTML
        temp = null
        return output
    }

    /**
     * 封装定位或间距
     * @param [string, number] value 数值
     * @param prefix 前缀 (如: margin)
     */
    wrapPositionOrSpacing(data: Position, prefix?: string) {
        const position: Record<string, string> = {}
        if (Object.keys(data).length > 0) {
            const getKeys = (): KeyValue[] => {
                const defaultPosition = ['top', 'bottom', 'left', 'right']
                const keys: KeyValue[] = []
                const ucfirst = (letter: string): string => {
                    return letter.slice(0, 1).toUpperCase() + letter.slice(1).toLowerCase()
                }
                defaultPosition.forEach((pos: string) => {
                    const name = prefix ? `${prefix}${ucfirst(pos)}` : pos
                    keys.push({
                        key: pos,
                        value: name
                    })
                })
                return keys
            }
            const items = getKeys()
            items.forEach((item: KeyValue) => {
                const v = data[item.key]
                position[item.value] =
                    typeof v !== 'undefined'
                        ? v !== 'unset'
                            ? $tools.convert2rem($tools.distinguishSize(v))
                            : v
                        : null
            })
        }
        return position
    }

    /**
     * 获取间距样式
     * @param margin
     * @param prefix
     * @returns
     */
    getSpacingStyle(spacing: string | number | Position, prefix = 'margin') {
        return ['string', 'number', 'object'].includes(typeof spacing)
            ? typeof spacing === 'string' || typeof spacing === 'number'
                ? { [prefix]: this.convert2rem(this.distinguishSize(spacing)) }
                : { ...this.wrapPositionOrSpacing(spacing || {}, prefix) }
            : { [prefix]: 0 }
    }

    /**
     * 颜色转换 hex -> rgba
     * @param color
     * @param opacity
     * @returns
     */
    colorHex2Rgba(color: string, opacity = 1): string {
        if (color) {
            if ($g.regExp.hex.test(color)) {
                if (color.length === 4) {
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
                    return `rgba(${changeColor.join(',')}, ${opacity})`
                }
            }
        }
        return color
    }

    /**
     * 颜色转换 rgb -> hex
     * @param color
     * @returns
     */
    colorRgb2Hex(color: string): string {
        if (color) {
            if ($g.regExp.rgb.test(color)) {
                const aColor = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
                let strHex = '#'
                for (let i = 0; i < aColor.length; i++) {
                    let hex = Number(aColor[i]).toString(16)
                    if (hex === '0') hex += hex
                    strHex += hex
                }
                if (strHex.length !== 7) strHex = color
                return strHex
            } else if ($g.regExp.hex.test(color)) {
                const aNum = color.replace(/#/, '').split('')
                if (aNum.length === 6) {
                    return color
                } else if (aNum.length === 3) {
                    let numHex = '#'
                    for (let i = 0; i < aNum.length; i += 1) {
                        numHex += aNum[i] + aNum[i]
                    }
                    return numHex
                }
            }
        }
        return color
    }

    /**
     * 获取浏览器语系
     * @returns
     */
    getLanguage() {
        let lang = 'zh-cn'
        if (typeof window !== 'undefined') {
            lang = (
                navigator ? (navigator.language ?? (navigator as any).browerLanguage) : 'zh-cn'
            ).toLowerCase()
        }
        return lang
    }

    /**
     * 判断字符串开头字符及返回处理
     * @param str 字符串
     * @param prefix 开头字符
     * @param combine 是否联合返回
     * @returns
     */
    startWith(str: string, prefix: string, combine = true) {
        if (str) {
            const status = str.charAt(0) === prefix
            return combine ? (status ? str : `${prefix}${str}`) : status
        }
        return false
    }

    /**
     * 阿拉伯数字转罗马数字
     * @param num 数字
     * @returns
     */
    convert2RomanNumber(num: number) {
        const map: [string, number][] = [
            ['M', 1000],
            ['CM', 900],
            ['D', 500],
            ['CD', 400],
            ['C', 100],
            ['XC', 90],
            ['L', 50],
            ['XL', 40],
            ['X', 10],
            ['IX', 9],
            ['V', 5],
            ['IV', 4],
            ['I', 1]
        ]
        return map.reduce((acc, [symbol, value]) => {
            while (num >= value) {
                acc += symbol
                num -= value
            }
            return acc
        }, '')
    }

    /**
     * 获取文案内容及样式
     * @param text
     * @returns
     */
    getTextSetting(text?: string | TextSetting) {
        if (!text) return { style: {} }
        const result: any = {
            text: typeof text === 'string' ? text : text.text,
            style: {}
        }
        if (typeof text === 'object') {
            const { bold, align, color, margin, size, lineHeight } = text
            result.style = {
                fontWeight: bold ? 'bold' : 'normal',
                justifyContent:
                    align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
                color,
                textAlign: align,
                ...this.getSpacingStyle(margin),
                fontSize: size ? this.convert2rem(this.distinguishSize(size)) : undefined,
                lineHeight: lineHeight
                    ? this.convert2rem(this.distinguishSize(lineHeight))
                    : undefined
            }
        }
        return result
    }

    /**
     * 对象深度拷贝
     * @param opts
     * @returns
     */
    deepAssign(target: any, ...sources: any[]) {
        sources.forEach((source) => {
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    if (typeof source[key] === 'object' && source[key] !== null) {
                        target[key] = this.deepAssign(
                            target[key] || (Array.isArray(source[key]) ? [] : {}),
                            source[key]
                        )
                    } else {
                        target[key] = source[key]
                    }
                }
            }
        })
        return target
    }

    /**
     * 获取父元素节点
     * @param elem
     * @param pSelector
     * @returns
     */
    getParents(elem: HTMLElement, pSelector?: string) {
        if (!pSelector || pSelector === undefined) {
            throw new Error('请传入要搜索的父元素Id名或者类名#id或者.classname')
        }
        // 默认匹配的类型
        let type = 'className'
        let splitF = '.'
        // 如果第一个字符是#那么证明传入的是id
        if (pSelector.indexOf('#') === 0) {
            type = 'id'
            splitF = '#'
        }
        const selector = pSelector.split(splitF)[1]
        function getP(el: HTMLElement) {
            // 获取当前元素的父元素
            const p = el.parentNode as any
            // 如果元素的父元素是document 那么证明已经到最后一层了 就是没有匹配到这个父元素
            if (p === document) {
                return false
            }
            // 如果父元素的id或者class包含样式类
            if (p[type] === selector) {
                // 如果包含 那么返回这个元素
                return p
            } else {
                // 如果不包含那么就递归 这里要return递归函数 否则会没有返回值
                return getP(p)
            }
        }
        return getP(elem)
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
 *  - {@link $tools.getUrlParamsByObj} 通过 `query object` 形成 `url` 参数
 *  - {@link $tools.isEmail} 判断是否为 `Email`
 *  - {@link $tools.isMobile} 判断是否为移动端
 *  - {@link $tools.checkPassword} 密码校验
 *  - {@link $tools.formatEmpty} 格式化空字符串
 *  - {@link $tools.formatDateNow} 格式化时间
 *  - {@link $tools.replaceUrlParams} 替换 `URL` 参数
 *  - {@link $tools.random} 随机生成字符串
 *  - {@link $tools.randomNumberInRange} 生成范围内的随机数
 *  - {@link $tools.uid} 生成唯一的 `UID`
 *  - {@link $tools.raf} `requestAnimationFrame`
 *  - {@link $tools.caf} `cancelAnimationFrame`
 *  - {@link $tools.getElementActualOffsetTopOrLeft} 获取指定元素距离顶端或者左侧的距离 ( 可视区域 )
 *  - {@link $tools.scrollToPos} 指定 `DOM` 从指定位置滚动至另外一个指定位置
 *  - {@link $tools.back2top} 回到顶部
 *  - {@link $tools.back2pos} 回到指定 `DOM` 位置
 *  - {@link $tools.px2rem} px 转 rem
 *  - {@link $tools.rem2px} rem 转 px
 *  - {@link $tools.hex2rgbValues} Hex 转 rgb 数值
 *  - {@link $tools.hex2rgb} Hex 转 rgb
 *  - {@link $tools.hex2rgba} Hex 转 rgba
 *  - {@link $tools.convert2rem} 转 rem ( 附带单位的字符串 )
 *  - {@link $tools.on} 添加事件监听
 *  - {@link $tools.off} 移除事件监听
 *  - {@link $tools.getThemeModuleId} 获取模块css variabled 的唯一 id
 *  - {@link $tools.setThemeModuleTokens} 设置模块的主题变量
 *  - {@link $tools.createThemeProperties} 根据主色调生成主题变量
 *  - {@link $tools.setThemeSchemeProperties} 设置主题变量 ( 全局 )
 *  - {@link $tools.getThemeModuleProperties} 获取主题变量 ( 局部 )
 *  - {@link $tools.parseThemeModuleProperties} 解析局部的主题变量
 *  - {@link $tools.applyThemeModuleProperties} 设定局部的主题变量
 *  - {@link $tools.assignThemeModuleProperties} 合并局部的主题变量
 *  - {@link $tools.destroyThemeModuleProperties} 销毁局部主题变量
 *  - {@link $tools.distinguishSize} 根据屏幕尺寸大小选取所需尺寸
 *  - {@link $tools.getGap} 根据配置值获取转换后的间距值
 *  - {@link $tools.getAntdvThemeProperties} Antdv 的主题配置
 *  - {@link $tools.beautySub} 截取字符串
 *  - {@link $tools.debounce} 防抖
 *  - {@link $tools.htmlEncode} HTML转换
 *  - {@link $tools.wrapPositionOrSpacing} 封装定位或间距
 *  - {@link $tools.colorHex2Rgba} 颜色转换 hex -> rgba
 *  - {@link $tools.colorRgb2Hex} 颜色转换 rgb -> hex
 *  - {@link $tools.getLanguage} 获取浏览器语系
 *  - {@link $tools.startWith} 判断字符串开头字符及返回处理
 *  - {@link $tools.convert2RomanNumber} 阿拉伯数字转罗马数字
 *  - {@link $tools.getTextSetting} 获取文案内容及样式
 *  - {@link $tools.getSpacingStyle} 获取间距样式
 *  - {@link $tools.deepAssign} 对象深度拷贝
 *  - {@link $tools.getParents} 获取父元素节点
 */
export const $tools: MiTools = new MiTools()

export default {
    install(app: App) {
        app.config.globalProperties.$tools = $tools
        return app
    }
}
