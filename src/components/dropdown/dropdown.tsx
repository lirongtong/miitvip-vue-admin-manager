import { defineComponent, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useStore } from 'vuex'
import { Dropdown, Avatar, Menu } from 'ant-design-vue'
import PropTypes from '../_utils/props-types'
import { getPropSlot, getPrefixCls, tuple } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import MiDropdownItem from './item'
import { mutations } from '../../store/types'

export const dropdownProps = () => ({
    prefixCls: PropTypes.string,
    title: PropTypes.any,
    placement: PropTypes.oneOf(
        tuple('bottom', 'top', 'bottomLeft', 'bottomRight', 'topLeft', 'topRight')
    ).def('bottom'),
    trigger: PropTypes.oneOf(tuple('click', 'hover')).def('click'),
    items: PropTypes.array,
    overlay: PropTypes.any
})

export default defineComponent({
    name: 'MiDropdown',
    inheritAttrs: false,
    props: dropdownProps(),
    slots: ['title', 'overlay'],
    emits: ['update:visible', 'visibleChange'],
    setup(props, { slots, attrs, emit }) {
        const store = useStore()
        const route = useRoute()
        const prefixCls = getPrefixCls('dropdown', props.prefixCls)

        watch(route, () => {
            const active = [$g.prefix + String(route.name)]
            $g.menus.active = active
            store.commit(`layout/${mutations.layout.active}`, active)
        })

        const getDropdownMenu = () => {
            const items = props.items ?? $g.menus.dropdown
            const links = []
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
                        <a onClick={(e) => (item.callback ? item.callback.call(e) : e)}>
                            <MiDropdownItem item={item} />
                        </a>
                    )
                }
                links.push(<Menu.Item key={$g.prefix + item.name}>{link}</Menu.Item>)
            })
            return links
        }

        const getTitle = () => {
            return (
                getPropSlot(slots, props, 'title') ?? (
                    <div class={prefixCls}>
                        <Avatar
                            class={`${prefixCls}-avatar`}
                            src={$g.avatar}
                            alt={$g.powered}
                            size="small"
                        />
                        <span class={`${prefixCls}-name`}>{$g.userInfo.nickname ?? $g.author}</span>
                    </div>
                )
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
                onVisibleChange={updateVisible}
                {...attrs}>
                {getTitle}
            </Dropdown>
        )
    }
})
