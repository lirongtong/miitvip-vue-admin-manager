import { defineComponent, isVNode } from 'vue'
import * as Icon from '@ant-design/icons-vue'
import PropTypes from '../../utils/props'

export default defineComponent({
    name: 'MiDropdownItem',
    props: {
        item: PropTypes.object.isRequired
    },
    render() {
        const icon = this.item.icon
            ? (isVNode(this.item.icon)
                ? this.item.icon
                : Icon[this.item.icon])
            : null
        let tag: any = null
        if (this.item.tag) {
            if (this.item.tag.content) {
                tag = (<span class="tag">{ this.item.tag.content }</span>)
            } else if (this.item.tag.icon) {
                tag = (
                    <div class="icon" style={{color: this.item.tag.color ?? null}}>
                        {
                            isVNode(this.item.tag.icon)
                                ? this.item.tag.icon
                                : Icon[this.item.tag.icon]
                        }
                    </div>
                )
            }
        }
        return (
            <>
                <div style={this.item.iconSize ? {fontSize: `${this.item.iconSize}px`} : null}>{ icon }</div>
                { this.item.title ? <span class="title" innerHTML={this.item.title}></span> : null }
                { tag }
            </>
        )
    }
})