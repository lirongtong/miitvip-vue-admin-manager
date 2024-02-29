import { defineComponent, ref } from 'vue'
import { BgColorsOutlined } from '@ant-design/icons-vue'
import { Popover } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { PaletteProps } from './props'
import { $tools } from '../../utils/tools'
import applyTheme from '../_utils/theme'
import styled from './style/palette.module.less'

const MiPalette = defineComponent({
    name: 'MiPalette',
    inheritAttrs: false,
    props: PaletteProps(),
    setup(props) {
        const { t } = useI18n()
        const active = ref<number>(1)
        applyTheme(styled)

        const renderTabs = () => {
            return (
                <div class={styled.tabs}>
                    <span
                        class={active.value === 1 ? styled.tabsActive : ''}
                        innerHTML={t('global.builtin')}
                    />
                    <span
                        class={active.value === 2 ? styled.tabsActive : ''}
                        innerHTML={t('global.customize')}
                    />
                </div>
            )
        }

        const renderBulitin = () => {
            const colors = $tools.getBuiltinColors() || {}
            const swatches = []
            for (const key in colors) {
                swatches.push(
                    <div class={styled.builtinSwatchesColor}>
                        <span style={{ background: key }}></span>
                    </div>
                )
            }
            return active.value === 1 ? (
                <div class={styled.builtin}>
                    <div classs={styled.builtinSwatches}>{...swatches}</div>
                </div>
            ) : null
        }

        const renderCustomize = () => {
            return active.value === 2 ? <div class={styled.customize}></div> : null
        }

        const renderContent = () => {
            return (
                <div class={styled.content}>
                    {renderTabs()}
                    <div class={styled.contentInner}>
                        {renderBulitin()}
                        {renderCustomize()}
                    </div>
                </div>
            )
        }

        return () => (
            <Popover
                overlayClassName={styled.container}
                trigger={props.trigger}
                placement={props.placement}
                content={renderContent()}>
                <BgColorsOutlined />
            </Popover>
        )
    }
})

export default MiPalette as typeof MiPalette
