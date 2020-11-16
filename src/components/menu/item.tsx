import { defineComponent } from 'vue'
import { Menu } from 'ant-design-vue'
import PropTypes from '../../utils/props'
import { $g } from '../../utils/config'
import { $tools } from '../../utils/tools'

export default defineComponent({
    name: 'MiMenuItem',
    props: {
        item: PropTypes.object,
        title: PropTypes.bool.def(true),
        top: PropTypes.bool.def(false)
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('menu-item')
        },
        getMenuItemElem() {
            const prefixCls = this.getPrefixCls()
            let link
            if (!$g.regExp.url.test(this.item.path)) {

            } else {
                link = (
                    <a class={`${prefixCls}-link`} target={this.item.meta.target ?? '_blank'}>
                        
                    </a>
                )
            }
            return link
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        return (
            <Menu.Item class={prefixCls} key={$g.prefix + (this.item ? this.item.name : $tools.uid())}>
                { () => this.getMenuItemElem() }
            </Menu.Item>
        )
    }
})