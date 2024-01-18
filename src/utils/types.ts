import { VNode, type CSSProperties } from 'vue'
import type { AxiosRequestConfig } from 'axios'
import { createTypes, type VueTypesInterface, type VueTypeValidableDef } from 'vue-types'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export const PropTypes = createTypes() as VueTypesInterface & {
    readonly style: VueTypeValidableDef<CSSProperties>
}

/**
 * 请求配置 ( 继承 AxiosRequestConfig )
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
 * 全局变量
 * @param title 文档标题
 * @param site 站点名称
 * @param author 作者
 * @param logo 站点图标
 * @param powered 提供方
 * @param keywords 关键词
 * @param description 描述
 * @param theme 主题
 * @param primaryColor 主色
 * @param radius 圆角
 * @param prefix 前缀
 * @param emptyFormatter 空串格式化的字符串
 * @param apiVersion API 版本
 * @param copyright 版权所有
 * @param protocols URL 校验协议数组
 * @param regExp 常用正则
 * @param caches 缓存 key 值
 * @param breakpoints 断点
 */
export interface GlobalProperties extends Record<string, any> {
    title?: string
    site?: string
    author?: string
    logo?: string
    powered?: string
    keywords?: string
    description?: string
    theme?: string
    primaryColor?: string
    radius?: number
    prefix?: string
    emptyFormatter?: string
    apiVersion?: string
    copyright?: Record<string, any>
    protocols?: string[]
    regExp?: Record<string, any>
    caches?: Record<string, any>
    breakpoints?: Record<string, number>
}

/**
 * 路由插槽
 * @param Component 组件
 * @param route 路由
 */
export interface RouterViewSlot {
    Component: VNode
    route: RouteLocationNormalizedLoaded
}

/**
 * 默认 Props
 * @param prefixCls 样式前缀
 */
export type DefaultProps = {
    prefixCls?: VueTypeValidableDef<string>
}
