import { defineComponent, Transition } from 'vue'
import { Layout } from 'ant-design-vue'
import { RouterView } from 'vue-router'
import { getPrefixCls } from '../_utils/props-tools'
import PropTypes from '../_utils/props-types'

export default defineComponent({
    name: 'MiLayoutContent',
    inheritAttrs: false,
    props: {
        prefixCls: String,
        animName: PropTypes.string.def('anim-slide')
    },
    setup(props) {
        const prefixCls = getPrefixCls('layout-content', props.prefixCls)
        const animation = getPrefixCls(props.animName)
        return () => (
            <Layout.Content class={prefixCls}>
                <div class={`${prefixCls}-custom`}>
                    <Transition name={animation}>
                        <RouterView />
                    </Transition>
                </div>
            </Layout.Content>
        )
    }
})
