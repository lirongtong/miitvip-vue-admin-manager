import { defineComponent, computed } from 'vue'
import { ItemsDetailProps } from './props'
import { $tools } from '../../../utils/tools'
import { TextData } from '../../../utils/types'
import { type ThumbSetting } from '../../../utils/types'
import MiImage from '../../image/Image'
import applyTheme from '../../_utils/theme'
import styled from './style/detail.module.less'

const MiItemsDetail = defineComponent({
    name: 'MiItemsDetail',
    inheritAttrs: false,
    props: ItemsDetailProps(),
    setup(props) {
        applyTheme(styled)

        const itemStyle = computed(() => {
            const num = $tools.distinguishSize(props.number)
            const gap = $tools.getGap(props.gap)
            return {
                rowGap: $tools.convert2rem(gap?.row || gap),
                columnGap: $tools.convert2rem(gap?.column || gap),
                gridTemplateColumns: `repeat(${num}, 1fr)`
            }
        })

        const renderDetail = () => {
            const items: any = []
            for (let i = 0, l = props?.data?.length; i < l; i++) {
                const item = props?.data?.[i]

                const thumb = $tools.deepAssign(
                    {
                        radius: 8,
                        width: { mobile: '100%', tablet: 260, laptop: 320 }
                    },
                    props?.thumbSetting || {}
                ) as ThumbSetting
                const title = $tools.deepAssign(
                    $tools.getTextSetting({ size: 18, bold: true }),
                    $tools.getTextSetting(props?.titleSetting),
                    $tools.getTextSetting(item?.title)
                ) as TextData
                const subtitle = $tools.deepAssign(
                    $tools.getTextSetting({}),
                    $tools.getTextSetting(props?.subtitleSetting),
                    $tools.getTextSetting(item?.subtitle)
                ) as TextData

                items.push(
                    <div class={styled.item}>
                        <div class={styled.itemThumb} style={{ width: thumb?.width }}>
                            <MiImage
                                src={item?.thumb}
                                width={thumb?.width}
                                height={thumb?.height}
                                radius={thumb?.radius}
                                style={{
                                    background: thumb?.background || null,
                                    ...$tools.getSpacingStyle(thumb?.margin)
                                }}
                            />
                        </div>
                        <div
                            class={styled.itemTitle}
                            innerHTML={title?.text}
                            style={title?.style}></div>
                        <div
                            class={styled.itemSubtitle}
                            innerHTML={subtitle?.text}
                            style={subtitle?.style}></div>
                    </div>
                )
            }
            return (
                <div class={styled.items} style={itemStyle.value}>
                    {...items}
                </div>
            )
        }

        return () => (
            <div class={styled.container}>
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
