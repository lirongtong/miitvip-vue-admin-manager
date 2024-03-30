import { Transition, defineComponent, ref } from 'vue'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { CodeDemoProps } from './props'
import { Divider, Tooltip } from 'ant-design-vue'
import { CodeOutlined } from '@ant-design/icons-vue'
import MiCode from './Code'
import applyTheme from '../_utils/theme'
import styled from './style/demo.module.less'

const MiCodeDemo = defineComponent({
    name: 'MiCodeDemo',
    inheritAttrs: false,
    props: CodeDemoProps(),
    setup(props, { slots }) {
        const open = ref<boolean>(false)
        const anim = getPrefixCls(`anim-${props.animation}`)
        applyTheme(styled)

        return () => (
            <div class={styled.container}>
                <div class={styled.inner}>
                    <div class={styled.result}>{getPropSlot(slots, props, 'result')}</div>
                    <div class={styled.info}>
                        <Divider {...props.titleSetting}>{props.title}</Divider>
                        <div class={styled.infoSummary} innerHTML={props.summary} />
                        <Divider dashed={true} />
                    </div>
                    <div class={styled.icons}>
                        <Tooltip title="显示代码">
                            <CodeOutlined onClick={() => (open.value = !open.value)} />
                        </Tooltip>
                    </div>
                    {props.code ? (
                        <Transition name={anim} appear={true}>
                            <div class={styled.code} v-show={open.value}>
                                <MiCode language={props.language} content={props.code || ''} />
                            </div>
                        </Transition>
                    ) : null}
                </div>
            </div>
        )
    }
})

export default MiCodeDemo
