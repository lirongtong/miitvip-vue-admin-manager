import { defineComponent, h, isVNode, ref, computed } from 'vue'
import { MenuTitleProperties } from './props'
import { Flex, Row, Tag } from 'ant-design-vue'
import { TagsFilled } from '@ant-design/icons-vue'
import { useLayoutStore } from '../../stores/layout'
import { $tools } from '../../utils/tools'
import applyTheme from '../_utils/theme'
import styled from './style/title.module.less'

const MiMenuTitle = defineComponent({
    name: 'MiMenuTitle',
    inheritAttrs: false,
    props: MenuTitleProperties(),
    setup(props) {
        const layoutStore = useLayoutStore()
        const collapsed = computed(() => layoutStore.collapsed)
        applyTheme(styled)

        const renderIcon = () => {
            const icon = props?.item?.meta?.icon || <TagsFilled />
            return <Row class={styled.icon}>{isVNode(icon) ? icon : h(icon)}</Row>
        }

        const renderTitle = () => {
            const title = props?.item?.meta?.title || null
            const subTitle = props?.item?.meta?.subTitle || null
            return title && !collapsed.value ? (
                <div class={styled.title}>
                    {title ? <span innerHTML={title} /> : null}
                    {subTitle ? <span class={styled.titleSub} innerHTML={subTitle} /> : null}
                </div>
            ) : null
        }

        const renderTag = () => {
            const tag: any = ref(null)
            const tagInfo = props?.item?.meta?.tag || {}
            if (Object.keys(tagInfo).length > 0 && !collapsed.value) {
                if (tagInfo?.content) {
                    tag.value = (
                        <Tag
                            class={styled.tag}
                            color={tagInfo?.color}
                            innerHTML={tagInfo.content}
                            style={{
                                borderRadius: $tools.convert2rem(
                                    $tools.distinguishSize(tagInfo?.radius)
                                )
                            }}
                        />
                    )
                } else if (tagInfo?.icon) {
                    const MiMenuTitleTagIcon: any = isVNode(tagInfo?.icon)
                        ? tagInfo?.icon
                        : h(tagInfo?.icon)
                    tag.value = (
                        <MiMenuTitleTagIcon
                            class={styled.tag}
                            style={{
                                color: tagInfo?.color,
                                fontSize: $tools.convert2rem($tools.distinguishSize(tagInfo?.size)),
                                borderRadius: $tools.convert2rem(
                                    $tools.distinguishSize(tagInfo?.radius)
                                )
                            }}
                        />
                    )
                }
            }
            return tag.value
        }

        return () => (
            <Flex class={styled.container}>
                {renderIcon()}
                {renderTitle()}
                {renderTag()}
            </Flex>
        )
    }
})

export default MiMenuTitle
