import { defineComponent, createVNode } from 'vue'
import { Button, Modal as AntModal } from 'ant-design-vue'
import { CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { install } from '../../utils/install'
import { getSlot, getSlotContent } from '../../utils/props'
import { $tools } from '../../utils/tools'
import getModalPropTypes from './props'
import MiPopup from './popup'
import MiTeleport from './teleport'

const Modal = defineComponent({
    name: 'MiModal',
    inheritAttrs: false,
    props: {...getModalPropTypes()},
    emits: ['ok', 'cancel', 'update:visible'],
    methods: {
        handleCancel(e: MouseEvent) {
            this.$emit('update:visible', false)
            this.$emit('cancel', e)
        },
        handleOk(e: MouseEvent) {
            this.$emit('ok', e)
        },
        getDefaultFooter(prefixCls: string) {
            return (
                <div class={`${prefixCls}-btns`}>
                    <Button type="default" class={`${prefixCls}-btn`} onClick={this.handleCancel}>
                        { getSlotContent(this, 'cancelText') || '取消' }
                    </Button>
                    <Button type="primary" class={`${prefixCls}-btn-primary`} onClick={this.handleOk}>
                        { getSlotContent(this, 'okText') || '确定' }
                    </Button>
                </div>
            )
        }
    },
    render() {
        const {
            prefixCls: customizePrefixCls,
            visible,
            container,
            forceRender
        } = this.$props
        const prefixCls = this.$tools.getPrefixCls('modal', customizePrefixCls)
        const closeIcon = getSlotContent(this, 'closeIcon')
        const renderCloseIcon = (
            <span class={`${prefixCls}-close-x`}>
                { closeIcon || <CloseOutlined class={`${prefixCls}-close-icon`}></CloseOutlined> }
            </span>
        )
        const footer = getSlotContent(this, 'footer')
        let props = {
            ...this.$props,
            ...this.$attrs,
            prefixCls,
            title: getSlotContent(this, 'title'),
            footer: footer === undefined ? this.getDefaultFooter(prefixCls) : footer,
            closeIcon: renderCloseIcon,
            cancel: this.handleCancel
        }
        if (container === false) {
            return <MiPopup {...props}>{ getSlot(this) }</MiPopup>
        }
        return (
            <MiTeleport
                visible={visible}
                forceRender={forceRender}
                container={container}
                children={(child: any) => {
                    props = {...props, ...child}
                    return <MiPopup {...props}>{ getSlot(this) }</MiPopup>
                }}
            />
        )
    }
})
const prefixCls = $tools.getPrefixCls('modal')
const defaultConfig = {
    centered: true,
    keyboard: true,
    mask: true,
    maskClosable: true,
    width: 360,
    okText: '知道了'
}
Modal.success = (config: {}) => {
    const configuration = Object.assign({}, defaultConfig, {
        class: `${prefixCls}-success`
    }, config)
    AntModal.success(configuration)
}
Modal.error = (config: {}) => {
    const configuration = Object.assign({}, defaultConfig, {
        class: `${prefixCls}-error`
    }, config)
    AntModal.error(configuration)
}
Modal.warning = (config: {}) => {
    const configuration = Object.assign({}, defaultConfig, {
        class: `${prefixCls}-warning`
    }, config)
    AntModal.warning(configuration)
}
Modal.confirm = (config: {}) => {
    const configuration = Object.assign({}, defaultConfig, {
        class: `${prefixCls}-confirm`,
        okText: '确定',
        cancelText: '取消',
        icon: createVNode(QuestionCircleOutlined)
    }, config)
    AntModal.confirm(configuration)
}
Modal.destroyAll = () => {
    AntModal.destroyAll()
}
export default install(Modal)