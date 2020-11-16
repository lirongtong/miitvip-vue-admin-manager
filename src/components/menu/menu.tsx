import { defineComponent } from 'vue'
import { Menu } from 'ant-design-vue'
import PropTypes, { getSlotContent } from '../../utils/props'

export default defineComponent({
    name: 'MiMenu',
    props: {
        className: PropTypes.string
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('menu')
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        const cls = prefixCls + (this.className ? ` ${this.className}` : '')
        return (
            <Menu ref={prefixCls} theme="dark" mode="inline" class={cls}>
                <Menu.Item>Nice</Menu.Item>
            </Menu>
        )
    }
})