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
export interface ThemeConfig {
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
 * @param hex 十六进制颜色值
 * @param rgb RGB 颜色值
 */
export interface RegExpTokens {
    [key: string]: any
    phone: RegExp
    password: RegExp
    username: RegExp
    email: RegExp
    chinese: RegExp
    hex: RegExp
    rgb: RegExp
}

/**
 * +===========================+
 * |      常用 Cache Key       |
 * +===========================+
 * @param storages
 * @param cookies
 */
export interface CacheTokens {
    storages: Partial<{
        [key: string]: any
        theme: Partial<{
            [key: string]: any
            type: string
            hex: string
        }>
        user: string
        email: string
        collapsed: string
        locale: string
        languages: Partial<{
            [key: string]: any
            custom: string
            categories: string
        }>
        captcha: Partial<{
            [key: string]: any
            login: string
            register: string
            email: string
        }>
        password: Partial<{
            [key: string]: any
            reset: Partial<{
                [key: string]: any
                time: string
                token: string
                uid: string
                username: string
            }>
        }>
    }>
    cookies: Partial<{
        [key: string]: any
        autoLogin: string
        token: {
            access: string
            refresh: string
        }
    }>
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
    locale?: string
    readonly powered?: string
    keywords?: string
    description?: string
    theme?: Partial<ThemeConfig>
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
    readonly breakpoints?: Partial<Breakpoints>
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
    laptop?: string | number
    mobile?: string | number
    tablet?: string | number
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
 * @see ItemTag
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
    tag: Partial<ItemTag>
}

/**
 * +=====================+
 * |      项目 Item      |
 * +=====================+
 * @param color 颜色
 * @param content 内容
 * @param icon 图标
 * @param size 大小
 * @param radius 圆角弧度
 */
export interface ItemTag {
    [key: string]: any
    color: string
    content: string
    icon: any
    size: string | number | DeviceSize
    radius: string | number | DeviceSize
}

/**
 * +============================+
 * |      联想搜索数据规范       |
 * +============================+
 * @param title 标题
 * @param summary 摘要
 * @param icon 图标
 * @param avatar 头像 ( 优先于 `icon` )
 * @param path 跳转链接
 */
export interface SearchData {
    [key: string]: any
    title: string
    summary: string
    icon: any
    avatar: string
    path: string
    query: Record<string, any>
}

/**
 * +=====================+
 * |      下拉选项        |
 * +=====================+
 * @param name key 值
 * @param title 菜单项的标题
 * @param titleSize 标题大小
 * @param path 链接地址
 * @param query 链接参数
 * @param target 弹窗类型
 * @param icon 图标
 * @param iconSize 图标大小
 * @param tag 标签
 * @param callback 回调
 */
export interface DropdownItem {
    [key: string]: any
    name: string
    title: string
    titleSize: string | number | DeviceSize
    path: string
    query: object
    target: string
    icon: any
    iconSize: string | number | DeviceSize
    tag: Partial<ItemTag>
    callback: Function
}

/**
 * +==================+
 * |      位置        |
 * +==================+
 * @param left 左边距 ( 数字或百分比 )
 * @param right 右边距
 * @param top 上边距
 * @param bottom 下边距
 */
export interface Position {
    left?: string | number | DeviceSize
    right?: string | number | DeviceSize
    top?: string | number | DeviceSize
    bottom?: string | number | DeviceSize
}

/**
 * +=============================+
 * |      Key-Value 键值对        |
 * +=============================+
 * @param key 键
 * @param value 值
 */
export interface KeyValue {
    key: string | number
    value: any
}

/**
 * +=============================+
 * |      接口响应默认结构        |
 * +=============================+
 * @param ret 结果信息与结果码
 * @param data 数据
 *
 * @see ResponseRet
 */
export interface ResponseData {
    ret: ResponseRet
    data: any
}
/**
 * @param code 结果码
 * @param message 结果信息
 */
export interface ResponseRet {
    code: string | number
    message: string
}

/**
 * +=========================+
 * |      登录参数结构        |
 * +=========================+
 * @param username 用户名
 * @param password 密码
 * @param remember 是否自动登录
 * @param captcha 是否开启验证码
 * @param url 接口地址
 * @param method 请求方式
 * @param cuid 验证码校验 UID
 */
export interface LoginParams {
    username: string
    password: string
    remember?: boolean | number
    captcha: boolean
    url?: string
    method?: string
    cuid?: string
}

/**
 * +=========================+
 * |      注册参数结构        |
 * +=========================+
 * @param username 用户名
 * @param email 邮箱地址
 * @param password 密码
 * @param confirm 确认密码
 * @param captcha 是否开启验证码
 * @param url 接口地址
 * @param method 请求方式
 * @param cuid 验证码校验 UID
 */
export interface RegisterParams {
    username: string
    email: string
    password: string
    confirm: string
    captcha: boolean
    url?: string
    method?: string
    cuid?: string | null
}

/**
 * +======================+
 * |      授权登录        |
 * +======================+
 * @param url 接口地址
 * @param token 授权码
 */
export interface LoginAuth {
    url: string
    token: string
}

/**
 * +=============================+
 * |      登录响应数据结构        |
 * +=============================+
 * @param user 用户数据
 * @param tokens 授权
 */
export interface LoginResponseData {
    user: any
    tokens: Partial<{
        access: string
        refresh: string
    }>
}

/**
 * +=====================+
 * |      校验配置        |
 * +=====================+
 * @param action 动作
 * @param params 参数
 * @param method 方式
 */
export interface VerifyConfig {
    action: string | Function
    params: object
    method: string
}

/**
 * +=========================+
 * |      锚点链接配置        |
 * +=========================+
 * @param id 唯一值
 * @param title 标题
 */
export interface AnchorLinkItem {
    id: string
    title: string
}
/**
 * +=========================+
 * |      锚点链接配置        |
 * +=========================+
 * @param id 唯一值
 * @param title 标题
 */
export interface AnchorListItem {
    id: string
    title: string
    offset: number
}
