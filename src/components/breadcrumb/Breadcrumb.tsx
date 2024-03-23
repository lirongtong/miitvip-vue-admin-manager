import { Transition, defineComponent, createVNode, watch } from 'vue'
import { BreadcrumbProps } from './props'
import { getPrefixCls } from '../_utils/props'
import { useRoute } from 'vue-router'
import { $tools } from '../../utils/tools'
import { useBreadcrumbsStore } from '../../stores/breadcrumbs'
import { HomeOutlined } from '@ant-design/icons-vue'
import MiLink from '../link/Link'
import applyTheme from '../_utils/theme'
import styled from './style/breadcrumb.module.less'

const MiBreadcrumb = defineComponent({
    name: 'MiBreadcrumb',
    inheritAttrs: false,
    props: BreadcrumbProps(),
    setup(props) {
        const route = useRoute()
        const useBreadcrumbs = useBreadcrumbsStore()
        applyTheme(styled)

        const getBreadcrumbs = () => {
            const matched = route.matched
            const breadcrumbs: any[] = []
            const icon = createVNode(HomeOutlined)
            if (matched.length <= 1) {
                breadcrumbs.push({
                    title: matched[0]?.meta?.title ?? matched[0].name,
                    icon
                })
            } else {
                matched.forEach((match, idx) => {
                    const title = match?.meta?.title ?? match.name
                    if (idx === matched.length - 1) {
                        /** current */
                        if (!title) {
                            const last = breadcrumbs.pop()
                            if (last) breadcrumbs.push({ title: last.title })
                        } else breadcrumbs.push({ title })
                    } else {
                        if (idx === 0) {
                            /** home */
                            breadcrumbs.push({
                                title,
                                icon,
                                path: match.path ?? '/'
                            })
                        } else {
                            /** other */
                            if (title) {
                                let path = (match.redirect ?? match.path ?? '/') as string
                                if (path.substring(0, 1) !== '/') path = `/${path}`
                                breadcrumbs.push({
                                    title,
                                    path
                                })
                            }
                        }
                    }
                })
            }
            useBreadcrumbs.$patch({ breadcrumbs })
        }

        const renderBreadcrumbItems = (): any[] => {
            const items: any[] = []
            const breadcrumbs = (useBreadcrumbs.breadcrumbs || []) as any[]
            breadcrumbs.forEach((breadcrumb: any) => {
                const link = (
                    <MiLink path={breadcrumb?.path} key={breadcrumb?.title ?? breadcrumb.name}>
                        {breadcrumb.icon ?? null}
                        {breadcrumb?.title}
                    </MiLink>
                )
                items.push(
                    <span class={styled.item}>
                        <span class={styled.link}>{link}</span>
                        <span class={styled.separator}>{props.separator}</span>
                    </span>
                )
            })
            return items
        }

        watch(
            () => route,
            () => getBreadcrumbs(),
            { immediate: true, deep: true }
        )

        return () => (
            <Transition name={getPrefixCls(`anim-${props.animation}`)} appear={true}>
                <div class={styled.container} key={route.name ?? $tools.uid()}>
                    {...renderBreadcrumbItems()}
                </div>
            </Transition>
        )
    }
})

export default MiBreadcrumb
