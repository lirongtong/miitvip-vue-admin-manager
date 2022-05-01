import { isVNode, Fragment, Comment, Text } from 'vue'
import { $tools } from '../../utils/tools'

export const tuple = <T extends string[]>(...args: T) => args

const onRE = /^on[^a-z]/
const isOn = (key: string) => onRE.test(key)

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
        } else {
            extraAttrs[key] = attrs[key]
        }
    }
    return { onEvents, events: eventAttrs, extraAttrs }
}

const getEvents = (ele: any = {}, on = true) => {
    let props = {}
    if (ele.$) {
        props = { ...props, ...ele.$attrs }
    } else {
        props = { ...props, ...ele.props }
    }
    return splitAttrs(props)[on ? 'onEvents' : 'events']
}

const isEmptyElement = (elem: any) => {
    return (
        elem.type === Comment ||
        (elem.type === Fragment && elem.children.length === 0) ||
        (elem.type === Text && elem.children.trim() == '')
    )
}

const flattenChildren = (children = []) => {
    children = Array.isArray(children) ? children : [children]
    const res = []
    children.forEach((child) => {
        if (Array.isArray(child)) {
            res.push(...flattenChildren(child))
        } else if (child && child.type === Fragment) {
            res.push(...flattenChildren(child.children))
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
            return name === 'default' ? flattenChildren(instance.children as any[]) : []
        } else if (instance.children && instance.children[name]) {
            return flattenChildren(instance.children[name](options))
        } else {
            return []
        }
    } else {
        const res = instance.$slots[name] && instance.$slots[name](options)
        return flattenChildren(res)
    }
}

const getSlotContent = (instance: any, prop = 'default', options = instance, exec = true) => {
    let content = undefined
    if (instance.$) {
        const temp = instance[prop]
        if (temp !== undefined) {
            return typeof temp === 'function' && exec ? temp(options) : temp
        } else {
            content = instance.$slots[prop]
            content = content && exec ? content(options) : content
        }
    } else if (isVNode(instance)) {
        const temp = instance.props && instance.props[prop]
        if (temp !== undefined && instance.props !== null) {
            return typeof temp === 'function' && exec ? temp(options) : temp
        } else if (instance.type === Fragment) {
            content = instance.children
        } else if (instance.children && instance.children[prop]) {
            content = instance.children[prop]
            content = content && exec ? content(options) : content
        }
    }
    if (Array.isArray(content)) {
        content = flattenChildren(content)
        content = content.length === 1 ? content[0] : content
        content = content.length === 0 ? undefined : content
    }
    return content
}

const getPropSlot = (slots, props, prop = 'default') => {
    return props[prop] ?? slots[prop]?.()
}

const getPrefixCls = (suffixCls: string, prefixCls?: string, customizeCls?: string) => {
    if (customizeCls) return customizeCls
    return `${prefixCls ?? 'mi'}-${suffixCls}`
}

const pxToRem = (px: number) => {
    return Math.round((px / 16) * 100) / 100
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
    pxToRem
}
