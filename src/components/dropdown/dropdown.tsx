import { defineComponent, watch, PropType, SlotsType } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useStore } from 'vuex'
import type { Trigger } from 'ant-design-vue/lib/dropdown/props'
import { Dropdown, Avatar, Menu } from 'ant-design-vue'
import PropTypes from '../_utils/props-types'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import MiDropdownItem from './item'
import { mutations } from '../../store/types'

export const dropdownProps = () => ({
    prefixCls: PropTypes.string,
    title: PropTypes.any,
    placement: {
        type: String as PropType<
            | 'bottom'
            | 'top'
            | 'bottomLeft'
            | 'bottomRight'
            | 'topLeft'
            | 'topRight'
            | 'topCenter'
            | 'bottomCenter'
        >,
        default: 'bottom'
    },
    trigger: {
        type: String as PropType<Trigger>,
        default: 'click'
    },
    items: PropTypes.array,
    overlay: PropTypes.any
})

const MiDropdown = defineComponent({
    name: 'MiDropdown',
    inheritAttrs: false,
    props: dropdownProps(),
    slots: Object as SlotsType<{
        title: any
        overlay: any
    }>,
    emits: ['update:visible', 'visibleChange'],
    setup(props, { slots, emit }) {
        const store = useStore()
        const route = useRoute()
        const prefixCls = getPrefixCls('dropdown', props.prefixCls)

        watch(route, () => {
            const active = [$g.prefix + String(route.name)] as any[]
            $g.menus.active = active
            store.commit(`layout/${mutations.layout.active}`, active)
        })

        const getDropdownMenu = () => {
            const items = props.items ?? $g.menus.dropdown
            const links: any[] = []
            items?.forEach((item: any) => {
                let link: any = null
                if (item.path) {
                    if (!$g.regExp.url.test(item.path)) {
                        link = (
                            <RouterLink to={{ path: item.path }}>
                                <MiDropdownItem item={item} />
                            </RouterLink>
                        )
                    } else {
                        link = (
                            <a href={item.path} target="_blank">
                                <MiDropdownItem item={item} />
                            </a>
                        )
                    }
                } else {
                    link = (
                        <a onClick={item.callback ? (evt) => item.callback(evt) : undefined}>
                            <MiDropdownItem item={item} />
                        </a>
                    )
                }
                links.push(<Menu.Item key={$g.prefix + item.name}>{link}</Menu.Item>)
            })
            return links
        }

        const getTitle = () => {
            const title = getPropSlot(slots, props, 'title')
            return title ? (
                <div class={prefixCls}>{title}</div>
            ) : (
                <div class={prefixCls}>
                    <Avatar
                        class={`${prefixCls}-avatar`}
                        src={$g.avatar}
                        alt={$g.powered}
                        size="small"
                    />
                </div>
            )
        }

        const getOverlay = () => {
            return (
                getPropSlot(slots, props, 'overlay') ?? <Menu theme="dark">{getDropdownMenu}</Menu>
            )
        }

        const updateVisible = (val: boolean) => {
            emit('update:visible', val)
            emit('visibleChange', val)
        }

        return () => (
            <Dropdown
                placement={props.placement}
                trigger={[props.trigger]}
                overlay={getOverlay()}
                overlayClassName={`${prefixCls}-menu`}
                onVisibleChange={updateVisible}>
                {getTitle}
            </Dropdown>
        )
    }
})

MiDropdown.Item = MiDropdownItem

export default MiDropdown as typeof MiDropdown & {
    readonly Item: typeof MiDropdownItem
}
