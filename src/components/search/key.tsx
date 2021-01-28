import { defineComponent } from 'vue'
import PropTypes, { tuple } from '../../utils/props'

export default defineComponent({
    name: 'MiSearchKey',
    inheritAttrs: false,
    props: {
        name: PropTypes.string.isRequired,
        tag: PropTypes.string.def('span'),
        type: PropTypes.oneOf(
            tuple('text', 'image', 'link')
        ).def('text'),
        data: PropTypes.any
    },
    render() {
        const TagName = this.tag
        const elem = this.type === 'text'
            ? <TagName innerHTML={this.data}></TagName>
            : this.type === 'image'
                ? <TagName src={this.data}></TagName>
                : this.type === 'link'
                    ? <TagName href={this.data} innerHTML={this.data}></TagName>
                    : <TagName innerHTML={this.data}></TagName>
        return this.data ? elem : null
    }
})