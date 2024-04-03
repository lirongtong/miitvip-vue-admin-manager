import {
    defineComponent,
    onMounted,
    reactive,
    nextTick,
    ref,
    Transition,
    watch,
    onBeforeUnmount
} from 'vue'
import { AnchorProps } from './props'
import { useI18n } from 'vue-i18n'
import { getPrefixCls, getPropSlot } from '../_utils/props'
import { $tools } from '../../utils/tools'
import { CaretLeftOutlined, PushpinOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import type { AnchorLinkItem, AnchorListItem } from '../../utils/types'
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
            containerId: $tools.uid(),
            id: getPrefixCls(`anchor-${$tools.uid()}`),
            key: getPrefixCls(`anchor-sticky-${$tools.uid()}`),
            text: props.affixText || t('anchor.text'),
            affixText: [],
            open: false,
            sticky: false,
            list: [] as AnchorListItem[],
            actives: [] as boolean[],
            anim: getPrefixCls('anim-anchor'),
            affix: props.affix ?? false,
            container: props.listenerContainer ?? document.body,
            manual: {
                status: false,
                timer: null
            }
        })
        applyTheme(styled)

        const init = async () => {
            let container: HTMLElement | Document = params.container || document
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
            params.open = params.affix
            params.sticky = !params.affix
            $tools.on(params.container, 'scroll', handleContainerScroll)
            $tools.on(window, 'click', (evt) => handleMaskClose(evt))
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
        }

        const handleAnchorAffix = () => {
            params.affix = !params.affix
            if ($tools.isMobile() && !params.affix) handleMouseleaveAnchor()
        }

        const handleMouseenterSticky = () => {
            params.open = true
            params.sticky = false
        }

        const handleMouseleaveAnchor = () => {
            if (!params.affix) {
                params.open = false
                params.sticky = true
            }
        }

        const handleAnchorClose = () => {
            params.open = false
            params.sticky = false
            if (stickyRef.value) stickyRef.value?.remove()
            setTimeout(() => {
                // 400 - animation duration
                if (anchorRef.value) anchorRef.value?.remove()
            }, 400)
        }

        const handleMaskClose = async (evt: any) => {
            await nextTick()
            if (params.open && !params.affix) {
                const target = evt?.target
                const elem = document.getElementById(params.containerId)
                if (elem && target !== elem && !elem.contains(target)) {
                    params.open = false
                    params.sticky = true
                    if (evt.preventDefault) evt.preventDefault()
                }
            }
        }

        const handleContainerScroll = () => {
            if (!params.manual) {
                const top = params.container?.scrollTop + props.scrollOffset
                ;(params.list || []).forEach((item: AnchorListItem, idx: number) => {
                    const next = params.list[idx + 1]
                    params.actives[idx] = false
                    if (next) {
                        if (item.offset <= top && next.offset >= top) {
                            params.actives[idx] = true
                        }
                    } else if (item.offset <= top) params.actives[idx] = true
                })
            }
        }

        const handleAnchorLink = (data: AnchorLinkItem, evt?: Event) => {
            const elem = document.getElementById(data.id)
            if (elem) {
                const top = $tools.getElementActualOffsetTopOrLeft(elem) - props.scrollOffset
                $tools.scrollToPos(
                    params.container,
                    params.container?.scrollTop,
                    top - (props.reserveOffset || 0),
                    props.duration
                )
            }
            ;(params.list || []).forEach((item: AnchorListItem, idx: number) => {
                params.actives[idx] = false
                if (item.id === data.id) params.actives[idx] = true
            })
            params.manual.status = true
            if (params.manual.timer) clearTimeout(params.manual.timer)
            params.manual.timer = setTimeout(() => (params.manual.status = false), props.duration)
            emit('click', evt)
        }

        const renderAnchorList = () => {
            const links: any[] = []
            ;(params.list || []).forEach((link: AnchorListItem, idx: number) => {
                links.push(
                    <MiAnchorLink
                        id={link.id}
                        title={link.title}
                        active={params.actives[idx]}
                        reserveOffset={props.reserveOffset}
                        listenerContainer={params.container}
                        onClick={handleAnchorLink}
                    />
                )
            })
            return links
        }

        watch(
            () => props.listenerContainer,
            (container: HTMLElement) => {
                $tools.off(params.container, 'scroll', handleContainerScroll)
                params.container = container ?? (document.body || document.documentElement)
                $tools.on(params.container, 'scroll', handleContainerScroll)
            },
            { immediate: true, deep: true }
        )

        onMounted(async () => {
            await nextTick()
            setTimeout(() => {
                parseAnchorText()
                init()
            }, props.delayInit)
        })

        onBeforeUnmount(() => {
            $tools.off(params.container, 'scroll', handleContainerScroll)
            $tools.off(window, 'click', (evt) => handleMaskClose(evt))
        })

        return () =>
            getPropSlot(slots, props) || params.list.length > 0 ? (
                <div class={styled.container} id={params.containerId}>
                    <Transition name={params.anim} appear={true}>
                        <div
                            ref={anchorRef}
                            class={styled.anchor}
                            key={params.id}
                            onMouseleave={handleMouseleaveAnchor}
                            style={{
                                ...$tools.wrapPositionOrSpacing(props.position),
                                zIndex: Date.now()
                            }}
                            v-show={params.open}>
                            <div class={styled.anchorTitle}>
                                <div class={styled.anchorIcon}>
                                    <PushpinOutlined
                                        title={
                                            params.affix
                                                ? t('anchor.sticky.no')
                                                : t('anchor.sticky.yes')
                                        }
                                        rotate={params.affix ? -45 : 0}
                                        onClick={handleAnchorAffix}
                                    />
                                </div>
                                <div class={styled.anchorIcon}>
                                    <CloseCircleOutlined
                                        title={t('anchor.close')}
                                        onClick={handleAnchorClose}
                                    />
                                </div>
                            </div>
                            <div class={styled.anchorInner}>
                                {getPropSlot(slots, props) ?? renderAnchorList()}
                            </div>
                        </div>
                    </Transition>
                    <Transition name={params.anim} appear={true}>
                        <div
                            ref={stickyRef}
                            class={styled.sticky}
                            key={params.key}
                            onMouseenter={handleMouseenterSticky}
                            style={{
                                ...$tools.wrapPositionOrSpacing(props.position),
                                zIndex: Date.now()
                            }}
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
