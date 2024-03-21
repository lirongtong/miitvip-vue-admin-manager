import { defineComponent, onMounted, reactive, nextTick, ref, Transition } from 'vue'
import { AnchorProps } from './props'
import { useI18n } from 'vue-i18n'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { $tools } from '../../utils/tools'
import { CaretLeftOutlined } from '@ant-design/icons-vue'
import MiAnchorLink from './Link'
import applyTheme from '../_utils/theme'
import styled from './style/anchor.module.less'

const MiAnchor = defineComponent({
    name: 'MiAnchor',
    inheritAttrs: false,
    props: AnchorProps(),
    emits: ['click'],
    setup(props, { slots, emit }) {
        const { t } = useI18n()
        const anchorRef = ref(null)
        const stickyRef = ref(null)
        const params = reactive({
            id: getPrefixCls(`anchor-${$tools.uid()}`),
            key: getPrefixCls(`anchor-sticky-${$tools.uid()}`),
            text: props.affixText || t('anchor.text'),
            affixText: [],
            open: false,
            sticky: false,
            list: [] as any[],
            actives: [] as boolean[],
            anim: getPrefixCls('anim-anchor'),
            hover: false
        })
        applyTheme(styled)

        const init = async () => {
            let container: HTMLElement | Document = document
            if (props.collectContainer) {
                container = document.querySelector(props.collectContainer) as HTMLElement
            }
            params.list = parseAnchorData(
                container.querySelectorAll(
                    typeof props.selector === 'string'
                        ? props.selector
                        : Array.isArray(props.selector)
                          ? props.selector.join(',')
                          : 'h1, h2, h3, h4, h5, h6'
                )
            )
            await nextTick()
            if (anchorRef.value) {
                const height = anchorRef.value?.clientHeight
                const offset = $tools.getElementActualOffsetTopOrLeft(anchorRef.value)
                console.log(height, offset)
            }
            if (stickyRef.value && !params.hover) {
                params.open = false
                params.sticky = true
            }
        }

        const parseAnchorData = (nodes: NodeListOf<HTMLElement>) => {
            const data: any[] = []
            ;(nodes || []).forEach((node: HTMLElement) => {
                const setAttr = (item: HTMLElement) => {
                    let id = $tools.uid()
                    if (!item.id) item.setAttribute('id', id)
                    else id = item.id
                    const offset = $tools.getElementActualOffsetTopOrLeft(node) || 0
                    data.push({
                        id,
                        offset,
                        title: item.innerText
                    })
                    params.actives.push(false)
                }
                if (props.requireAttr) {
                    if (node[props.requireAttr]) setAttr(node)
                } else setAttr(node)
            })
            return data
        }

        const parseAnchorText = () => {
            const texts = params.text.split('')
            ;(texts || []).forEach((text: string) => {
                params.affixText.push(
                    <span
                        class={/\s/g.test(text) ? styled.stickyTextEmpty : null}
                        innerHTML={text}
                    />
                )
            })
            console.log(params.affixText)
        }

        const handleMouseenterSticky = () => {
            params.open = true
            params.sticky = false
        }

        const handleMouseleaveAnchor = () => {
            params.open = false
            params.sticky = true
        }

        onMounted(async () => {
            await nextTick()
            parseAnchorText()
            init()
        })

        return () =>
            getPropSlot(slots, props) || params.list.length > 0 ? (
                <div class={styled.container}>
                    <Transition name={params.anim} appear={true}>
                        <div
                            ref={anchorRef}
                            class={styled.anchor}
                            key={params.id}
                            onMouseleave={handleMouseleaveAnchor}
                            v-show={params.open}></div>
                    </Transition>
                    <Transition name={params.anim} appear={true}>
                        <div
                            ref={stickyRef}
                            class={styled.sticky}
                            key={params.key}
                            onMouseenter={handleMouseenterSticky}
                            v-show={params.sticky}>
                            <CaretLeftOutlined />
                            <div class={styled.stickyText}>{...params.affixText}</div>
                        </div>
                    </Transition>
                </div>
            ) : null
    }
})

MiAnchor.Link = MiAnchorLink
export default MiAnchor as typeof MiAnchor & {
    readonly Link: typeof MiAnchorLink
}
