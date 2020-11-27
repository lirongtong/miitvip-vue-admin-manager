import { defineComponent, computed } from 'vue'
import { Layout } from 'ant-design-vue'
import { useStore } from 'vuex'
import { MenuFoldOutlined, MenuUnfoldOutlined, ExpandOutlined } from '@ant-design/icons-vue'
import PropTypes, { getSlotContent } from '../../utils/props'
import { mutations } from '../../store/types'
import MiNotice from '../notice'
import MiDropdown from '../dropdown'

export default defineComponent({
    name: 'MiLayoutHeader',
    props: {
        className: PropTypes.string,
        notice: PropTypes.any,
        dropdown: PropTypes.any,
        stretchIcon: PropTypes.any
    },
    setup() {
        const store = useStore()
        const collapsed = computed(() => store.getters['layout/collapsed'])
        return {collapsed, store}
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('layout-header')
        },
        getStretchIcon() {
            let icon = getSlotContent(this, 'stretchIcon')
            if (icon === undefined) {
                if (this.$g.mobile) icon = <MenuUnfoldOutlined />
                else if (!this.collapsed) icon = <MenuFoldOutlined />
                else icon = <MenuUnfoldOutlined />
            }
            return icon
        },
        getDefaultScreenIcon() {
            let screen = <ExpandOutlined></ExpandOutlined>
            if (this.$g.mobile) screen = null
            return screen
        },
        getFoldElem() {},
        getNoticeElem() {
            const prefixCls = this.getPrefixCls()
            const notice = getSlotContent(this, 'notice')
            return (notice ?? <MiNotice class={`${prefixCls}-notice`}></MiNotice>)
        },
        getDropdownElem() {
            const dropdown = getSlotContent(this, 'dropdown')
            return (dropdown ?? <MiDropdown></MiDropdown>)
        },
        setCollapsed() {
            if (this.$g.mobile) {
                this.$g.menus.drawer = !this.$g.menus.drawer
            } else {
                const collapse = !this.collapsed
                this.$g.menus.collapsed = collapse
                this.store.commit(`layout/${mutations.layout.collapsed}`, collapse)
            }
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        const headerCls = {
            left: `${prefixCls}-left`,
            right: `${prefixCls}-right`,
            trigger: `${prefixCls}-trigger`,
            triggerMin: `${prefixCls}-trigger-min`
        }
        const triggerCls = `${headerCls.trigger} ${headerCls.triggerMin}`
        return (
            <Layout.Header class={`${prefixCls} ${this.className ?? ''}`}>
                <div class={headerCls.left}>
                    <div class={headerCls.trigger} onClick={this.setCollapsed}>
                        { this.getStretchIcon() }
                    </div>
                </div>
                <div class={headerCls.right}>
                    <div class={triggerCls}>{ this.getDefaultScreenIcon() }</div>
                    <div class={triggerCls}>{ this.getNoticeElem() }</div>
                    <div class={triggerCls}>{ this.getDropdownElem() }</div>
                </div>
            </Layout.Header>
        )
    }
})
