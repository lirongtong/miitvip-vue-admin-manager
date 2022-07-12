import { defineComponent, h, VNode } from 'vue'
import PropTypes from '../_utils/props-types'
import { tuple } from '../_utils/props-tools'

export const searchKeyProps = () => ({
    prefixCls: PropTypes.string,
    name: PropTypes.string.isRequired,
    tag: PropTypes.string.def('span'),
    type: PropTypes.oneOf(tuple('text', 'image', 'link')).def('text'),
    data: PropTypes.any
})

export default defineComponent({
    name: 'MiSearchKey',
    inheritAttrs: false,
    props: searchKeyProps(),
    setup(props) {
        let elem: VNode | null = null
        switch (props.type) {
            case 'text':
                elem = h(<props.tag innerHTML={props.data as any} />)
                break
            case 'image':
                elem = h(<props.tag src={props.data as any} alt={props.name as any} />)
                break
            case 'link':
                elem = h(<props.tag href={props.data as any} innerHTML={props.data as any} />)
                break
            default:
                elem = h(<props.tag innerHTML={props.data as any} />)
                break
        }
        return props.data ? () => elem : null
    }
})
