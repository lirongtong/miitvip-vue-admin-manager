import { defineComponent, Fragment } from 'vue'
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

        const renderButton = () => {
            const text = $tools.getTextSetting(props?.text)
            const icon = (
                <div class={styled.iconContainer}>
                    <div class={styled.iconInner}>
                        <span class={styled.iconDisplay}></span>
                        <div class={styled.iconBackup}>
                            <span class={styled.iconBackupFirst}></span>
                            <span class={styled.iconBackupSecond}></span>
                        </div>
                    </div>
                </div>
            )
            return (
                <div class={styled.inner}>
                    {props?.link ? (
                        <MiLink path={props?.link} target={props?.target} query={props?.query}>
                            {text}
                            {icon}
                        </MiLink>
                    ) : (
                        <Fragment>
                            {text}
                            {icon}
                        </Fragment>
                    )}
                </div>
            )
        }

        return () => <div class={styled.container}>{renderButton()}</div>
    }
})

export default MiButton
