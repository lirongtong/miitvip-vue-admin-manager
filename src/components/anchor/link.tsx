import { defineComponent } from 'vue'
import { TagOutlined, StarOutlined } from '@ant-design/icons-vue'
import PropTypes from '../_utils/props-types'
import { AnchorLinkItem } from './anchor'
import { getPrefixCls } from '../_utils/props-tools'
import { $tools } from '../../utils/tools'

export const anchorLinkProps = () => ({
    prefixCls: PropTypes.string,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    active: PropTypes.bool.def(false),
    offset: PropTypes.number.def(80),
    reserveOffset: PropTypes.number
})

export default defineComponent({
    name: 'MiAnchorLink',
    inheritAttrs: false,
    emits: ['click'],
    props: anchorLinkProps(),
    setup(props, {emit}) {
        const prefixCls = getPrefixCls('anchor-link', props.prefixCls)

        const handleClick = (evt: Event) => {
            const elem = document.getElementById(props.id)
            if (elem) {
                const top = $tools.getElementActualTopOrLeft(elem) - props.offset
                const pos = document.documentElement.scrollTop || document.body.scrollTop
                $tools.scrollTop(document.body, pos, top - (props.reserveOffset ?? 0))
            }
            emit('click', {
                id: props.id,
                title: props.title,
                elem: evt
            } as AnchorLinkItem)
        }

        return () => (
            <div class={`${prefixCls}${props.active ? ` ${prefixCls}-active` : ''}`}
                onClick={handleClick}>
                {props.active ? <StarOutlined /> : <TagOutlined />}
                <a class={`${prefixCls}-title`} title={props.title}>
                    {props.title}
                </a>
            </div>
        )
    }
})