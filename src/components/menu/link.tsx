import { defineComponent, isVNode } from 'vue'
import PropTypes from '../_utils/props-types'
import { getPrefixCls } from '../_utils/props-tools'
import * as Icon from '@ant-design/icons-vue'
import { $g } from '../../utils/global'
import { Tag } from 'ant-design-vue'

export const menuItemLinkProps = () => ({
    prefixCls: String,
    item: PropTypes.object,
    hasTitle: PropTypes.bool.def(true),
    topLevel: PropTypes.bool.def(false)
})

export default defineComponent({
    name: 'MiMenuItemLink',
    inheritAttrs: false,
    props: menuItemLinkProps(),
    setup(props) {
        const prefixCls = getPrefixCls('menu-item', props.prefixCls)
        const meta = props.item.meta
        const getIconElem = () => {
            const icon = meta && meta.icon ? meta.icon : 'TagsFilled'
            const MiMenuItemLinkIcon = isVNode(icon) ? icon : Icon[icon]
            return <MiMenuItemLinkIcon />
        }
        const getTitleElem = () => {
            const text = meta && meta.title ? meta.title : $g.title
            let title: any = <span innerHTML={text}></span>
            if (!props.topLevel) {
                const subTitle = meta && meta.subTitle ? meta.subTitle : null
                const subElem = subTitle ? <span class="sub" innerHTML={subTitle}></span> : null
                title = (
                    <div class={`${prefixCls}-title`}>
                        <span innerHTML={props.hasTitle ? text : null} />
                        {subElem}
                    </div>
                )
            }
            return title
        }
        const getTagElem = () => {
            let tag: any = null
            if (meta && meta.tag && !props.topLevel) {
                if (meta.tag.content) {
                    tag = (
                        <Tag class={`${prefixCls}-tag`} color={meta.tag.color}>
                            <template innerHTML={meta.tag.content} />
                        </Tag>
                    )
                } else if (meta.tag.icon) {
                    const MiMenuItemTagIcon = isVNode(meta.tag.icon)
                        ? meta.tag.icon
                        : Icon[meta.tag.icon]
                    tag = (
                        <MiMenuItemTagIcon
                            class={`${prefixCls}-icon`}
                            style={{
                                color: meta.tag.color,
                                marginRight: 0,
                                fontSize: `${meta.tag.size ?? 14}px`
                            }}
                        />
                    )
                }
            }
            return tag
        }
        return (
            <>
                {getIconElem}
                {getTitleElem}
                {getTagElem}
            </>
        )
    }
})
