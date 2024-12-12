import { defineComponent, computed, renderSlot, Fragment } from 'vue'
import { ItemsTextProps, type TextItem, type TextItemContent } from './props'
import { $tools } from '../../../utils/tools'
import { getPropSlot } from '../../_utils/props'
import type { Position } from '../../../utils/types'
import MiItemsTextMarker from './Marker'
import applyTheme from '../../_utils/theme'
import styled from './style/text.module.less'

const MiItemsText = defineComponent({
    name: 'MiItemsText',
    inheritAttrs: false,
    props: ItemsTextProps(),
    setup(props, { slots }) {
        applyTheme(styled)

        const handleSpacing = (margin: string | number | Position, prefix = 'margin') => {
            return typeof margin === 'string' || typeof margin === 'number'
                ? { [prefix]: $tools.convert2rem($tools.distinguishSize(margin)) }
                : { ...$tools.wrapPositionOrSpacing(margin || {}, prefix) }
        }

        const handleContentStyle = (content: TextItemContent) => {
            return {
                color: content?.color || null,
                fontWeight: content?.bold ? 'bold' : null,
                fontSize: $tools.convert2rem($tools.distinguishSize(content?.size))
            }
        }

        const containerStyle = computed(() => {
            return {
                ...handleSpacing(props?.padding, 'padding'),
                borderRadius: $tools.convert2rem($tools.distinguishSize(props?.radius)),
                backgroundColor: props?.background?.color || null,
                backgroundImage: props?.background?.image
                    ? `url(${props?.background?.image})`
                    : null,
                aspectRatio: props?.background?.aspectRatio
                    ? props?.background?.aspectRatio / 1
                    : null
            }
        })

        const innerStyle = computed(() => {
            return {
                color: props?.color || null,
                fontSize: $tools.convert2rem($tools.distinguishSize(props?.size)),
                borderColor: props?.border?.color || null,
                borderWidth: $tools.convert2rem($tools.distinguishSize(props?.border?.width || 0)),
                borderStyle: props?.border?.width ? 'solid' : null
            }
        })

        const renderItemString = (
            index: number,
            content: string,
            exclude = true,
            item?: TextItem
        ) => {
            const spacing = $tools.convert2rem($tools.distinguishSize(item?.gap || props?.gap))
            const indent = $tools.convert2rem($tools.distinguishSize(props?.indent))
            return (
                <Fragment>
                    <div
                        class={[styled.itemInfo, { [styled.itemInfoCenter]: props.marker?.center }]}
                        style={{
                            marginLeft: indent,
                            marginTop: exclude ? (index !== 0 ? spacing : null) : spacing,
                            fontWeight: props?.bold ? 'bold' : null
                        }}>
                        {props.marker ? (
                            <MiItemsTextMarker
                                marker={props.marker}
                                number={index}
                                color={props?.color}
                            />
                        ) : null}
                        <div class={styled.itemText} innerHTML={content}></div>
                    </div>
                    <div style={{ marginLeft: indent }}>
                        {renderSlot(slots, 'item', { text: content, index, item })}
                    </div>
                </Fragment>
            )
        }

        const renderItemObject = (index: number, item: TextItem) => {
            const items = []
            if (item?.title) items.push(renderItemTitle(item?.title, index))
            if (item?.intro) items.push(renderItemIntro(item?.intro))
            if (item?.items && item?.items?.length > 0) {
                for (let i = 0; i < item?.items?.length; i++) {
                    const subitem = item?.items?.[i]
                    items.push(renderItemString(i, subitem, false, item))
                }
            }
            return (
                <div
                    class={styled.itemObject}
                    style={{
                        marginTop:
                            index !== 0
                                ? $tools.convert2rem($tools.distinguishSize(props?.gap))
                                : null
                    }}>
                    {...items}
                </div>
            )
        }

        const renderItemTitle = (title?: string, index?: number) => {
            let elem = null
            if (title) {
                elem = (
                    <div
                        class={[
                            styled.itemTitle,
                            { [styled.itemTitleCenter]: props?.title?.marker?.center }
                        ]}
                        style={{
                            ...handleSpacing(props?.title?.margin),
                            ...handleContentStyle(props?.title)
                        }}>
                        {props?.title?.marker ? (
                            <MiItemsTextMarker
                                marker={props?.title?.marker}
                                number={index}
                                color={props?.color}
                            />
                        ) : null}
                        <span innerHTML={title}></span>
                    </div>
                )
            }
            return elem
        }

        const renderItemIntro = (intro?: string) => {
            return intro ? (
                <div
                    class={styled.itemIntro}
                    style={{
                        ...handleContentStyle(props?.intro),
                        ...handleSpacing(props?.intro?.margin)
                    }}
                    innerHTML={intro}></div>
            ) : null
        }

        const renderItems = () => {
            const items = []
            for (let i = 0; i < props.items?.length; i++) {
                const item = props.items?.[i]
                if (typeof item === 'string') items.push(renderItemString(i, item))
                if (typeof item === 'object') items.push(renderItemObject(i, item))
            }
            return items
        }

        return () => (
            <div
                class={[styled.container, { [styled.containerCenter]: props?.center }]}
                style={{ ...containerStyle.value }}>
                <div class={styled.inner} style={{ ...innerStyle.value }}>
                    {props?.items?.length > 0 ? (
                        <div class={styled.items}>{...renderItems()}</div>
                    ) : null}
                    {getPropSlot(slots, props)}
                </div>
            </div>
        )
    }
})

export default MiItemsText
