import { defineComponent } from 'vue'
import { Menu } from 'ant-design-vue'
import { RouterLink } from 'vue-router'
import PropTypes from '../../utils/props'
import MiMenuItemLink from './link'

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
            let link: any = null
            if (!this.$g.regExp.url.test(this.item.path)) {
                link = (
                    <RouterLink
                        to={this.item.path}
                        class={`${prefixCls}-link`}>
                        <MiMenuItemLink
                            item={this.item}
                            top={this.top}
                            title={this.title}>
                        </MiMenuItemLink>
                    </RouterLink>
                )
            } else {
                link = (
                    <a href={this.item.path}
                        class={`${prefixCls}-link`}
                        target={this.item.meta.target ?? '_blank'}>
                        <MiMenuItemLink
                            item={this.item}
                            top={this.top}
                            title={this.title}>
                        </MiMenuItemLink>
                    </a>
                )
            }
            return link
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        const key = this.$g.prefix + (this.item ? this.item.name : this.$tools.uid())
        return (
            <Menu.Item class={prefixCls} key={key}>
                { this.getMenuItemElem() }
            </Menu.Item>
        )
    }
})