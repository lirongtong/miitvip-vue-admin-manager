import { defineComponent } from 'vue'
import { Menu } from 'ant-design-vue'

const MiSubMenu = defineComponent({
    name: 'MiSubMenu',
    inheritAttrs: false,
    setup() {
        const getSubmenuItem = () => {}
        return () => <Menu.SubMenu>{getSubmenuItem()}</Menu.SubMenu>
    }
})

export default MiSubMenu
