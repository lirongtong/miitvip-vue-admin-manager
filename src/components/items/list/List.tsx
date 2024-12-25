import { computed, defineComponent, Fragment } from 'vue'
import { ItemsListProps, type ListItem } from './props'
import { $tools } from '../../../utils/tools'
import type { TextData } from '../../../utils/types'
import MiLink from '../../link/Link'
import MiImage from '../../image/Image'
import applyTheme from '../../_utils/theme'
import styled from './style/list.module.less'

const MiItemsList = defineComponent({
    name: 'MiItemsList',
    inheritAttrs: false,
    props: ItemsListProps(),
    setup(props) {
        applyTheme(styled)

        const colors = ['pink', 'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple']
        const containerStyle = computed(() => {
            return {
                background: props?.type !== 'card' ? props?.background : null,
                borderRadius: $tools.convert2rem($tools.distinguishSize(props?.radius)),
                ...$tools.getSpacingStyle(props?.padding, 'padding')
            }
        })

        const renderThumb = (item?: ListItem) => {
            const setting = props?.thumbSetting || {}
            const width = $tools.convert2rem($tools.distinguishSize(setting?.width || 320))
            const radius = $tools.convert2rem($tools.distinguishSize(setting?.radius))
            return (
                <div class={styled.thumbInner}>
                    <div
                        class={[styled.thumb, styled[setting?.align || 'center']]}
                        style={{
                            width,
                            minWidth: width,
                            borderRadius: radius,
                            background: setting?.background || null,
                            ...$tools.getSpacingStyle(setting?.margin)
                        }}>
                        <MiImage
                            src={item?.thumb}
                            alt={item?.title}
                            width={setting?.width}
                            height={setting?.height}
                            radius={setting?.radius}
                        />
                    </div>
                    {renderDate(item)}
                </div>
            )
        }

        const renderInfo = (item?: ListItem) => {
            const title = $tools.deepAssign(
                $tools.getTextSetting({
                    size: { mobile: 18, tablet: 20, laptop: 24 },
                    bold: true,
                    lineHeight: { mobile: 24, tablet: 30, laptop: 36 }
                }),
                $tools.getTextSetting(props?.titleSetting),
                $tools.getTextSetting(item?.title)
            ) as TextData
            const intro = $tools.deepAssign(
                $tools.getTextSetting({
                    size: { mobile: 14, tablet: 16, laptop: 18 },
                    lineHeight: { mobile: 20, tablet: 24, laptop: 28 }
                }),
                $tools.getTextSetting(props?.introSetting),
                $tools.getTextSetting(item?.intro)
            ) as TextData
            return (
                <div class={styled.info}>
                    <div
                        class={styled.infoTitle}
                        innerHTML={title?.text}
                        style={title?.style}></div>
                    <div
                        class={styled.infoIntro}
                        innerHTML={intro?.text}
                        style={intro?.style}></div>
                </div>
            )
        }

        const renderDate = (item?: ListItem) => {
            if (item?.date) {
                const date = $tools.deepAssign(
                    $tools.getTextSetting({ size: { mobile: 12, tablet: 14 } }),
                    $tools.getTextSetting(props?.dateSetting),
                    $tools.getTextSetting(item?.date)
                ) as TextData
                return <div class={styled.date} innerHTML={date?.text} style={date?.style}></div>
            } else return null
        }

        const renderLine = () => {
            return (
                <div
                    class={styled.line}
                    style={{
                        background: props?.dividing?.color,
                        height: $tools.convert2rem(
                            $tools.distinguishSize(props?.dividing?.height || 1)
                        ),
                        ...$tools.getSpacingStyle(
                            props?.dividing?.margin || { top: 16, bottom: 16 }
                        )
                    }}></div>
            )
        }

        const renderList = () => {
            const items = []
            for (let i = 0, l = props?.data?.length; i < l; i++) {
                const item = props?.data?.[i]
                const elem = (
                    <Fragment>
                        {item?.thumb ? renderThumb(item) : null}
                        {renderInfo(item)}
                    </Fragment>
                )
                items.push(
                    <div class={styled.item}>
                        {item?.link ? (
                            <MiLink
                                class={styled.itemInner}
                                path={item?.link}
                                target={item?.target || '_self'}
                                query={item?.query}>
                                {elem}
                            </MiLink>
                        ) : (
                            <div class={styled.itemInner}>{elem}</div>
                        )}
                        {props?.type !== 'card' && i < l - 1 ? renderLine() : null}
                    </div>
                )
            }
            return <div class={styled.items}>{...items}</div>
        }

        return () => (
            <div class={styled.container} style={containerStyle.value}>
                {renderList()}
            </div>
        )
    }
})

export default MiItemsList
