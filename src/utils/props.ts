import { isVNode, Fragment, Comment, Text, CSSProperties } from 'vue'
import { createTypes, VueTypesInterface, VueTypeValidableDef } from 'vue-types'
import { $tools } from './tools'

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

const PropTypes = createTypes({
    func: undefined,
    bool: undefined,
    string: undefined,
    number: undefined,
    array: undefined,
    object: undefined
})

PropTypes.extend([
    {
        name: 'style',
        type: [String, Object],
        getter: true,
        default: undefined
    }
])

export { getSlot, getSlotContent }

export default PropTypes as VueTypesInterface & {
    readonly style: VueTypeValidableDef<CSSProperties>
}
