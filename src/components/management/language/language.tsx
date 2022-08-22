import { defineComponent, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPrefixCls } from '../../../components/_utils/props-tools'
import PropTypes from '../../../components/_utils/props-types'

export default defineComponent({
    name: 'MiLanguageManagement',
    inheritAttrs: false,
    props: {
        prefixCls: PropTypes.string
    },
    setup(props) {
        const { t } = useI18n()
        const prefixCls = getPrefixCls('language', props.prefixCls)
        const params = reactive({
            pagination: {
                page: 1,
                size: 10
            }
        })
        return () => (
            <div class={prefixCls}>
                <div class={`${prefixCls}-content`}></div>
            </div>
        )
    }
})
