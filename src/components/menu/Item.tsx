import { defineComponent, ref } from 'vue'
import { MenuItemProps } from './props'
import { Menu } from 'ant-design-vue'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import MiMenuTitle from './Title'
import applyTheme from '../_utils/theme'
import styled from './style/item.module.less'

const MiMenuItem = defineComponent({
    name: 'MiMenuItem',
    inheritAttrs: false,
    props: MenuItemProps(),
    setup(props) {
        applyTheme(styled)

        const key = ref<string>(($g.prefix || 'mi-') + (props?.item?.name || $tools.uid()))

        const renderMenuItem = () => {}

        return () => (
            <Menu.Item class={styled.container} key={key}>
                {renderMenuItem()}
            </Menu.Item>
        )
    }
})

export default MiMenuItem
