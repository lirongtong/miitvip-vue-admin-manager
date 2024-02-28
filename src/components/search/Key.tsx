import { VNode, defineComponent, h } from 'vue'
import { SearchKeyProps } from './props'
import MiLink from '../link'

const MiSearchKey = defineComponent({
    name: 'MiSearchKey',
    inheritAttrs: false,
    props: SearchKeyProps(),
    setup(props) {
        let elem: VNode | null = null
        switch (props.type) {
            case 'text':
                elem = h(<props.tag innerHTML={props.content} />)
                break
            case 'image':
                elem = h(<img src={props.content} alt={props.name} />)
                break
            case 'link':
                elem = <MiLink link={props.content}>{props.content}</MiLink>
                break
            default:
                elem = h(<props.tag innerHTML={props.content} />)
                break
        }
        const content = props.content ? elem : null
        return () => content
    }
})

export default MiSearchKey
