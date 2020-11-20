import { defineComponent } from 'vue'
import { GithubOutlined, MoreOutlined } from '@ant-design/icons-vue'
import PropTypes from '../../utils/props'
import MiDropdown from '../dropdown'

export default defineComponent({
    name: 'MiLoginQuick',
    props: {
        domain: PropTypes.string,
        items: PropTypes.array
    },
    data() {
        return {
            first: null,
            left: []
        }
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('passport-quick')
        },
        handleRedirect(type: string) {
            const domain = this.domain ?? this.$g.socialites.domain
            const link = `${domain}/${type}`
            window.open(link, '_self')
        }
    },
    created() {
        const items = this.items ?? this.$g.socialites.items
        const list = []
        for (let i = 0, l = items.length; i < l; i++) {
            const item = {...items[i]}
            item.callback = () => this.handleRedirect(item.name)
            if (i === 0) this.first = item
            else list.push(item)
        }
        this.left = list
    },
    render() {
        const prefixCls = this.getPrefixCls()
        const title = <MoreOutlined />
        const firstIcon = this.first ? this.first.icon : <GithubOutlined />
        const hasCallback = this.first && this.first.callback && typeof this.first.callback === 'function'
        const element = !this.$g.mobile ? (
            <div class={prefixCls}>
                其它登录方式
                <div onClick={(e) => hasCallback ? this.first.callback.call(this, e) : e}>{ firstIcon }</div>
                <MiDropdown title={title} items={this.left}></MiDropdown>
            </div>
        ) : (
            <div class={`${prefixCls} ${prefixCls}-mobile`}>

            </div>
        )
        return element
    }
})