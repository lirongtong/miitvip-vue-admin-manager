import { SlotsType, createVNode, defineComponent, reactive } from 'vue'
import { Button, Modal as AntModal } from 'ant-design-vue'
import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { ModalProps, type ModalFunc } from './props'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import MiModalPopup from './Popup'
import MiModalTeleport from './Teleport'
import applyTheme from '../_utils/theme'
import styled from './style/modal.module.less'

const MiModal = defineComponent({
    name: 'MiModal',
    inheritAttrs: false,
    props: ModalProps(),
    emits: ['ok', 'cancel', 'afterClose', 'update:open'],
    slots: Object as SlotsType<{
        title: any
        content: any
        footer: any
        okText: any
        cancelText: any
        icon: any
        closeIcon: any
    }>,
    setup(props, { slots, attrs, emit }) {
        const { t } = useI18n()
        applyTheme(styled)

        const handleOk = (evt?: Event) => {
            emit('ok', evt)
        }

        const handleCancel = (evt?: Event) => {
            if (props.closable) {
                emit('update:open', false)
                emit('cancel', evt)
            }
        }

        const handleAfterClose = (evt?: Event) => {
            emit('afterClose', evt)
        }

        const renderCloseIcon = () => {
            return (
                <div class={styled.close}>
                    {getPropSlot(slots, props, 'closeIcon') ?? (
                        <CloseOutlined class={styled.closeIcon} />
                    )}
                </div>
            )
        }

        const renderFooter = () => {
            return (
                <div class={styled.btns}>
                    {props.closable ? (
                        <Button ghost={true} class={styled.btnsCancel} onClick={handleCancel}>
                            {getPropSlot(slots, props, 'cancelText') ?? t('global.cancel')}
                        </Button>
                    ) : null}
                    <Button class={styled.btnsOk} type="primary" onClick={handleOk}>
                        {getPropSlot(slots, props, 'okText') ?? t('global.ok')}
                    </Button>
                </div>
            )
        }

        return () => {
            let properties = reactive({
                ...props,
                ...attrs,
                title: getPropSlot(slots, props, 'title') ?? t('global.tips'),
                footer: getPropSlot(slots, props, 'footer') ?? renderFooter(),
                closeIcon: renderCloseIcon(),
                onCancel: handleCancel,
                onAfterClose: handleAfterClose
            })
            return props.container === false ? (
                <MiModalPopup {...properties}>{getPropSlot(slots, props)}</MiModalPopup>
            ) : (
                <MiModalTeleport
                    open={props.open}
                    forceRender={props.forceRender}
                    container={props.container}
                    children={(child: any) => {
                        properties = { ...properties, ...child }
                        return (
                            <MiModalPopup {...properties}>{getPropSlot(slots, props)}</MiModalPopup>
                        )
                    }}
                />
            )
        }
    }
})

const prefixCls = getPrefixCls('modal-quick')
const defaultConfig = {
    centered: true,
    keyboard: true,
    mask: true,
    maskClosable: true,
    width: 360,
    okText: `知道了`,
    zIndex: Date.now()
}
const mergeConfig = (config: string | {}, type: string) => {
    if (typeof config === 'string') config = { content: config }
    return { ...Object.assign({}, defaultConfig, { class: `${prefixCls}-${type}` }, config) }
}

MiModal.info = (config: string | {}) => {
    AntModal.info(mergeConfig(config, 'info'))
}

MiModal.success = (config: string | {}) => {
    AntModal.success(mergeConfig(config, 'success'))
}

MiModal.error = (config: string | {}) => {
    AntModal.error(mergeConfig(config, 'error'))
}

MiModal.warn = (config: string | {}) => {
    AntModal.warning(mergeConfig(config, 'warning'))
}

MiModal.warning = (config: string | {}) => {
    AntModal.warning(mergeConfig(config, 'warning'))
}

MiModal.confirm = (config: string | {}) => {
    const configuration = Object.assign(
        {},
        {
            icon: createVNode(QuestionCircleOutlined),
            okText: `确定`,
            cancelText: `取消`
        },
        mergeConfig(config, 'confirm')
    )
    AntModal.confirm(configuration)
}

MiModal.destroyAll = () => {
    AntModal.destroyAll()
}

export default MiModal as typeof MiModal & {
    readonly info: ModalFunc
    readonly success: ModalFunc
    readonly error: ModalFunc
    readonly warn: ModalFunc
    readonly warning: ModalFunc
    readonly confirm: ModalFunc
    readonly destroyAll: ModalFunc
}
