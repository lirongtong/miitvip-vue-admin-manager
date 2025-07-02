import {
    SlotsType,
    Transition,
    computed,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    reactive,
    watch
} from 'vue'
import { BacktopProps } from './props'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { useI18n } from 'vue-i18n'
import { Tooltip } from 'ant-design-vue'
import { RocketOutlined } from '@ant-design/icons-vue'
import { useWindowResize } from '../../hooks/useWindowResize'
import applyTheme from '../_utils/theme'
import styled from './style/backtop.module.less'

const MiBacktop = defineComponent({
    name: 'MiBacktop',
    inheritAttrs: false,
    props: BacktopProps(),
    slots: Object as SlotsType<{ icon: any }>,
    emits: ['end'],
    setup(props, { slots, emit }) {
        const { t } = useI18n()
        const { width } = useWindowResize()
        const params = reactive({
            show: false,
            key: $tools.uid(),
            anim: getPrefixCls('anim-scale'),
            tip: props.tip || t('global.backtop'),
            container: props.listenerContainer ?? document.body
        })
        applyTheme(styled)

        const handleContainerScroll = (container?: any) => {
            const offset = container
                ? container.scrollTop
                : document.documentElement.scrollTop || document.body.scrollTop
            params.show = offset >= props.offset && offset !== 0
        }

        const handleBacktop = (duration?: number, callback?: Function) => {
            $tools.back2top(
                params.container,
                typeof duration === 'number' ? duration : props.duration,
                () => {
                    callback && callback()
                    emit('end')
                }
            )
        }

        const renderInner = (tooltip = false) => {
            const content = (
                <div class={styled.inner} onClick={handleBacktop}>
                    <div class={styled.icon}>
                        {getPropSlot(slots, props, 'icon') ?? <RocketOutlined />}
                    </div>
                </div>
            )
            return tooltip ? <Tooltip title={params.tip}>{content}</Tooltip> : content
        }

        const onScroll = () => handleContainerScroll(params.container)

        onMounted(() => $tools.on(params.container, 'scroll', onScroll))
        onBeforeUnmount(() =>
            handleBacktop(0, () => $tools.off(params.container, 'scroll', onScroll))
        )

        watch(
            () => props.listenerContainer,
            (container: HTMLElement) => {
                $tools.off(params.container, 'scroll', onScroll)
                params.container = container ?? document.body
                $tools.on(params.container, 'scroll', onScroll)
            },
            { immediate: true, deep: true }
        )

        const style = computed(() => {
            return {
                width: $tools.convert2rem($tools.distinguishSize(props.width, width.value)),
                height: $tools.convert2rem($tools.distinguishSize(props.height, width.value)),
                borderRadius: $tools.convert2rem($tools.distinguishSize(props.radius, width.value)),
                ...$tools.wrapPositionOrSpacing(props.position),
                background: props.background ?? null,
                zIndex: props.zIndex
            }
        })

        return () => (
            <Transition name={params.anim} appear>
                <div
                    class={styled.container}
                    style={style.value}
                    key={params.key}
                    v-show={params.show}>
                    {width.value < $g.breakpoints.md || $tools.isMobile()
                        ? renderInner()
                        : renderInner(true)}
                </div>
            </Transition>
        )
    }
})

export default MiBacktop
