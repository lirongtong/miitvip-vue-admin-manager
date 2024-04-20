import { SlotsType, VNode, VNodeTypes, createVNode, defineComponent, h, isVNode } from 'vue'
import { SearchKeyProps } from './props'
import MiLink from '../link/Link'
import { getPropSlot } from '../_utils/props'

const MiSearchKey = defineComponent({
    name: 'MiSearchKey',
    inheritAttrs: false,
    props: SearchKeyProps(),
    slots: Object as SlotsType<{
        default: VNodeTypes
        content: VNodeTypes
    }>,
    setup(props, { slots }) {
        let elem: VNode | null = null
        const contentSlot = getPropSlot(slots, props, 'content')
        const handleContentElem = () => {
            return contentSlot
                ? isVNode(contentSlot)
                    ? contentSlot
                    : typeof contentSlot === 'function'
                      ? createVNode(contentSlot)
                      : 'other'
                : null
        }
        const content = handleContentElem()
        switch (props.type) {
            case 'text':
            default:
                if (content) {
                    if (content === 'other') {
                        if (Array.isArray(contentSlot)) {
                            elem = h(<props.tag innerHTML={contentSlot.join('<br />')} />)
                        } else elem = h(<props.tag innerHTML={contentSlot} />)
                    } else elem = content
                }
                break
            case 'image':
                if (content) {
                    if (content === 'other') {
                        elem = h(<img src={contentSlot} alt={props.name} />)
                    } else elem = content
                }
                break
            case 'link':
                if (content) {
                    if (content === 'other') {
                        elem = <MiLink link={props.content}>{props.content}</MiLink>
                    } else elem = content
                }
                break
        }
        return () => elem
    }
})

export default MiSearchKey
