import { computed, defineComponent, Fragment } from 'vue'
import { ItemsListProps, type ListItem } from './props'
import { $tools } from '../../../utils/tools'
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

        const containerStyle = computed(() => {
            return {
                background: props?.background || null,
                borderRadius: $tools.convert2rem($tools.distinguishSize(props?.radius)),
                ...$tools.getSpacingStyle(props?.padding, 'padding')
            }
        })

        const renderThumb = (item?: ListItem) => {
            let img = null
            const thumb = item?.thumb
            if (typeof thumb === 'string') img = <MiImage src={thumb} />
            if (typeof thumb === 'object') {
                img = (
                    <MiImage
                        src={thumb?.src}
                        alt={thumb?.alt}
                        width={thumb?.width}
                        height={thumb?.height}
                        radius={thumb?.radius}
                    />
                )
            }
            return (
                <div
                    class={styled.thumb}
                    style={
                        typeof thumb === 'object'
                            ? {
                                  background: thumb?.background || null,
                                  width: $tools.convert2rem(
                                      $tools.distinguishSize(thumb?.width || 320)
                                  ),
                                  borderRadius: $tools.convert2rem(
                                      $tools.distinguishSize(thumb?.radius)
                                  )
                              }
                            : null
                    }>
                    {img}
                </div>
            )
        }

        const renderInfo = (item?: ListItem) => {
            console.log(item)
        }

        const renderList = () => {
            const items = []
            for (let i = 0, l = props?.data?.length; i < l; i++) {
                const item = props?.data?.[i]
                const elem = (
                    <Fragment>
                        {renderThumb(item)}
                        {renderInfo(item)}
                    </Fragment>
                )
                items.push(
                    <div class={styled.item}>
                        {item?.link ? (
                            <MiLink
                                link={item?.link}
                                target={item?.target || '_self'}
                                query={item?.query}>
                                {elem}
                            </MiLink>
                        ) : (
                            elem
                        )}
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
