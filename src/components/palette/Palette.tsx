import { defineComponent, ref } from 'vue'
import { BgColorsOutlined } from '@ant-design/icons-vue'
import { Popover, Row, Button } from 'ant-design-vue'
import { PaletteProps } from './props'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { $storage } from '../../utils/storage'
import { useI18n } from 'vue-i18n'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import applyTheme from '../_utils/theme'
import styled from './style/palette.module.less'

const MiPalette = defineComponent({
    name: 'MiPalette',
    inheritAttrs: false,
    props: PaletteProps(),
    setup(props) {
        const { t } = useI18n()
        const HEX = ref<string>($storage.get($g.caches.storages.theme) || '')
        applyTheme(styled)

        const handleColorChange = (hex: string) => {
            HEX.value = hex
            $tools.createThemeProperties(hex)
        }

        const handleColorReset = () => {
            $storage.del($g.caches.storages.theme, HEX.value)
            $tools.createThemeProperties($g?.theme?.primary || '#FFD464')
        }

        const handleColorSave = () => {
            $storage.set($g.caches.storages.theme, HEX.value)
        }

        const renderCustomize = () => {
            return (
                <div class={styled.customize}>
                    <ColorPicker
                        class={styled.customizeColor}
                        isWidget={true}
                        theme="white"
                        pureColor={HEX.value}
                        disableHistory={true}
                        pickerType="chrome"
                        format="hex"
                        onPureColorChange={handleColorChange}
                    />
                </div>
            )
        }

        const renderButton = () => {
            return (
                <Row class={styled.btn}>
                    <Button class={styled.btnReset} ghost={true} onClick={handleColorReset}>
                        {t('global.reset')}
                    </Button>
                    <Button class={styled.btnSave} onClick={handleColorSave}>
                        {t('global.save')}
                    </Button>
                </Row>
            )
        }

        const renderContent = () => {
            return (
                <div class={styled.content}>
                    <div class={styled.contentInner}>
                        {renderCustomize()}
                        {renderButton()}
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
