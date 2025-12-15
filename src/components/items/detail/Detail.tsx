import {
    defineComponent,
    computed,
    reactive,
    renderSlot,
    type SlotsType,
    Transition,
    ref,
    onMounted,
    nextTick
} from 'vue'
import { ItemsDetailProps } from './props'
import { $tools } from '../../../utils/tools'
import { $g } from '../../../utils/global'
import { TextData } from '../../../utils/types'
import { type ThumbSetting } from '../../../utils/types'
import type { ListItem } from '../list/props'
import MiImage from '../../image/Image'
import applyTheme from '../../_utils/theme'
import styled from './style/detail.module.less'

const MiItemsDetail = defineComponent({
    name: 'MiItemsDetail',
    inheritAttrs: false,
    props: ItemsDetailProps(),
    emits: ['update:active', 'itemClick'],
    slots: Object as SlotsType<{
        title?: any
        subtitle?: any
        detail?: any
    }>,
    setup(props, { slots, emit }) {
        applyTheme(styled)

        const container = ref(null)
        const items = ref([])

        // Arrow Icon
        const icon = (
            <svg
                id="chevron-right"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24">
                <rect id="Boundary_24" data-name="Boundary 24" width="24" height="24" fill="none" />
                <path
                    id="chevron-right-2"
                    data-name="chevron-right"
                    d="M9.852,7.047,5.633,2.828,1.414,7.047,0,5.633,5.633,0l5.633,5.633Z"
                    transform="translate(15.156 6) rotate(90)"
                    fill={props?.arrowColor || 'var(--mi-items-detail-arrow)'}
                />
            </svg>
        )

        // 一行显示个数
        const number = computed(() => {
            const num = $tools.distinguishSize(props.number)
            return num > 1 ? num : 1
        })

        // 缩略图配置
        const thumbSetting = computed(() => {
            return $tools.deepAssign({ radius: 8 }, props?.thumbSetting || {}) as ThumbSetting
        })

        // 间距
        const gap = computed(() => {
            return $tools.getGap(props.gap)
        })

        // 最大宽度
        const maxWidth = computed(() => {
            const width = $tools.distinguishSize(thumbSetting.value?.width)
            return typeof width === 'number'
                ? width * number.value + (gap.value?.column || gap.value) * (number.value - 1)
                : null
        })

        // 每一项的样式
        const itemStyle = computed(() => {
            return {
                rowGap: $tools.convert2rem(gap.value?.row || gap.value),
                columnGap: $tools.convert2rem(gap.value?.column || gap.value),
                gridTemplateColumns: `repeat(${number.value}, 1fr)`,
                maxWidth: $tools.convert2rem(maxWidth.value)
            }
        })

        // 详情内容容器样式
        const detailContentStyle = computed(() => {
            const width = $tools.distinguishSize(props?.maxWidth)
            const containerWidth = container.value ? container.value.clientWidth : 0
            const calcWidth =
                typeof width === 'number' ? (width > containerWidth ? containerWidth : width) : 0
            const margin =
                calcWidth && typeof maxWidth.value === 'number' && calcWidth > maxWidth.value
                    ? (calcWidth - maxWidth.value) / 2
                    : 0
            const extra = {} as any
            if (margin) {
                const spacing = $tools.convert2rem(margin)
                extra.marginLeft = $tools.convert2rem(-margin)
                extra.width = `calc(100% + ${$tools.convert2rem(margin * 2)})`
                extra.paddingLeft = spacing
                extra.paddingRight = spacing
            }
            return {
                gridColumnStart: 1,
                gridColumnEnd: number.value + 1,
                ...extra
            }
        })

        // 滚动偏移量
        const offset = computed(() => {
            return (
                $tools.distinguishSize(props?.scrollOffset) ||
                ($g?.showHistoricalRouting ? 128 : 80)
            )
        })

        const params = reactive({
            row: -1,
            active: -1
        })

        const handleItemRef = (el?: any) => {
            if (el) items.value.push(el)
        }

        const handleItemClick = (item: ListItem, index: number, evt?: any) => {
            const row = Math.floor(index / number.value)
            params.row = params.active === index ? -1 : row
            if (params.active === index) params.active = -1
            else params.active = index
            const elem = evt?.target ? $tools.getParents(evt?.target, `.${styled.item}`) : null
            if (props.scrollToPosition && elem) $tools.back2pos(elem, offset.value)
            emit('update:active', params.active)
            emit('itemClick', item, params.active, evt)
        }

        const handleDetailContentDisplay = (i: number): boolean => {
            if (
                ((i + 1) % number.value === 0 ||
                    (i === props?.data?.length - 1 && (i + 1) % number.value !== 0)) &&
                Math.floor(i / number.value) === params.row
            )
                return true
            return false
        }

        const renderDetail = () => {
            const items: any = []
            for (let i = 0, l = props?.data?.length; i < l; i++) {
                const item = props?.data?.[i]

                const title = $tools.deepAssign(
                    $tools.getTextSetting({ size: 18, bold: true, align: 'center' }),
                    $tools.getTextSetting(props?.titleSetting),
                    $tools.getTextSetting(item?.title)
                ) as TextData

                const subtitle = $tools.deepAssign(
                    $tools.getTextSetting({ size: 14, align: 'center' }),
                    $tools.getTextSetting(props?.subtitleSetting),
                    $tools.getTextSetting(item?.subtitle)
                ) as TextData

                items.push(
                    <div
                        ref={handleItemRef}
                        class={[styled.item, { [styled.itemActive]: params.active === i }]}
                        style={{
                            width: $tools.convert2rem(
                                $tools.distinguishSize(thumbSetting.value?.width)
                            )
                        }}
                        onClick={(evt?: any) => handleItemClick(item, i, evt)}>
                        <div
                            class={styled.itemThumb}
                            style={{
                                width: $tools.convert2rem(
                                    $tools.distinguishSize(thumbSetting.value?.width)
                                ),
                                borderRadius: $tools.convert2rem(
                                    $tools.distinguishSize(thumbSetting.value?.radius)
                                )
                            }}>
                            <MiImage
                                src={item?.thumb}
                                width={thumbSetting.value?.width}
                                height={thumbSetting.value?.height}
                                radius={thumbSetting.value?.radius}
                                style={{
                                    background: thumbSetting.value?.background || null,
                                    ...$tools.getSpacingStyle(thumbSetting.value?.margin)
                                }}
                            />
                            <div
                                class={[
                                    styled.itemThumbBtn,
                                    { [styled.itemThumbBtnActive]: params.active === i }
                                ]}>
                                <div class={[styled.btn]}>{icon}</div>
                            </div>
                            <div class={styled.itemThumbLine}></div>
                        </div>
                        {slots?.title ? (
                            renderSlot(slots, 'title', { title })
                        ) : (
                            <div
                                class={styled.itemTitle}
                                innerHTML={title?.text}
                                style={title?.style}></div>
                        )}
                        {slots?.subtitle ? (
                            renderSlot(slots, 'subtitle', { subtitle })
                        ) : (
                            <div
                                class={styled.itemSubtitle}
                                innerHTML={subtitle?.text}
                                style={subtitle?.style}></div>
                        )}
                    </div>
                )
                if (handleDetailContentDisplay(i)) {
                    items.push(
                        <Transition name={`mi-anim-${props?.animation || 'shake'}`} appear={true}>
                            {params.active !== -1 &&
                            params.active >= params.row * number.value &&
                            params.active <= (params.row + 1) * number.value - 1 ? (
                                <div
                                    class={[styled.item, styled.itemDetail]}
                                    style={detailContentStyle.value}>
                                    {renderSlot(slots, 'detail', {
                                        item: props?.data?.[params.active] || {},
                                        index: params.active
                                    })}
                                </div>
                            ) : null}
                        </Transition>
                    )
                }
            }
            return (
                <div class={styled.items} style={itemStyle.value}>
                    {...items}
                </div>
            )
        }

        onMounted(() => {
            nextTick().then(() => {
                if (typeof props?.active !== 'undefined' && props?.active >= 0) {
                    handleItemClick(props?.data?.[props?.active], props?.active)
                }
            })
        })

        return () => (
            <div ref={container} class={styled.container}>
                <div
                    class={styled.inner}
                    style={{
                        maxWidth: $tools.convert2rem($tools.distinguishSize(props?.maxWidth))
                    }}>
                    {renderDetail()}
                </div>
            </div>
        )
    }
})

export default MiItemsDetail
