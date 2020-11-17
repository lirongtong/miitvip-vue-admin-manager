import { defineComponent, isVNode } from 'vue'
import { Tag } from 'ant-design-vue'
import PropTypes from '../../utils/props'
import * as Icon from '@ant-design/icons-vue'

export default defineComponent({
    name: 'MiMenuItemLink',
    props: {
        item: PropTypes.object.isRequired,
        title: PropTypes.bool.def(true),
        top: PropTypes.bool.def(false)
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('menu-item')
        },
        getIconElem() {
            let icon = this.item.meta && this.item.meta.icon
                ? this.item.meta.icon
                : 'TagsFilled'
            const MenuIcon = isVNode(icon) ? icon : Icon[icon]
            return <MenuIcon></MenuIcon>
        },
        getTitleElem() {
            const prefixCls = this.getPrefixCls()
            const text = this.item.meta && this.item.meta.title
                ? this.item.meta.title
                : this.$g.title
            let title: any = null
            if (this.top) {
                title = (<span innerHTML={text}></span>)
            } else {
                const subTitle = this.item.meta && this.item.meta.subTitle
                    ? this.item.meta.subTitle
                    : null
                const subElem = subTitle ? (
                    <span class="sub" innerHTML={subTitle}></span>
                ) : null
                title = (
                    <div class={`${prefixCls}-title`}>
                        <span innerHTML={this.title ? text : null}></span>
                        { subElem }
                    </div>
                )
            }
            return title
        },
        getTagElem() {
            const prefixCls = this.getPrefixCls()
            const meta = this.item.meta
            let tag: any = null
            if (meta && meta.tag && !this.top) {
                if (meta.tag.content) {
                    tag = (
                        <Tag
                            class={`${prefixCls}-tag`}
                            color={meta.tag.color ?? '#f6ca9d'}
                            innerHTML={meta.tag.content}>
                        </Tag>
                    )
                } else if (meta.tag.icon) {
                    const TagIcon = isVNode(meta.tag.icon) ? meta.tag.icon : Icon[meta.tag.icon]
                    tag = (
                        <TagIcon
                            class={`${prefixCls}-icon`}
                            style={{
                                color: meta.tag.color ?? '#f6ca9d',
                                marginRight: 0,
                                fontSize: `${meta.tag.size ?? 14}px`
                            }}>
                        </TagIcon>
                    )
                }
            }
            return tag
        }
    },
    render() {
        return (
            <>
                { this.getIconElem()}
                { this.getTitleElem() }
                { this.getTagElem() }
            </>
        )
    }
})