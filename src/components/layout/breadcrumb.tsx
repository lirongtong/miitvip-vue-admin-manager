import { defineComponent, createVNode } from 'vue'
import { Breadcrumb } from 'ant-design-vue'
import { HomeOutlined } from '@ant-design/icons-vue'

export default defineComponent({
    name: 'MiBreadcrumb',
    data() {
        return {
            breadcrumbs: []
        }
    },
    watch: {
        $route() {
            this.getBreadcrumbs()
        }
    },
    mounted() {
        this.getBreadcrumbs()
    },
    methods: {
        getBreadcrumbs() {
            const matched = this.$route.matched
            const breadcrumbs = []
            const icon = createVNode(HomeOutlined)
            if (matched.length <= 1) {
                breadcrumbs.push({
                    title: matched[0].meta.title ?? matched[0].name,
                    icon
                })
            } else {
                for (let i = 0, len = matched.length; i < len; i++) {
                    const match = matched[i]
                    const title = (match.meta && match.meta.title) ?? match.name
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
                                path: match.path ? match.path : '/'
                            })
                        } else {
                            /** other */
                            if (title) {
                                breadcrumbs.push({
                                    title,
                                    path: match.path
                                })
                            }
                        }
                    }
                }
            }
            this.breadcrumbs = breadcrumbs
        },
        getBreadcrumbItems() {
            const items = []
            for (let i = 0, l = this.breadcrumbs.length; i < l; i++) {
                const cur = this.breadcrumbs[i]
                const icon = cur.icon ?? null
                items.push(
                    <Breadcrumb.Item href={cur.path}>
                        { () => (
                            <>
                                { icon }
                                { cur.title }
                            </>
                        ) }
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
                { () => this.getBreadcrumbItems() }
            </Breadcrumb>   
        )
    }
})