import { defineComponent } from 'vue'
import { AnchorLinkProps } from './props'
import { StarOutlined, TagOutlined } from '@ant-design/icons-vue'
import type { AnchorLinkItem } from '../../utils/types'
import applyTheme from '../_utils/theme'
import styled from './style/link.module.less'

const MiAnchorLink = defineComponent({
    name: 'MiAnchorLink',
    inheritAttrs: false,
    props: AnchorLinkProps(),
    emits: ['click'],
    setup(props, { emit }) {
        applyTheme(styled)

        const handleClick = (evt?: Event) => {
            emit(
                'click',
                {
                    id: props.id,
                    title: props.title
                } as AnchorLinkItem,
                evt
            )
        }

        return () => (
            <div
                class={`${styled.container}${props.active ? ` ${styled.active}` : ''}`}
                onClick={handleClick}>
                {props.active ? <StarOutlined /> : <TagOutlined />}
                <span class={styled.link} title={props.title} innerHTML={props.title} />
            </div>
        )
    }
})

export default MiAnchorLink
