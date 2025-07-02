import { Transition, defineComponent, createVNode, watch } from 'vue'
import { BreadcrumbProps } from './props'
import { getPrefixCls } from '../_utils/props'
import { useRoute, type RouteRecordNormalized } from 'vue-router'
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
        const breadcrumbsStore = useBreadcrumbsStore()
        applyTheme(styled)

        const getBreadcrumbs = () => {
            const breadcrumbs: any[] = route.matched.map((match, idx) =>
                resolveMatchedRoute(match, idx)
            )
            breadcrumbsStore.$patch({ breadcrumbs })
        }

        const resolveMatchedRoute = (match: RouteRecordNormalized, idx: number): any => {
            const title = match.meta?.title ?? match.name
            let path = match.redirect ?? match.path ?? '/'
            if (typeof path === 'string' && !path.startsWith('/')) path = '/' + path
            return {
                title,
                icon: idx === 0 ? createVNode(HomeOutlined) : undefined,
                path: idx === route.matched.length - 1 ? undefined : path
            }
        }

        const renderBreadcrumbItems = (): any[] =>
            breadcrumbsStore.breadcrumbs.map((breadcrumb: any) => (
                <span class={styled.item} key={breadcrumb.title}>
                    <span class={styled.link}>
                        <MiLink path={breadcrumb?.path}>
                            {breadcrumb.icon ?? null}
                            {breadcrumb.title}
                        </MiLink>
                    </span>
                    <span class={styled.separator}>{props.separator}</span>
                </span>
            ))

        watch(
            () => route.fullPath,
            () => getBreadcrumbs(),
            { immediate: true, deep: true }
        )

        return () => (
            <Transition name={getPrefixCls(`anim-${props.animation}`)} appear={true}>
                <div class={styled.container} key={`breadcrumb-${route.fullPath}`}>
                    {...renderBreadcrumbItems()}
                </div>
            </Transition>
        )
    }
})

export default MiBreadcrumb
