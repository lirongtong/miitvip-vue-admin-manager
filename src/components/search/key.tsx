import { defineComponent, h } from 'vue'
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
        const elem = props.type === 'text'
            ? h(<props.tag innerHTML={props.data} key={props.name} />)
            : props.type === 'image'
                ? h(<props.tag src={props.data} key={props.name} />)
                : props.type === 'link'
                    ? h(<props.tag href={props.data} innerHTML={props.data} key={props.name} />)
                    : h(<props.tag innerHTML={props.data} key={props.name} />)
        return props.data ? elem : null
    }
})