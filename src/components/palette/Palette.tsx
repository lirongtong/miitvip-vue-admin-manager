import { defineComponent, reactive } from 'vue'
import { BgColorsOutlined } from '@ant-design/icons-vue'
import {
    Popover,
    Row,
    Button,
    message,
    Switch,
    ConfigProvider,
    theme as AntdvTheme
} from 'ant-design-vue'
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
        const { t, te } = useI18n()
        const params = reactive({
            open: false,
            hex: $storage.get($g.caches.storages.theme.hex) || '',
            tip: te('global.success') ? t('global.success') : '',
            checked: $storage.get($g.caches.storages.theme.type) || $g?.theme?.type || 'dark',
            default: '#FFD464'
        })
        applyTheme(styled)

        const handleOpenChange = (visible: boolean) => {
            if (!visible) {
                const hex = $storage.get($g.caches.storages.theme.hex) || ''
                if (params.hex !== hex) {
                    $tools.createThemeProperties(hex)
                    params.hex = hex
                }
            }
        }

        const handleSwitchChange = (checked: 'dark' | 'light') => {
            params.checked = checked
            $g.theme.type = checked
            $storage.set($g.caches.storages.theme.type, checked)
            $tools.createThemeProperties(params.hex)
        }

        const handleColorChange = (hex: string) => {
            params.hex = hex
            $g.theme.primary = hex
            $tools.createThemeProperties(hex)
        }

        const handleColorReset = () => {
            params.open = false
            $storage.set($g.caches.storages.theme.type, 'dark')
            $storage.set($g.caches.storages.theme.hex, params.default)
            params.checked = 'dark'
            $g.theme.type = 'dark'
            params.hex = params.default
            $tools.createThemeProperties(params.default)
            if (params.tip) {
                message.destroy()
                message.success(params.tip)
            }
        }

        const handleColorSave = () => {
            $storage.set($g.caches.storages.theme.hex, params.hex)
            if (params.tip) {
                message.destroy()
                message.success(params.tip)
            }
            params.open = false
        }

        const getAntdvSwitchThemeProperties = () => {
            return {
                algorithm:
                    params.checked === 'dark'
                        ? AntdvTheme.darkAlgorithm
                        : AntdvTheme.defaultAlgorithm,
                token: { colorPrimary: params.hex }
            }
        }

        const renderCustomize = () => {
            return (
                <div class={styled.customize}>
                    <ColorPicker
                        class={styled.customizeColor}
                        isWidget={true}
                        theme="white"
                        pureColor={params.hex}
                        disableHistory={true}
                        disableAlpha={true}
                        pickerType="chrome"
                        format="hex"
                        onPureColorChange={handleColorChange}
                        zIndex={Date.now()}
                    />
                </div>
            )
        }

        const renderSwitch = () => {
            return (
                <div class={styled.switch}>
                    <ConfigProvider theme={{ ...getAntdvSwitchThemeProperties() }}>
                        <Switch
                            checked={params.checked}
                            checkedChildren={t('global.dark')}
                            checkedValue="dark"
                            unCheckedChildren={t('global.light')}
                            unCheckedValue="light"
                            onChange={handleSwitchChange}
                        />
                    </ConfigProvider>
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
                        {renderSwitch()}
                        {renderCustomize()}
                        {renderButton()}
                    </div>
                </div>
            )
        }

        return () => (
            <Popover
                v-model:open={params.open}
                overlayStyle={{ zIndex: Date.now() }}
                overlayClassName={styled.container}
                trigger={props.trigger}
                placement={props.placement}
                onOpenChange={handleOpenChange}
                content={renderContent()}>
                <BgColorsOutlined />
            </Popover>
        )
    }
})

export default MiPalette as typeof MiPalette
