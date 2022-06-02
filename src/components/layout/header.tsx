import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { Layout } from 'ant-design-vue'
import PropTypes from '../_utils/props-types'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import MiDropdown from '../dropdown'

export const layoutHeaderProps = () => ({
    prefixCls: String,
    stretch: PropTypes.any,
    notice: PropTypes.any,
    dropdown: PropTypes.any,
    extra: PropTypes.any
})

export default defineComponent({
    name: 'MiLayoutHeader',
    inheritAttrs: false,
    props: layoutHeaderProps(),
    slots: ['stretch', 'notice', 'dropdown', 'extra'],
    setup(props, { slots, attrs }) {
        const store = useStore()
        const collapsed = computed(() => store.getters['layout/collapsed'])
        const isMobile = computed(() => store.getters['layout/mobile'])
        const prefixCls = getPrefixCls('layout-header', props.prefixCls)
        const headerCls = {
            left: `${prefixCls}-left`,
            right: `${prefixCls}-right`,
            trigger: `${prefixCls}-trigger`,
            triggerMin: `${prefixCls}-trigger-min`
        }

        const getStretch = () => {
            let stretch = getPropSlot(slots, props, 'stretch')
            if (!stretch) {
                if (isMobile.value) stretch = <MenuUnfoldOutlined />
                else if (!collapsed.value) stretch = <MenuFoldOutlined />
                else stretch = <MenuUnfoldOutlined />
            }
            return stretch
        }

        return () => (
            <Layout.Header class={`${prefixCls}`} {...attrs}>
                <div class={headerCls.left}>
                    <div class={headerCls.trigger}>{getStretch()}</div>
                </div>
                <div class={headerCls.right}>
                    {getPropSlot(slots, props, 'extra')}
                    <div class={`${headerCls.trigger} ${headerCls.triggerMin}`}>
                        {getPropSlot(slots, props, 'dropdown') ?? <MiDropdown />}
                    </div>
                </div>
            </Layout.Header>
        )
    }
})
