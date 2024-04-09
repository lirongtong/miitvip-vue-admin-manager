import { defineComponent, ref } from 'vue'
import { CodeProps } from './props'
import { getPropSlot } from '../_utils/props'
import { Tooltip } from 'ant-design-vue'
import { CopyOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import useClipboard from 'vue-clipboard3'
import MiCodeDemo from './Demo'
import applyTheme from '../_utils/theme'
import styled from './style/code.module.less'
import 'prismjs/themes/prism-tomorrow.css'

const MiCode = defineComponent({
    name: 'MiCode',
    inheritAttrs: false,
    props: CodeProps(),
    setup(props, { slots }) {
        const { t } = useI18n()
        const { toClipboard } = useClipboard()
        const copied = ref<boolean>(false)
        applyTheme(styled)

        const handleCopy = async () => {
            await toClipboard(props.content)
                .then(() => {
                    copied.value = true
                    setTimeout(() => (copied.value = false), 3000)
                })
                .catch(() => (copied.value = false))
        }

        return () => {
            const content = getPropSlot(slots, props, 'content') ?? null
            return (
                <div class={styled.container}>
                    <pre v-prism>
                        <div class={styled.title}>
                            <span class={styled.titleDotRed} />
                            <span class={styled.titleDotOrange} />
                            <span class={styled.titleDotGreen} />
                        </div>
                        <code class={`${styled.content} language-${props.language}`}>
                            {content}
                        </code>
                    </pre>
                    {props.canCopy && content ? (
                        <Tooltip
                            title={copied.value ? t('code.copied') : t('code.copy')}
                            overlayStyle={{ zIndex: Date.now() }}>
                            <div class={styled.copy} onClick={handleCopy}>
                                <CopyOutlined />
                            </div>
                        </Tooltip>
                    ) : null}
                </div>
            )
        }
    }
})

MiCode.Demo = MiCodeDemo
export default MiCode as typeof MiCode & {
    readonly Demo: typeof MiCodeDemo
}
