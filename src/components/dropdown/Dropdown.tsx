import { SlotsType, defineComponent } from 'vue'
import { DropdownProps } from './props'
import { Dropdown, Avatar, Menu } from 'ant-design-vue'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { __LOGO__ } from '../../utils/images'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { DropdownItem } from '../../utils/types'
import MiLink from '../link/Link'
import MiDropdownItem from './Item'
import applyTheme from '../_utils/theme'
import styled from './style/dropdown.module.less'

const MiDropdown = defineComponent({
    name: 'MiDropdown',
    inheritAttrs: false,
    props: DropdownProps(),
    slots: Object as SlotsType<{
        title: any
        overlay: any
    }>,
    setup(props, { slots }) {
        applyTheme(styled)

        const handleOpenChange = () => {}

        const renderDropdownMenu = () => {
            const items = props.items || []
            const links: any[] = []
            items.forEach((item: Partial<DropdownItem>) => {
                let link = (
                    <MiLink
                        path={item?.path}
                        query={item?.query}
                        target={item?.target || '_self'}
                        onClick={item?.callback ? (evt: Event) => item.callback(evt) : undefined}>
                        <MiDropdownItem item={item} />
                    </MiLink>
                )
                const name = getPrefixCls(item.name || $tools.uid())
                links.push(<Menu.Item key={name}>{link}</Menu.Item>)
            })
            return links
        }

        const renderOverlay = () => {
            return getPropSlot(slots, props, 'overlay') ?? <Menu>{...renderDropdownMenu()}</Menu>
        }

        const renderTitle = () => {
            const title = getPropSlot(slots, props, 'title')
            return title ? (
                <div class={styled.title}>{title}</div>
            ) : (
                <div class={styled.avatar}>
                    <Avatar src={$g?.logo || __LOGO__} size="small" alt={$g?.powered} />
                </div>
            )
        }

        return () => (
            <Dropdown
                placement={props.placement}
                trigger={props.trigger}
                overlay={renderOverlay()}
                overlayClassName={styled.container}
                onOpenChange={handleOpenChange}>
                {renderTitle()}
            </Dropdown>
        )
    }
})

MiDropdown.Item = MiDropdownItem
export default MiDropdown as typeof MiDropdown & {
    readonly Item: typeof MiDropdownItem
}
