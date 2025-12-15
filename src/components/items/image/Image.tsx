import { defineComponent, computed, ref, Transition } from 'vue'
import { ItemsImageProps, type ImageItem } from './props'
import { $tools } from '../../../utils/tools'
import type { TextData } from '../../../utils/types'
import MiImage from '../../image/Image'
import MiLink from '../../link/Link'
import MiButton from '../../button/Button'
import applyTheme from '../../_utils/theme'
import styled from './style/image.module.less'

const MiItemsImage = defineComponent({
    name: 'MiItemsImage',
    inheritAttrs: false,
    props: ItemsImageProps(),
    setup(props) {
        applyTheme(styled)

        const hover = ref<Record<string, boolean>>({})

        const gapStyle = computed(() => {
            const num = $tools.distinguishSize(props.number)
            const gap = $tools.getGap(props.gap)
            return {
                rowGap: $tools.convert2rem(gap?.row || gap),
                columnGap: $tools.convert2rem(gap?.column || gap),
                gridTemplateColumns: `repeat(${num}, 1fr)`,
                maxWidth: props?.width
                    ? $tools.convert2rem(
                          $tools.distinguishSize(props.width) * num +
                              (gap?.column || gap) * (num - 1)
                      )
                    : `100%`
            }
        })

        const thumbStyle = computed(() => {
            return {
                width: $tools.convert2rem($tools.distinguishSize(props.width)),
                height: !props?.hover?.open
                    ? $tools.convert2rem($tools.distinguishSize(props.height))
                    : null,
                borderRadius: $tools.convert2rem($tools.distinguishSize(props.radius))
            }
        })

        const handleThumbHeight = (elem?: any) => {
            const parent = elem?.parentNode
            if (props.height) {
                if (parent) {
                    parent.style.height = $tools.convert2rem($tools.distinguishSize(props.height))
                }
            } else {
                const height = elem?.clientHeight
                if (height && parent) parent.style.height = $tools.convert2rem(height)
            }
        }

        const renderItemThumb = (item?: ImageItem, placeholder?: boolean) => {
            return item?.thumb ? (
                <div
                    class={placeholder ? styled.itemThumbPlaceholder : styled.itemThumb}
                    style={{
                        borderRadius: $tools.convert2rem($tools.distinguishSize(props.radius))
                    }}>
                    <MiImage src={item.thumb} style={thumbStyle.value} onLoad={handleThumbHeight} />
                </div>
            ) : null
        }

        const renderItemTitle = (item?: ImageItem) => {
            const title = $tools.deepAssign(
                $tools.getTextSetting(props?.titleSetting),
                $tools.getTextSetting(item?.title)
            ) as TextData
            return item?.title ? (
                <div class={styled.itemTitle} innerHTML={title?.text} style={title.style}></div>
            ) : null
        }

        const renderItemSubtitle = (item?: ImageItem) => {
            const subtitle = $tools.deepAssign(
                $tools.getTextSetting(props?.subtitleSetting),
                $tools.getTextSetting(item?.subtitle)
            ) as TextData
            return subtitle?.text ? (
                <div
                    class={styled.itemSubtitle}
                    innerHTML={subtitle?.text}
                    style={subtitle?.style}></div>
            ) : null
        }

        const renderItemSummary = (item?: ImageItem, index?: number) => {
            const animation =
                props?.hover?.animation === 'slide-down'
                    ? { left: 0, top: 0, maxHeight: 0 }
                    : props?.hover?.animation === 'slide-right'
                      ? { width: 0, top: 0, left: 0 }
                      : props?.hover?.animation === 'slide-left'
                        ? { width: 0, top: 0, right: 0 }
                        : { bottom: 0, left: 0, maxHeight: 0 }
            const title = $tools.deepAssign(
                $tools.getTextSetting(props?.titleSetting),
                $tools.getTextSetting(item?.title)
            ) as TextData
            const subtitle = $tools.deepAssign(
                $tools.getTextSetting(props?.subtitleSetting),
                $tools.getTextSetting(item?.subtitle)
            ) as TextData
            const intro = $tools.deepAssign(
                $tools.getTextSetting(props?.introSetting),
                $tools.getTextSetting(item?.intro)
            ) as TextData
            return props?.hover?.open ? (
                <div
                    class={styled.itemSummary}
                    style={{
                        borderRadius: $tools.convert2rem($tools.distinguishSize(props.radius)),
                        ...animation,
                        backdropFilter: props?.hover?.backdrop,
                        background: props?.hover?.background
                    }}>
                    <div class={styled.itemSummaryInner}>
                        {title?.text ? (
                            <div
                                class={styled.itemSummaryTitle}
                                innerHTML={title?.text}
                                style={title?.style}></div>
                        ) : null}
                        {subtitle?.text ? (
                            <div
                                class={styled.itemSummarySubtitle}
                                innerHTML={subtitle?.text}
                                style={subtitle?.style}></div>
                        ) : null}
                        {intro?.text ? (
                            <div
                                class={styled.itemSummaryIntro}
                                innerHTML={intro?.text}
                                style={intro?.style}></div>
                        ) : null}
                    </div>
                    {item?.link ? (
                        <Transition name="mi-anim-scale" appear={true}>
                            {hover.value?.[index] ? (
                                <div class={styled.itemSummaryBtn}>
                                    <MiButton arrow={{ immediate: true }} />
                                </div>
                            ) : null}
                        </Transition>
                    ) : null}
                </div>
            ) : null
        }

        const renderItemLine = () => {
            return props?.lineColor ? (
                <div class={styled.itemLine} style={{ borderBottomColor: props?.lineColor }}></div>
            ) : null
        }

        const renderImages = () => {
            const images = []

            for (let i = 0, l = props?.data?.length; i < l; i++) {
                const item = props?.data?.[i]
                const info = (
                    <div
                        class={[
                            styled.item,
                            { [styled.itemHover]: hover.value?.[i] },
                            styled[props.hover?.animation || 'slide-up'],
                            { [styled.itemHoverScale]: props.hover?.scale }
                        ]}
                        onMouseenter={() => (hover.value[i] = true)}
                        onMouseleave={() => (hover.value[i] = false)}
                        style={{
                            borderRadius: $tools.convert2rem($tools.distinguishSize(props.radius))
                        }}>
                        {renderItemThumb(item)}
                        {renderItemThumb(item, true)}
                        {renderItemTitle(item)}
                        {renderItemSubtitle(item)}
                        {renderItemSummary(item, i)}
                        {renderItemLine()}
                    </div>
                )
                images.push(
                    item?.link ? (
                        <MiLink
                            path={item?.link}
                            target={item?.target || '_self'}
                            query={item?.query}>
                            {info}
                        </MiLink>
                    ) : (
                        info
                    )
                )
            }

            return (
                <div class={styled.items} style={gapStyle.value}>
                    {images}
                </div>
            )
        }

        const renderContainer = () => {
            return (
                <div class={styled.container}>
                    <div class={[styled.inner, { [styled.center]: props.center }]}>
                        {renderImages()}
                    </div>
                </div>
            )
        }

        return () => (props?.data?.length > 0 ? renderContainer() : null)
    }
})

export default MiItemsImage
