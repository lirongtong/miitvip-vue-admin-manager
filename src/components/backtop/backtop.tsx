import { defineComponent, SlotsType, PropType, reactive, Transition } from 'vue'
import PropTypes from '../_utils/props-types'
import { getPrefixCls } from '../_utils/props-tools'
import { $tools } from '../../utils/tools'
import { useI18n } from 'vue-i18n'
import { Tooltip } from 'ant-design-vue'
import { VerticalAlignTopOutlined } from '@ant-design/icons-vue'

export interface backTopPosition {
    top?: [number, string]
    left?: [number, string]
    right?: [number, string]
    bottom?: [number, string]
}

export const backTopProps = () => ({
    prefixCls: PropTypes.string,
    width: PropTypes.number.def(48),
    height: PropTypes.number.def(48),
    icon: PropTypes.any,
    iconColor: PropTypes.string,
    iconSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bgColor: PropTypes.string,
    showOffset: PropTypes.number.def(200),
    duration: PropTypes.number.def(1000),
    radius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    zIndex: PropTypes.number,
    tip: PropTypes.string,
    position: {
        type: Object as PropType<backTopPosition>,
        default: {
            top: 0,
            left: 0,
            bottom: 24,
            right: 24
        }
    }
})

export default defineComponent({
    name: 'MiBackTop',
    props: backTopProps(),
    slots: Object as SlotsType<{
        icon: any
    }>,
    emits: ['endCallback'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const prefixCls = getPrefixCls('back-top', props.prefixCls)
        const key = getPrefixCls(`back-top-${$tools.uid()}`, props.prefixCls)
        const anim = getPrefixCls('anim-scale')
        const tip = props.tip ?? t('back2top')
        const params = reactive({
            show: false
        })
        const back2top = () => {
            $tools.back2top(null, props.duration, () => {
                emit('endCallback')
            })
        }
        $tools.on(document.body, 'scroll', () => {
            const offset = document.documentElement.scrollTop || document.body.scrollTop
            if (offset > props.showOffset) params.show = true
            else params.show = false
        })
        const style = {
            box: {
                left: props.position?.left ? $tools.convert2Rem(props.position.left) : null,
                right: props.position?.right ? $tools.convert2Rem(props.position.right) : null,
                top: props.position?.top ? $tools.convert2Rem(props.position.top) : null,
                bottom: props.position?.bottom ? $tools.convert2Rem(props.position.bottom) : null,
                zIndex: props.zIndex ?? null,
                radius: props.radius ? $tools.convert2Rem(props.radius) : null,
                background: props.bgColor ?? null
            },
            icon: {
                color: props.iconColor ?? null,
                fontSize: props.iconSize ? $tools.convert2Rem(props.iconSize) : null
            }
        }
        return () => {
            return params.show ? (
                <Transition name={anim} appear={true}>
                    <div class={prefixCls} style={style.box} key={key}>
                        <Tooltip title={tip} placement={'top'}>
                            <div class={`${prefixCls}-inner`} onClick={back2top}>
                                <div class={`${prefixCls}-icon`} style={style.icon}>
                                    <VerticalAlignTopOutlined />
                                </div>
                            </div>
                        </Tooltip>
                    </div>
                </Transition>
            ) : null
        }
    }
})
