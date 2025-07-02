import { computed, defineComponent, Fragment, onBeforeUnmount, onMounted, ref } from 'vue'
import { $tools } from '../../utils/tools'
import { ButtonProps } from './props'
import MiLink from '../link/Link'
import applyTheme from '../_utils/theme'
import styled from './style/button.module.less'

const renderArrow = (color: string = '#fff') => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <defs>
                <clipPath id="mi-clip-artboard-1">
                    <rect width="24" height="24" />
                </clipPath>
            </defs>
            <g data-name="Artboard – 1" clip-path="url(#mi-clip-artboard-1)">
                <g>
                    <path d="M24,0H0V24H24Z" fill="none" />
                    <path
                        data-name="Union 25"
                        d="M-2716.134-694.148l3.219-3.219H-2722v-2h9.086l-3.219-3.219,1.414-1.414,5.634,5.633-5.634,5.633Z"
                        transform="translate(2728.25 710.367)"
                        fill={color}
                    />
                </g>
            </g>
        </svg>
    )
}

const MiButton = defineComponent({
    name: 'MiButton',
    inheritAttrs: false,
    props: ButtonProps(),
    emits: ['click'],
    setup(props, { emit }) {
        applyTheme(styled)

        const buttonClass = computed(() => [
            styled.inner,
            immediate.value ? styled.iconImmediate : '',
            props.circle && !props.text ? styled.circle : '',
            !props.circle && !props.text ? styled.square : ''
        ])

        const buttonStyle = computed(() => ({
            backdropFilter: props?.backdrop || null,
            borderColor: props?.borderColor || null,
            background: props?.background || null,
            borderRadius: $tools.convert2rem($tools.distinguishSize(props.radius)),
            width: $tools.convert2rem($tools.distinguishSize(props.width)),
            height: $tools.convert2rem($tools.distinguishSize(props.height))
        }))

        const immediate = ref<boolean>(false)
        let timeout: ReturnType<typeof setTimeout> | null = null
        const arrowVNode = renderArrow(props.arrow?.color || '#fff')

        const renderButton = () => {
            const textObj = $tools.getTextSetting(props?.text)
            const iconAnim = (
                <div
                    class={[
                        styled.iconContainer,
                        { [styled.iconUp]: props?.arrow?.direction === 'up' },
                        { [styled.iconDown]: props?.arrow?.direction === 'down' },
                        { [styled.iconLeft]: props?.arrow?.direction === 'left' }
                    ]}>
                    <div class={styled.iconInner}>
                        {arrowVNode}
                        <div class={styled.iconBackup}>
                            <div class={styled.iconBackupFirst}>{arrowVNode}</div>
                            <div class={styled.iconBackupSecond}>{arrowVNode}</div>
                        </div>
                    </div>
                </div>
            )
            const title = textObj?.text ? (
                <div class={styled.title} innerHTML={textObj?.text} style={textObj?.style}></div>
            ) : null
            return (
                <div
                    role="button"
                    tabindex="0"
                    class={buttonClass.value}
                    style={buttonStyle.value}
                    onClick={() => emit('click')}>
                    {props?.link ? (
                        <MiLink
                            class={styled.link}
                            path={props?.link}
                            target={props?.target}
                            query={props?.query}>
                            {title}
                            {iconAnim}
                        </MiLink>
                    ) : (
                        <Fragment>
                            {title}
                            {iconAnim}
                        </Fragment>
                    )}
                </div>
            )
        }

        onMounted(() => {
            timeout = setTimeout(
                () => {
                    immediate.value = props.arrow?.immediate
                },
                (props.arrow?.delay || 0.5) * 1000
            )
        })

        onBeforeUnmount(() => timeout && clearTimeout(timeout))

        return () => <div class={[styled.container]}>{renderButton()}</div>
    }
})

export default MiButton
