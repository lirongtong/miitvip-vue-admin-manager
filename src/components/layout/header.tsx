import { defineComponent } from 'vue'
import { Layout } from 'ant-design-vue'
import { MenuFoldOutlined, MenuUnfoldOutlined, ExpandOutlined } from '@ant-design/icons-vue'
import PropTypes, { getSlotContent } from '../../utils/props'
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
    methods: {
        getStretchIcon() {
            let icon = getSlotContent(this, 'stretchIcon')
            if (icon === undefined) icon = (<MenuUnfoldOutlined></MenuUnfoldOutlined>)
            if (this.$g.mobile) icon = (<MenuFoldOutlined></MenuFoldOutlined>)
            return icon
        },
        getDefaultScreenIcon() {
            let screen = (<ExpandOutlined></ExpandOutlined>)
            if (this.$g.mobile) screen = null
            return screen
        },
        getFoldElem() {},
        getNoticeElem() {},
        getDropdownElem() {}
    },
    render() {
        const prefixCls = this.$tools.getPrefixCls('layout-header')
        const headerCls = {
            left: `${prefixCls}-left`,
            right: `${prefixCls}-right`,
            trigger: `${prefixCls}-trigger`,
            triggerMin: `${prefixCls}-trigger-min`
        }
        const triggerCls = `${headerCls.trigger} ${headerCls.triggerMin}`
        return (
            <Layout.Header class={`${prefixCls} ${this.className ?? ''}`}>
                { () => (
                    <>
                        <div class={headerCls.left}>
                            <div class={headerCls.trigger}>{ this.getStretchIcon() }</div>
                        </div>
                        <div class={headerCls.right}>
                            <div class={triggerCls}>{ this.getDefaultScreenIcon() }</div>
                            <div class={triggerCls}><MiNotice></MiNotice></div>
                            <div class={triggerCls}><MiDropdown></MiDropdown></div>
                        </div>
                    </>
                ) }
            </Layout.Header>
        )
    }
})
