import { defineComponent, ref } from 'vue'
import { BgColorsOutlined } from '@ant-design/icons-vue'
import { Popover, Radio } from 'ant-design-vue'
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
        const { t, te } = useI18n()
        const active = ref<number>(1)
        const builtinColor = ref<string>('')
        applyTheme(styled)

        const renderTabs = () => {
            return (
                <div class={styled.tabs}>
                    <span
                        class={active.value === 1 ? styled.tabsActive : ''}
                        innerHTML={t('global.builtin')}
                        onClick={() => (active.value = 1)}
                    />
                    <span
                        class={active.value === 2 ? styled.tabsActive : ''}
                        innerHTML={t('global.customize')}
                        onClick={() => (active.value = 2)}
                    />
                </div>
            )
        }

        const handleClick = (key: string) => {
            if (builtinColor.value !== key) {
                builtinColor.value = key
                $tools.createThemeProperties(key)
            }
        }

        const renderBulitin = () => {
            const colors = $tools.getBuiltinColors() || {}
            const swatches = []
            for (const key in colors) {
                swatches.push(
                    <Radio class={styled.builtinSwatchesColor} value={key} key={key}>
                        <span
                            class={`${styled.builtinSwatchesColorItem}${
                                builtinColor.value === key
                                    ? ` ${styled.builtinSwatchesColorItemActive}`
                                    : ''
                            }`}
                            style={{ background: key }}
                            title={te(`color.${colors[key]}`) ? t(`color.${colors[key]}`) : ''}
                            onClick={() => handleClick(key)}
                        />
                    </Radio>
                )
            }
            return active.value === 1 ? (
                <div class={styled.builtin}>
                    <Radio.Group
                        name="builtin-color"
                        value={builtinColor.value}
                        class={styled.builtinSwatches}>
                        {...swatches}
                    </Radio.Group>
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
