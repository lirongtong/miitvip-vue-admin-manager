import { defineComponent, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useStore } from 'vuex'
import { Dropdown, Avatar, Menu } from 'ant-design-vue'
import PropTypes, { getSlotContent } from '../../utils/props'
import MiDropdownItem from './item'
import { mutations } from '../../store/types'

export default defineComponent({
    name: 'MiDropdown',
    props: {
        title: PropTypes.any,
        placement: PropTypes.string.def('bottomCenter'),
        items: PropTypes.array,
        overlay: PropTypes.any
    },
    setup() {
        const store = useStore()
        const menus = reactive([])
        const visible = ref(false)
        return { store, menus, visible }
    },
    watch: {
        $route: function() {
            const active = this.$g.prefix + this.$route.name
            this.$g.menus.active = [active]
            this.store.commit(`layout/${mutations.layout.active}`, [active])
        }
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('layout-header-dropdown')
        },
        getItemElem() {
            const items = this.items ?? this.$g.menus.dropdown
            const links = []
            for (let i = 0, l = items.length; i < l; i++) {
                const item = items[i]
                let link: any = null
                if (item.path) {
                    if (!this.$g.regExp.url.test(item.path)) {
                        link = (
                            <RouterLink to={{path: item.path}}>
                                <MiDropdownItem item={item}></MiDropdownItem>
                            </RouterLink>
                        )
                    } else {
                        link = (
                            <a href={item.path} target="_blank">
                                <MiDropdownItem item={item}></MiDropdownItem>
                            </a>
                        )
                    }
                } else {
                    link = (
                        <a onClick={(e) => item.callback ? item.callback.call(this, e) : e}>
                            <MiDropdownItem item={item}></MiDropdownItem>
                        </a>
                    )
                }
                links.push(
                    <Menu.Item key={this.$g.prefix + item.name}>
                        { link }
                    </Menu.Item>
                )
            }
            return links
        },
        getOverlayElem() {
            let overlay = this.$slots.default
            if (!overlay) {
                overlay = (
                    <Menu theme="dark">
                        { this.getItemElem() }
                    </Menu>
                )
            }
            return overlay
        },
        handleUpdateVisible() {
            this.visible = !this.visible
        }
    },
    render() {
        const getPrefixCls = this.getPrefixCls()
        let title = getSlotContent(this, 'title')
        if (!title) {
            title = (
                <div class={getPrefixCls}>
                    <Avatar class="avatar" src={this.$g.avatar} alt={this.$g.powered} size="small" />
                    <span class="name">{ this.$g.userInfo.nickname ?? this.$g.author }</span>
                </div>
            )
        }
        return (
            <Dropdown
                placement={this.placement}
                visible={this.visible}
                onVisibleChange={this.handleUpdateVisible}
                trigger={['click']}
                overlay={ this.getOverlayElem() }>
                { title }
            </Dropdown>
        )
    }
})