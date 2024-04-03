import { SlotsType, Transition, defineComponent, ref } from 'vue'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { CodeDemoProps } from './props'
import { useI18n } from 'vue-i18n'
import { Divider, Tooltip } from 'ant-design-vue'
import { CodeOutlined, CopyOutlined } from '@ant-design/icons-vue'
import useClipboard from 'vue-clipboard3'
import MiCode from './Code'
import applyTheme from '../_utils/theme'
import styled from './style/demo.module.less'

const MiCodeDemo = defineComponent({
    name: 'MiCodeDemo',
    inheritAttrs: false,
    props: CodeDemoProps(),
    slots: Object as SlotsType<{
        effect: any
    }>,
    setup(props, { slots }) {
        const { t } = useI18n()
        const { toClipboard } = useClipboard()
        const open = ref<boolean>(false)
        const copied = ref<boolean>(false)
        const anim = getPrefixCls(`anim-${props.animation}`)
        applyTheme(styled)

        const handleCopy = async () => {
            await toClipboard(props.code)
                .then(() => {
                    copied.value = true
                    setTimeout(() => (copied.value = false), 3000)
                })
                .catch(() => (copied.value = false))
        }

        return () => (
            <div class={styled.container}>
                <div class={styled.inner}>
                    <div class={styled.result}>{getPropSlot(slots, props, 'effect')}</div>
                    <div class={styled.info}>
                        {props.title ? (
                            <Divider {...props.titleSetting}>
                                <h4 innerHTML={props.title} />
                            </Divider>
                        ) : null}
                        {props.summary ? (
                            <>
                                <div class={styled.infoSummary} innerHTML={props.summary} />
                                <Divider dashed={true} />
                            </>
                        ) : null}
                    </div>
                    {props.code ? (
                        <>
                            <div
                                class={[
                                    styled.icons,
                                    { [styled.marginTop]: !props.title && !props.summary }
                                ]}>
                                <Tooltip
                                    title={copied.value ? t('code.copied') : t('code.copy')}
                                    overlayStyle={{ zIndex: Date.now() }}>
                                    <CopyOutlined onClick={handleCopy} />
                                </Tooltip>
                                <Tooltip title={t('code.show')} style={{ zIndex: Date.now() }}>
                                    <CodeOutlined onClick={() => (open.value = !open.value)} />
                                </Tooltip>
                            </div>
                            <Transition name={anim} appear={true}>
                                <div class={styled.code} v-show={open.value}>
                                    <MiCode language={props.language} content={props.code || ''} />
                                </div>
                            </Transition>
                        </>
                    ) : null}
                </div>
            </div>
        )
    }
})

export default MiCodeDemo
