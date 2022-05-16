import { defineComponent, isVNode, h, resolveComponent } from 'vue'
import PropTypes from '../_utils/props-types'
import { getPrefixCls } from '../_utils/props-tools'
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
        const getIconElem = () => {
            const icon =
                props.item.meta && props.item.meta.icon ? props.item.meta.icon : 'TagsFilled'
            return isVNode(icon) ? icon : h(resolveComponent(icon))
        }
        const getTitleElem = () => {
            const text = props.item.meta && props.item.meta.title ? props.item.meta.title : $g.title
            let title: any = <span innerHTML={text}></span>
            if (!props.topLevel) {
                const subTitle =
                    props.item.meta && props.item.meta.subTitle ? props.item.meta.subTitle : null
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
            if (props.item.meta && props.item.meta.tag && !props.topLevel) {
                if (props.item.meta.tag.content) {
                    tag = (
                        <Tag class={`${prefixCls}-tag`} color={props.item.meta.tag.color}>
                            <template innerHTML={props.item.meta.tag.content} />
                        </Tag>
                    )
                } else if (props.item.meta.tag.icon) {
                    const MiMenuItemTagIcon = isVNode(props.item.meta.tag.icon)
                        ? props.item.meta.tag.icon
                        : h(resolveComponent(props.item.meta.tag.icon))
                    tag = (
                        <MiMenuItemTagIcon
                            class={`${prefixCls}-icon`}
                            style={{
                                color: props.item.meta.tag.color,
                                marginRight: 0,
                                fontSize: `${props.item.meta.tag.size ?? 14}px`
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
