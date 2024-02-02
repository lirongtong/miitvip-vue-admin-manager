import { VNode, type CSSProperties } from 'vue'
import type { AxiosRequestConfig } from 'axios'
import { createTypes, type VueTypesInterface, type VueTypeValidableDef } from 'vue-types'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export const PropTypes = createTypes() as VueTypesInterface & {
    readonly style: VueTypeValidableDef<CSSProperties>
}

/**
 * +====================+
 * |      主题设置       |
 * +====================+
 * @param type 深色 / 浅色
 * @param primary 主题色
 * @param radius 圆角
 */
export interface Theme {
    [key: string]: any
    type: 'dark' | 'light'
    primary: string
    radius: number
}

/**
 * +====================+
 * |      断点设置       |
 * +====================+
 * @param xs 480
 * @param sm 576
 * @param md 768
 * @param lg 992
 * @param xm 1024
 * @param xl 1200
 * @param xxl 1600
 * @param xxxl 2000
 */
export interface Breakpoints {
    xs: number
    sm: number
    md: number
    lg: number
    xm: number
    xl: number
    xxl: number
    xxxl: number
}

/**
 * +====================+
 * |      宽高设置       |
 * +====================+
 * @param width 宽度
 * @param height 高度
 */
export interface Size {
    width: number
    height: number
}

/**
 * +========================+
 * |      常用 RegExp       |
 * +========================+
 * @param phone 手机
 * @param password 密码
 * @param username 用户名
 * @param email 邮箱
 * @param chinese 中文
 */
export interface RegExpTokens {
    [key: string]: any
    phone: RegExp
    password: RegExp
    username: RegExp
    email: RegExp
    chinese: RegExp
}

/**
 * +===========================+
 * |      常用 Cache Key       |
 * +===========================+
 * @param storages
 * @param cookies
 */
export interface CacheTokens {
    storages: {
        [key: string]: any
        collapsed: string
    }
    cookies: {
        [key: string]: any
        token: {
            access: string
            refresh: string
        }
    }
}

/**
 * +================================================+
 * |      请求配置 ( 继承 AxiosRequestConfig )       |
 * +================================================+
 * @param retry: 第 N 次重试请求
 * @param retryDelay: 重试请求的延迟时间 ( 单位: ms )
 * @param retryCount: 最大重试请求的次数 ( retry > retryCount 时, 停止 )
 */
export type RequestConfig = AxiosRequestConfig & {
    retry?: number
    retryDelay?: number
    retryCount?: 0
}

/**
 * +====================+
 * |      全局变量       |
 * +====================+
 * @param title 文档标题
 * @param site 站点名称
 * @param author 作者
 * @param logo 站点图标
 * @param powered 提供方
 * @param keywords 关键词
 * @param description 描述
 * @param theme 主题
 * @param primaryColor 主色
 * @param borderRadius 圆角
 * @param prefix 前缀
 * @param emptyFormatter 空串格式化的字符串
 * @param apiVersion API 版本
 * @param copyright 版权所有
 * @param protocols URL 校验协议数组
 * @param regExp 常用正则
 * @param caches 缓存 key 值
 * @param breakpoints 断点
 * @param winSize 窗口大小
 *
 * @see Size
 * @see Theme
 * @see RegExpTokens
 * @see CacheTokens
 * @see Breakpoints
 */
export interface GlobalProperties {
    [key: string]: any
    readonly prefix?: string
    readonly author?: string
    title?: string
    site?: string
    logo?: string
    powered?: string
    keywords?: string
    description?: string
    theme?: Partial<Theme>
    emptyFormatter?: string
    apiVersion?: string
    copyright?: {
        laptop?: any
        tablet?: any
        mobile?: any
    }
    protocols?: string[]
    regExp?: Partial<RegExpTokens>
    caches?: Partial<CacheTokens>
    breakpoints?: Partial<Breakpoints>
    winSize?: Partial<Size>
}

/**
 * +====================+
 * |      路由插槽       |
 * +====================+
 * @param Component 组件
 * @param route 路由
 */
export interface RouterViewSlot {
    Component: VNode
    route: RouteLocationNormalizedLoaded
}

/**
 * +===============================+
 * |      不同设备下的尺寸配置       |
 * +===============================+
 * @param laptop 笔记本 ( > breakpoints.lg )
 * @param mobile 移动端 ( < breakpoints.md )
 * @param tablet 平板 ( < breakpoints.lg )
 *
 * e.g.
 * ```
 * const size = {
 *     laptop: 48,
 *     mobile: 32,
 *     tablet: 36
 * }
 * ```
 *
 * @see Breakpoints
 */
export interface DeviceSize {
    laptop: string | number
    mobile: string | number
    tablet: string | number
}

/**
 * +====================+
 * |      大小颜色       |
 * +====================+
 * @param size 大小
 * @param color 颜色
 *
 * @see SizeColor
 */
export interface SizeColor {
    size: number | string | DeviceSize
    color: string
}

/**
 * +====================+
 * |      菜单项目       |
 * +====================+
 * Path of the record. Should start with `/` unless
 * the record is the child of another record.
 * @example `/users/:id` matches `/users/1` as well as `/users/posva`.
 *
 * @param path 路由
 * @param query 路由参数
 * @param name 名称 ( 唯一值 )
 * @param meta 其他配置
 * @param children 子菜单
 *
 * @see MenuItemMeta
 */
export interface MenuItem {
    path: string
    name: string
    query?: Record<string, any>
    meta?: Partial<MenuItemMeta>
    children?: MenuItem[] | undefined
}
/**
 * @param title 菜单项的标题
 * @param icon 图标
 * @param tag 标签
 */
export interface MenuItemMeta {
    [key: string]: any
    title: string
    icon: any
    tag: Partial<MenuItemMetaTag>
}
export interface MenuItemMetaTag {
    [key: string]: any
    color: string
    content: string
    icon: any
    size: string | number | DeviceSize
    radius: string | number | DeviceSize
}
