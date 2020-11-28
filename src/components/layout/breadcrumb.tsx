import { defineComponent, createVNode } from 'vue'
import { Breadcrumb } from 'ant-design-vue'
import { HomeOutlined } from '@ant-design/icons-vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
    name: 'MiBreadcrumb',
    watch: {$route() {this.getBreadcrumbs()}},
    created() {this.getBreadcrumbs()},
    methods: {
        getBreadcrumbs() {
            const matched = this.$route.matched
            const breadcrumbs = []
            const icon = createVNode(HomeOutlined)
            if (matched.length <= 1) {
                breadcrumbs.push({
                    title: matched[0].meta && matched[0].meta.title
                        ? matched[0].meta.title
                        : matched[0].name,
                    icon
                })
            } else {
                for (let i = 0, len = matched.length; i < len; i++) {
                    const match = matched[i]
                    const title = (match.meta && match.meta.title)
                        ? match.meta.title
                        : match.name
                    if (i === len - 1) {
                        /** current */
                        if (!title) {
                            const last = breadcrumbs.pop()
                            if (last) breadcrumbs.push({title: last.title})
                        } else {
                            breadcrumbs.push({title})
                        }
                    } else {
                        if (i === 0) {
                            /** home */
                            breadcrumbs.push({
                                title,
                                icon,
                                path: match.path ?? '/'
                            })
                        } else {
                            /** other */
                            if (title) {
                                let path = match.redirect ?? match.path ?? '/'
                                if (path.substr(0, 1) !== '/') path = `/${path}`
                                breadcrumbs.push({
                                    title,
                                    path
                                })
                            }
                        }
                    }
                }
            }
            this.$g.breadcrumbs = breadcrumbs
        },
        getBreadcrumbItems() {
            const items = []
            for (let i = 0, l = this.$g.breadcrumbs.length; i < l; i++) {
                const cur = this.$g.breadcrumbs[i]
                const icon = cur.icon ?? null
                const template = <>
                    { icon }
                    { cur.title }
                </>
                items.push(
                    <Breadcrumb.Item key={i}>
                        { cur.path ? (
                            <a href={cur.path}>
                                { template }
                            </a>
                        ) : template }
                    </Breadcrumb.Item>
                )
            }
            return [...items]
        }
    },
    render() {
        const prefixCls = this.$tools.getPrefixCls('layout-breadcrumb')
        return (
            <Breadcrumb class={prefixCls}>
                { this.getBreadcrumbItems() }
            </Breadcrumb>   
        )
    }
})