import { defineComponent, h, isVNode, ref, computed, Transition } from 'vue'
import { MenuTitleProperties } from './props'
import { Tag } from 'ant-design-vue'
import { TagsFilled } from '@ant-design/icons-vue'
import { useLayoutStore } from '../../stores/layout'
import { useMenuStore } from '../../stores/menu'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { getPrefixCls } from '../_utils/props'
import applyTheme from '../_utils/theme'
import styled from './style/title.module.less'

const MiMenuItemTitle = defineComponent({
    name: 'MiMenuItemTitle',
    inheritAttrs: false,
    props: MenuTitleProperties(),
    setup(props) {
        const fadeAnim = getPrefixCls('anim-fade')
        const scaleAnim = getPrefixCls('anim-scale')
        const useLayout = useLayoutStore()
        const useMenu = useMenuStore()
        const collapsed = computed(() => useLayout.collapsed)
        const activeKeys = computed(() => useMenu.activeKeys)
        const openKeys = computed(() => useMenu.openKeys)
        const relationshipChain = computed(() => useMenu.relationshipChain)
        const prefixCls = getPrefixCls('menu-item-title')
        applyTheme(styled)

        const renderIcon = () => {
            const icon = props?.item?.meta?.icon || <TagsFilled />
            const classes = [
                styled.icon,
                { [styled.collapsed]: collapsed.value },
                `${prefixCls}-icon`
            ]
            return (
                <Transition name={fadeAnim} appear={true}>
                    <div class={classes}>{isVNode(icon) ? icon : h(icon)}</div>
                </Transition>
            )
        }

        const renderTitle = () => {
            const title = props?.item?.meta?.title || null
            const subTitle = props?.item?.meta?.subTitle || null
            return (
                <Transition name={fadeAnim} appear={true}>
                    {title ? (
                        <div class={[styled.title, `${prefixCls}-name`]} v-show={!collapsed.value}>
                            {title ? (
                                <span
                                    title={title}
                                    innerHTML={$tools.beautySub(props?.item?.meta?.title, 4)}
                                />
                            ) : null}
                            {subTitle ? (
                                <span
                                    class={styled.titleSub}
                                    innerHTML={$tools.beautySub(props?.item?.meta?.subTitle, 8)}
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
            if (Object.keys(tagInfo).length > 0) {
                if (tagInfo?.content) {
                    tag.value = (
                        <Tag
                            class={[styled.tag, `${prefixCls}-tag`]}
                            color={tagInfo?.color}
                            innerHTML={tagInfo.content}
                            v-show={!collapsed.value}
                            style={{
                                borderRadius: $tools.convert2rem(
                                    $tools.distinguishSize(tagInfo?.radius)
                                )
                            }}
                        />
                    )
                } else if (tagInfo?.icon) {
                    const MiMenuItemTitleTagIcon: any = isVNode(tagInfo?.icon)
                        ? tagInfo?.icon
                        : h(tagInfo?.icon)
                    tag.value = (
                        <MiMenuItemTitleTagIcon
                            class={[styled.tag, `${prefixCls}-tag`]}
                            v-show={!collapsed.value}
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
                <Transition name={scaleAnim} appear={true}>
                    {tag.value}
                </Transition>
            )
        }

        const classes = computed(() => {
            const key = $g.prefix + props?.item?.name
            return [
                styled.container,
                { [styled.active]: activeKeys.value.includes(key) },
                { [styled.collapsed]: collapsed.value },
                {
                    [styled.fold]:
                        props?.activeKey &&
                        relationshipChain.value.includes(props?.activeKey) &&
                        !openKeys.value.includes(props.activeKey)
                }
            ]
        })

        return () => (
            <div class={classes.value}>
                {renderIcon()}
                {renderTitle()}
                {renderTag()}
            </div>
        )
    }
})

export default MiMenuItemTitle
