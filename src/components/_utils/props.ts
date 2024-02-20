import { isVNode, Fragment, Comment, Text, PropType, Slots } from 'vue'
import { VueTypeDef, VueTypeValidableDef } from 'vue-types'
import { $tools } from '../../utils/tools'

export const tuple = <T extends string[]>(...args: T) => args

export const methods = [
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'options',
    'head',
    'link',
    'unlink',
    'purge'
]
export const actions = ['click', 'hover', 'focus', 'contextmenu']
export const placement = [
    'top',
    'left',
    'right',
    'bottom',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
    'leftTop',
    'leftBottom',
    'rightTop',
    'rightBottom'
]
export const animations = [
    'fade',
    'scale',
    'slide',
    'slide-right',
    'slide-bottom',
    'page-slide',
    'slide-fall',
    'newspaper',
    'sticky',
    'flip',
    'flip-horizontal',
    'flip-vertical',
    'fall',
    'rotate',
    'sign',
    'slit',
    'shake',
    'breadcrumb',
    'anchor'
]

const isOn = (key: string) => /^on[^a-z]/.test(key)

const splitAttrs = (attrs: any) => {
    const allAttrs = Object.keys(attrs)
    const eventAttrs = {}
    const onEvents = {}
    const extraAttrs = {}
    for (let i = 0, l = allAttrs.length; i < l; i++) {
        const key = allAttrs[i]
        if (isOn(key)) {
            eventAttrs[key[2].toLowerCase() + key.slice(3)] = attrs[key]
            onEvents[key] = attrs[key]
        } else extraAttrs[key] = attrs[key]
    }
    return { onEvents, events: eventAttrs, extraAttrs }
}

const getEvents = (ele: any = {}, on = true) => {
    let props = {}
    if (ele.$) props = { ...props, ...ele.$attrs }
    else props = { ...props, ...ele.props }
    return splitAttrs(props)[on ? 'onEvents' : 'events']
}

const isEmptyElement = (elem: any) => {
    return (
        elem.type === Comment ||
        (elem.type === Fragment && elem.children.length === 0) ||
        (elem.type === Text && elem.children.trim() == '')
    )
}

const flattenChildren = (children: any[] = []) => {
    children = Array.isArray(children) ? children : [children]
    const res: any[] = []
    children?.forEach((child: { [index: string]: any } | []) => {
        if (Array.isArray(child)) {
            res.push(...flattenChildren(child))
        } else if (child?.type === Fragment) {
            res.push(...flattenChildren(child?.children))
        } else if (child && isVNode(child) && !isEmptyElement(child)) {
            res.push(child)
        } else if ($tools.isValid(child)) {
            res.push(child)
        }
    })
    return res
}

const getSlot = (instance: any, name = 'default', options = {}) => {
    if (isVNode(instance)) {
        if (instance.type === Fragment) {
            return name === 'default' ? flattenChildren(instance?.children as any[]) : []
        } else if (instance?.children && instance.children[name]) {
            return flattenChildren((instance?.children as any[])[name](options))
        } else {
            return []
        }
    } else {
        const res = instance.$slots[name] && instance.$slots[name](options)
        return flattenChildren(res)
    }
}

const getSlotContent = (instance: any, prop = 'default', options = instance, exec = true) => {
    let content: any = undefined
    if (instance.$) {
        const temp = instance[prop]
        if (temp !== undefined) {
            return typeof temp === 'function' && exec ? temp(options) : temp
        } else {
            content = instance.$slots[prop] as any
            content = content && exec ? content(options) : content
        }
    } else if (isVNode(instance)) {
        const temp = instance.props && instance.props[prop]
        if (temp !== undefined && instance.props !== null) {
            return typeof temp === 'function' && exec ? temp(options) : temp
        } else if (instance.type === Fragment) {
            content = instance?.children
        } else if (instance?.children && (instance?.children as any[])[prop]) {
            content = (instance?.children as any[])[prop] as any
            content = content && exec ? content(options) : content
        }
    }
    if (Array.isArray(content)) {
        content = flattenChildren(content)
        content = content?.length === 1 ? content[0] : content
        content = content?.length === 0 ? undefined : content
    }
    return content
}

const getPropSlot = (slots: Slots, props: any, prop = 'default') => {
    return props[prop] ?? slots[prop]?.()
}

const getPrefixCls = (suffixCls: string, prefixCls?: string, customizeCls?: string) => {
    if (customizeCls) return customizeCls
    return `${prefixCls ?? 'mi-'}${suffixCls}`
}

const initProps = <T>(
    types: T,
    defaultProps: {
        [K in keyof T]?: T[K] extends VueTypeValidableDef<infer U>
            ? U
            : T[K] extends VueTypeDef<infer U>
              ? U
              : T[K] extends { type: PropType<infer U> }
                ? U
                : any
    }
): T => {
    const propTypes: T = { ...types }
    Object.keys(defaultProps).forEach((k) => {
        const prop = propTypes[k] as VueTypeValidableDef
        if (prop) {
            if (prop.type || prop.default) {
                prop.default = defaultProps[k]
            } else if (prop.def) {
                prop.def(defaultProps)
            } else propTypes[k] = { type: prop, default: defaultProps[k] }
        } else {
            throw new Error(`${k} prop does not exist.`)
        }
    })
    return propTypes
}

export {
    splitAttrs,
    getEvents,
    isEmptyElement,
    flattenChildren,
    getSlot,
    getSlotContent,
    getPropSlot,
    getPrefixCls,
    initProps
}
