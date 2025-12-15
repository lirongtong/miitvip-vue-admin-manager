import { SlotsType, defineComponent, ref } from 'vue'
import { LinkProps } from './props'
import { Row } from 'ant-design-vue'
import { $tools } from '../../utils/tools'
import { RouterLink } from 'vue-router'
import applyTheme from '../_utils/theme'
import styled from './style/link.module.less'

const MiLink = defineComponent({
    name: 'MiLink',
    inheritAttrs: false,
    slots: Object as SlotsType<{ default: any }>,
    props: LinkProps(),
    setup(props, { slots, attrs }) {
        applyTheme(styled)

        const getUrl = () => {
            const path = props.path || ''
            const query = (props.query || {}) as Record<string, any>
            const entries = Object.entries(query).filter(
                ([k, v]) => k && typeof v !== 'undefined' && v !== null && v !== ''
            )
            if (entries.length <= 0) return path
            const search = entries
                .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
                .join('&')
            const join = path.includes('?') ? '&' : '?'
            return `${path}${join}${search}`
        }

        const renderPath = () => {
            const link = ref<any>()
            if (props.type === 'email') {
                if ($tools.isEmail(props.path)) {
                    link.value = (
                        <a
                            href={`mailto:${props.path}`}
                            type="email"
                            class={styled.email}
                            innerHTML={props.path}
                        />
                    )
                } else link.value = <a>{slots?.default?.() ?? props.path}</a>
            } else {
                if (props.path) {
                    if ($tools.isUrl(props.path)) {
                        link.value = (
                            <a href={getUrl()} target={props.target || '_blank'}>
                                {slots?.default()}
                            </a>
                        )
                    } else {
                        link.value = (
                            <RouterLink
                                to={{ path: props.path, query: props.query }}
                                target={props.target || '_self'}>
                                {slots?.default()}
                            </RouterLink>
                        )
                    }
                } else link.value = <a>{slots?.default()}</a>
            }
            return link.value
        }

        return () => (
            <Row
                class={`${styled.container}${props?.vertical ? ` ${styled.vertical}` : ''}`}
                {...attrs}>
                {renderPath()}
            </Row>
        )
    }
})

export default MiLink
