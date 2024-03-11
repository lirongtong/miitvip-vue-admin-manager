import { defineComponent } from 'vue'
import { BgColorsOutlined } from '@ant-design/icons-vue'
import { Popover } from 'ant-design-vue'
import { PaletteProps } from './props'
import { $tools } from '../../utils/tools'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import applyTheme from '../_utils/theme'
import styled from './style/palette.module.less'

const MiPalette = defineComponent({
    name: 'MiPalette',
    inheritAttrs: false,
    props: PaletteProps(),
    setup(props) {
        applyTheme(styled)

        const handleColorChange = (hex: string) => {
            $tools.createThemeProperties(hex)
        }

        const renderCustomize = () => {
            return (
                <div class={styled.customize}>
                    <ColorPicker
                        class={styled.customizeColor}
                        isWidget={true}
                        theme="white"
                        disableHistory={true}
                        pickerType="chrome"
                        format="hex"
                        onPureColorChange={handleColorChange}
                    />
                </div>
            )
        }

        const renderContent = () => {
            return (
                <div class={styled.content}>
                    <div class={styled.contentInner}>{renderCustomize()}</div>
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
