import { defineComponent, reactive } from 'vue'
import { Button } from 'ant-design-vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { install } from '../../utils/install'
import { modalProps } from './props'
import { getPrefixCls, getPropSlot } from '../_utils/props-tools'
import MiTeleport from './teleport'
import MiPopup from './popup'

const Modal = defineComponent({
    name: 'MiModal',
    inheritAttrs: false,
    props: modalProps(),
    emits: ['ok', 'cancel', 'update:visible'],
    slots: ['title', 'closeIcon', 'footer', 'okText', 'cancelText'],
    setup(props, { slots, attrs, emit }) {
        const { t } = useI18n()
        const prefixCls = getPrefixCls('modal', props.prefixCls)

        const handleOk = (evt: Event) => {
            emit('ok', evt)
        }

        const handleCancel = (evt?: Event) => {
            emit('update:visible', false)
            emit('cancel', evt)
        }

        const renderClose = () => {
            return (
                <span class={`${prefixCls}-close-x`}>
                    {getPropSlot(slots, props, 'closeIcon') ?? (
                        <CloseOutlined class={`${prefixCls}-close-icon`} />
                    )}
                </span>
            )
        }

        const renderFooter = () => {
            return (
                <div class={`${prefixCls}-btns`}>
                    <Button type="default" class={`${prefixCls}-btn`} onClick={handleCancel}>
                        {getPropSlot(slots, props, 'cancelText') ?? t('cancel')}
                    </Button>
                    <Button type="primary" class={`${prefixCls}-btn-primary`} onClick={handleOk}>
                        {getPropSlot(slots, props, 'okText') ?? t('ok')}
                    </Button>
                </div>
            )
        }

        return () => {
            let propties = reactive({
                ...props,
                ...attrs,
                prefixCls,
                title: getPropSlot(slots, props, 'title') ?? t('kind-tips'),
                footer: getPropSlot(slots, props, 'footer') ?? renderFooter(),
                closeIcon: renderClose(),
                onCancel: handleCancel
            })

            return props.container === false ? (
                <MiPopup {...propties}>{getPropSlot(slots, props)}</MiPopup>
            ) : (
                <MiTeleport
                    visible={props.visible}
                    forceRender={props.forceRender}
                    container={props.container}
                    children={(child: any) => {
                        propties = { ...propties, ...child }
                        return <MiPopup {...propties}>{getPropSlot(slots, props)}</MiPopup>
                    }}
                />
            )
        }
    }
})
export default install(Modal)
