import {
    SlotsType,
    Transition,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    reactive,
    watch
} from 'vue'
import { BacktopProps } from './props'
import { $tools } from '../../utils/tools'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Tooltip } from 'ant-design-vue'
import { RocketOutlined } from '@ant-design/icons-vue'
import applyTheme from '../_utils/theme'
import styled from './style/backtop.module.less'

const MiBacktop = defineComponent({
    name: 'MiBacktop',
    inheritAttrs: false,
    props: BacktopProps(),
    slols: Object as SlotsType<{ icon: any }>,
    emits: ['end'],
    setup(props, { slots, emit }) {
        const { t } = useI18n()
        const router = useRouter()
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
            if (offset >= props.offset) params.show = true
            else params.show = false
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

        onMounted(() => $tools.on(params.container, 'scroll', () => handleContainerScroll()))
        onBeforeUnmount(() => {
            handleBacktop()
            $tools.off(params.container, 'scroll', () => handleContainerScroll())
        })

        watch(
            () => props.listenerContainer,
            (container: Window | HTMLElement) => {
                params.container = container
                $tools.off(container, 'scroll', () => handleContainerScroll(container))
                $tools.on(container, 'scroll', () => handleContainerScroll(container))
            },
            { immediate: true, deep: true }
        )

        router.beforeEach((_to, _from, next) => {
            handleBacktop(0, () => {
                console.log(3)
                $tools.off(params.container, 'scroll', () => handleContainerScroll())
                next()
            })
        })

        return () => (
            <Transition name={params.anim} appear={true}>
                <div
                    class={styled.container}
                    style={{
                        width: $tools.convert2rem($tools.distinguishSize(props.width)),
                        height: $tools.convert2rem($tools.distinguishSize(props.height)),
                        borderRadius: $tools.convert2rem($tools.distinguishSize(props.radius)),
                        ...$tools.wrapPositionOrSpacing(props.position),
                        zIndex: props.zIndex
                    }}
                    key={params.key}
                    v-show={params.show}>
                    <Tooltip title={params.tip} placement="top">
                        <div class={styled.inner} onClick={handleBacktop}>
                            <div class={styled.icon}>
                                {getPropSlot(slots, props, 'icon') ?? <RocketOutlined />}
                            </div>
                        </div>
                    </Tooltip>
                </div>
            </Transition>
        )
    }
})

export default MiBacktop
