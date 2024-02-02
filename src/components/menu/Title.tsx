import { defineComponent, h, isVNode, ref, computed, Transition } from 'vue'
import { MenuTitleProperties } from './props'
import { Row, Tag } from 'ant-design-vue'
import { TagsFilled } from '@ant-design/icons-vue'
import { useLayoutStore } from '../../stores/layout'
import { useMenuStore } from '../../stores/menu'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { getPrefixCls } from '../_utils/props'
import applyTheme from '../_utils/theme'
import styled from './style/title.module.less'

const MiMenuTitle = defineComponent({
    name: 'MiMenuTitle',
    inheritAttrs: false,
    props: MenuTitleProperties(),
    setup(props) {
        const anim = getPrefixCls('anim-fade')
        const layoutStore = useLayoutStore()
        const menuStore = useMenuStore()
        const collapsed = computed(() => layoutStore.collapsed)
        const activeKeys = computed(() => menuStore.activeKeys)
        const openKeys = computed(() => menuStore.openKeys)
        const relationshipChain = computed(() => menuStore.relationshipChain)
        applyTheme(styled)

        const renderIcon = () => {
            const icon = props?.item?.meta?.icon || <TagsFilled />
            return (
                <Transition name={anim} appear={true}>
                    <Row class={`${styled.icon}${collapsed.value ? ` ${styled.collapsed}` : ''}`}>
                        {isVNode(icon) ? icon : h(icon)}
                    </Row>
                </Transition>
            )
        }

        const renderTitle = () => {
            const title = props?.item?.meta?.title || null
            const subTitle = props?.item?.meta?.subTitle || null
            console.log(subTitle)
            return (
                <Transition name={anim} appear={true}>
                    {title && !collapsed.value ? (
                        <div class={styled.title}>
                            {title ? (
                                <span
                                    title={title}
                                    innerHTML={$tools.beautySub(props?.item?.meta?.title, 4)}
                                />
                            ) : null}
                            {subTitle ? (
                                <span
                                    class={styled.titleSub}
                                    innerHTML={$tools.beautySub(props?.item?.meta?.subTitle, 7)}
                                    title={subTitle}
                                />
                            ) : null}
                        </div>
                    ) : null}
                </Transition>
            )
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
            return (
                <Transition name={anim} appear={true}>
                    {tag.value}
                </Transition>
            )
        }

        const classes = computed(() => {
            const key = $g.prefix + props?.item?.name
            return [
                styled.container,
                { [styled.active]: activeKeys.value.includes(key) },
                {
                    [styled.opened]:
                        props?.activeKey &&
                        relationshipChain.value.includes(props?.activeKey) &&
                        !openKeys.value.includes(props.activeKey)
                }
            ]
        })

        return () => (
            <Row class={classes.value}>
                {renderIcon()}
                {renderTitle()}
                {renderTag()}
            </Row>
        )
    }
})

export default MiMenuTitle
