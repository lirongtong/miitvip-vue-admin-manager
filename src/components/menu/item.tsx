import { defineComponent } from 'vue'
import PropTypes from '../_utils/props-types'
import { getPrefixCls } from '../_utils/props-tools'
import { Menu } from 'ant-design-vue'
import { RouterLink } from 'vue-router'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import MiMenuItemLink from './link'

export const menuItemProps = () => ({
    prefixCls: String,
    item: PropTypes.object,
    hasTitle: PropTypes.bool.def(true),
    topLevel: PropTypes.bool.def(false)
})

export default defineComponent({
    name: 'MiMenuItem',
    inheritAttrs: false,
    props: menuItemProps(),
    setup(props) {
        const prefixCls = getPrefixCls('menu-item', props.prefixCls)
        const key = $g.prefix + (props.item ? props.item.name : $tools.uid())
        const getMenuItemElem = () => {
            if (!$g.regExp.url.test(props.item.path)) {
                return (
                    <RouterLink to={props.item.path} class={`${prefixCls}-link`}>
                        <MiMenuItemLink {...props} />
                    </RouterLink>
                )
            } else {
                return (
                    <a
                        href={props.item.path}
                        target={props.item.meta.target ?? '_blank'}
                        class={`${prefixCls}-link`}>
                        <MiMenuItemLink {...props} />
                    </a>
                )
            }
        }
        return (
            <Menu.Item class={prefixCls} key={key}>
                {getMenuItemElem}
            </Menu.Item>
        )
    }
})
