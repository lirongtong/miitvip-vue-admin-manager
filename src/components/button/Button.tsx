import { defineComponent, Fragment, ref } from 'vue'
import { $tools } from '../../utils/tools'
import { ButtonProps } from './props'
import MiLink from '../link/Link'
import applyTheme from '../_utils/theme'
import styled from './style/button.module.less'

const MiButton = defineComponent({
    name: 'MiButton',
    inheritAttrs: false,
    props: ButtonProps(),
    setup(props) {
        applyTheme(styled)

        const arrow = (
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
                            fill={props?.arrow?.color || '#fff'}
                        />
                    </g>
                </g>
            </svg>
        )

        const immediate = ref<boolean>(false)

        const renderButton = () => {
            const textObj = $tools.getTextSetting(props?.text)
            const iconAnim = (
                <div
                    class={[
                        styled.iconContainer,
                        { [styled.iconImmediate]: immediate.value },
                        { [styled.iconUp]: props?.arrow?.direction === 'up' },
                        { [styled.iconDown]: props?.arrow?.direction === 'down' },
                        { [styled.iconLeft]: props?.arrow?.direction === 'left' }
                    ]}>
                    <div class={styled.iconInner}>
                        {arrow}
                        <div class={styled.iconBackup}>
                            <div class={styled.iconBackupFirst}>{arrow}</div>
                            <div class={styled.iconBackupSecond}>{arrow}</div>
                        </div>
                    </div>
                </div>
            )
            const title = textObj?.text ? (
                <div class={styled.title} innerHTML={textObj?.text} style={textObj?.style}></div>
            ) : null
            return (
                <div class={[styled.inner, { [styled.circle]: props?.circle && !props?.text }]}>
                    {props?.link ? (
                        <MiLink path={props?.link} target={props?.target} query={props?.query}>
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

        setTimeout(
            () => (immediate.value = props?.arrow?.immediate),
            (props?.arrow?.delay || 0.5) * 1000
        )

        return () => (
            <div class={[styled.container, { [styled.circle]: props?.circle && !props?.text }]}>
                {renderButton()}
            </div>
        )
    }
})

export default MiButton
