import { defineComponent, isVNode, h } from 'vue'
import PropTypes from '../_utils/props-types'
import { getPrefixCls } from '../_utils/props-tools'

export default defineComponent({
    name: 'MiDropdownItem',
    inheritAttrs: false,
    props: {
        prefixCls: String,
        item: PropTypes.object.isRequired
    },
    setup(props) {
        const prefixCls = getPrefixCls('dropdown', props.prefixCls)

        const icon = props.item.icon ? (
            isVNode(props.item.icon)
                ? props.item.icon
                : h(props.item.icon)
        ) : null
        
        let tag: any = null
        if (props.item.tag) {
            if (props.item.tag.content) {
                tag = (
                    <span class={`${prefixCls}-tag`}>
                        {props.item.tag.content}
                    </span>
                )
            } else if (props.item.tag.icon) {
                tag = (
                    <div class={`${prefixCls}-icon`} style={{color: props.item.tag.color ?? null}}>
                        {
                            isVNode(props.item.tag.icon) 
                                ? props.item.tag.icon
                                : h(props.item.tag.icon)
                        }
                    </div>
                )
            }
        }

        return (
            <>
                <div style={props.item.fontSize
                        ? {fontSize: `${props.item.fontSize}px`}
                        : null}>
                    {icon}
                </div>
                {props.item.title ? (
                    <span class={`${prefixCls}-title`} innerHTML={props.item.title}></span>
                ) : null}
                {tag}
            </>
        )
    }
})