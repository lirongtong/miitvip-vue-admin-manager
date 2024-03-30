import { defineComponent } from 'vue'
import { CodeProps } from './props'
import { getPropSlot } from '../_utils/props'
import MiCodeDemo from './Demo'
import applyTheme from '../_utils/theme'
import styled from './style/code.module.less'
import 'prismjs/themes/prism-tomorrow.css'

const MiCode = defineComponent({
    name: 'MiCode',
    inheritAttrs: false,
    props: CodeProps(),
    setup(props, { slots }) {
        applyTheme(styled)

        return () => {
            const content = getPropSlot(slots, props, 'content') ?? null
            return (
                <div class={styled.container}>
                    <pre v-prism>
                        <div class={styled.title}>
                            <span class={styled.titleDotRed} />
                            <span class={styled.titleDotOrange} />
                            <span class={styled.titleDotGreen} />
                        </div>
                        <code class={`${styled.content} language-${props.language}`}>
                            {content}
                        </code>
                    </pre>
                </div>
            )
        }
    }
})

MiCode.Demo = MiCodeDemo
export default MiCode as typeof MiCode & {
    readonly Demo: typeof MiCodeDemo
}
