import { defineComponent, isVNode, h } from 'vue'
import { DropdownItemProps } from './props'
import { $tools } from '../../utils/tools'
import applyTheme from '../_utils/theme'
import styled from './style/item.module.less'

const MiDropdownItem = defineComponent({
    name: 'MiDropdownItem',
    inheritAttrs: false,
    props: DropdownItemProps(),
    setup(props) {
        applyTheme(styled)

        const icon = props.item?.icon
        const fontSize = $tools.convert2rem($tools.distinguishSize(props.item?.fontSize))
        const iconSize = $tools.convert2rem($tools.distinguishSize(props.item?.iconSize))
        let tag: any = null
        if (props.item?.tag) {
            if (props.item.tag?.content) {
                tag = <span class={styled.tag} innerHTML={props.item.tag.content} />
            } else if (props.item.tag?.icon) {
                tag = (
                    <div
                        class={styled.icon}
                        style={{
                            color: props.item.tag?.color ?? null,
                            fontSize: $tools.convert2rem(
                                $tools.distinguishSize(props.item.tag?.size)
                            )
                        }}>
                        {isVNode(props.item.tag.icon)
                            ? props.item.tag.icon
                            : h(props.item.tag.icon)}
                    </div>
                )
            }
        }

        return () => (
            <div class={styled.container}>
                <div style={{ fontSize: iconSize }}>
                    {icon ? (isVNode(icon) ? icon : h(icon)) : null}
                </div>
                {props.item?.title ? (
                    <div class={styled.title} style={{ fontSize }} innerHTML={props.item.title} />
                ) : null}
                {tag}
            </div>
        )
    }
})

export default MiDropdownItem
