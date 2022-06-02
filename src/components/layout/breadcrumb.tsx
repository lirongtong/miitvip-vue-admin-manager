import { defineComponent, watch, createVNode, Transition } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { HomeOutlined } from '@ant-design/icons-vue'
import { $g } from '../../utils/global'
import { getPrefixCls } from '../_utils/props-tools'
import PropTypes from '../_utils/props-types'

export default defineComponent({
    name: 'MiBreadcrumb',
    inheritAttrs: false,
    props: {
        prefixCls: String,
        separator: PropTypes.string.def('/')
    },
    setup(props) {
        const prefixCls = getPrefixCls('layout-breadcrumb', props.prefixCls)
        const animation = getPrefixCls(`anim-breadcrumb`)
        const route = useRoute()

        const getBreadcrumbs = () => {
            const matched = route.matched
            const breadcrumbs = []
            const icon = createVNode(HomeOutlined)
            if (matched.length <= 1) {
                breadcrumbs.push({
                    title: matched[0]?.meta?.title
                        ? matched[0].meta.title
                        : matched[0].name,
                    icon
                })
            } else {
                matched.forEach((match, idx) => {
                    const title = (match?.meta?.title)
                        ? match.meta.title
                        : match.name
                    if (idx === matched.length - 1) {
                        /** current */
                        if (!title) {
                            const last = breadcrumbs.pop()
                            if (last) breadcrumbs.push({title: last.title})
                        } else breadcrumbs.push({title})
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
                                let path = match.redirect ?? match.path ?? '/' as any
                                if (path.substr(0, 1) !== '/') path = `/${path}`
                                breadcrumbs.push({
                                    title,
                                    path
                                })
                            }
                        }
                    }
                })
            }
            $g.breadcrumbs = breadcrumbs
        }
        getBreadcrumbs()

        watch(route, () => {
            getBreadcrumbs()
        })

        const getBreadcrumbItems = () => {
            const items = []
            const breadcrumbs = $g.breadcrumbs
            breadcrumbs.forEach((breadcrumb) => {
                const link = $g.regExp.url.test(breadcrumb.path)
                    ? (
                        <RouterLink to={{path: breadcrumb.path}}>
                            {breadcrumb.icon ?? null}
                            {breadcrumb.title}
                        </RouterLink>
                    )
                    : (
                        <a href={breadcrumb.path}>
                            {breadcrumb.icon ?? null}
                            {breadcrumb.title}
                        </a>
                    )
                items.push(
                    <span class={`${prefixCls}-item`}>
                        <span class={`${prefixCls}-link`}>{link}</span>
                        <span class={`${prefixCls}-separator`}>{props.separator}</span>
                    </span>
                )
            })
            return [...items]
        }
        return () => (
            <Transition name={animation} appear={true}>
                <div class={prefixCls} key={route.name}>
                    {...getBreadcrumbItems()}
                </div>
            </Transition>
        )
    }
})