import { defineComponent, isVNode, h } from 'vue'
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
        const getIcon = () => {
            const icon = props.item.meta?.icon ?? 'TagsFilled'
            return isVNode(icon) ? icon : h(icon)
        }
        const getTitle = () => {
            const text = props.item.meta?.title ?? $g.title
            let title: any = <span innerHTML={text} />
            if (!props.topLevel) {
                const subTitle = props.item.meta?.subTitle ?? null
                const subElem = subTitle ? <span class="sub" innerHTML={subTitle} /> : null
                title = (
                    <div class={`${prefixCls}-title`}>
                        <span innerHTML={props.hasTitle ? text : null} />
                        {subElem}
                    </div>
                )
            }
            return title
        }
        const getTag = () => {
            let tag: any = null
            if (props.item.meta?.tag && !props.topLevel) {
                if (props.item.meta.tag.content) {
                    tag = (
                        <Tag class={`${prefixCls}-tag`} color={props.item.meta.tag.color} v-html={props.item.meta.tag.content} />
                    )
                } else if (props.item.meta.tag.icon) {
                    const MiMenuItemTagIcon = isVNode(props.item.meta.tag.icon)
                        ? props.item.meta.tag.icon
                        : h(props.item.meta.tag.icon)
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
        return () => (
            <>
                {getIcon()}
                {getTitle()}
                {getTag()}
            </>
        )
    }
})
