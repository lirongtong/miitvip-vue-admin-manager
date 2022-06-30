import { defineComponent, reactive, createVNode, Plugin } from 'vue'
import { Button, Modal as AntModal, ModalFuncProps } from 'ant-design-vue'
import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { modalProps } from './props'
import { getPrefixCls, getPropSlot } from '../_utils/props-tools'
import MiTeleport from './teleport'
import MiPopup from './popup'

export type ModalFunc = (props: ModalFuncProps) => {
    destroy: () => void
    update: (newConfig: ModalFuncProps) => void
}

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

const prefixCls = getPrefixCls('modal')
const defaultConfig = {
    centered: true,
    keyboard: true,
    mask: true,
    maskClosable: true,
    width: 360,
    okText: '知道了'
}

const mergeConfig = (config: string | {}, type: string) => {
    if (typeof config === 'string') config = { content: config }
    return Object.assign(
        {},
        defaultConfig,
        {
            class: `${prefixCls}-${type}`
        },
        config
    )
}

Modal.info = (config: string | {}) => {
    AntModal.info(mergeConfig(config, 'info'))
}

Modal.success = (config: string | {}) => {
    AntModal.success(mergeConfig(config, 'success'))
}

Modal.error = (config: string | {}) => {
    AntModal.error(mergeConfig(config, 'error'))
}

Modal.warn = (config: string | {}) => {
    AntModal.warning(mergeConfig(config, 'warning'))
}

Modal.warning = (config: string | {}) => {
    AntModal.warning(mergeConfig(config, 'warning'))
}

Modal.confirm = (config: string | {}) => {
    const configuration = Object.assign({}, mergeConfig(config, 'confirm'), {
        icon: createVNode(QuestionCircleOutlined),
        okText: '确定',
        cancelText: '取消'
    })
    AntModal.confirm(configuration)
}

Modal.destroyAll = () => {
    AntModal.destroyAll()
}

export default Modal as typeof Modal &
    Plugin & {
        readonly info: ModalFunc
        readonly success: ModalFunc
        readonly error: ModalFunc
        readonly warn: ModalFunc
        readonly warning: ModalFunc
        readonly confirm: ModalFunc
        readonly destroyAll: ModalFunc
    }
