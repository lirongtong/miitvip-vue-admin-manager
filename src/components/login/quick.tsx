import { defineComponent } from 'vue'
import { GithubOutlined, MoreOutlined } from '@ant-design/icons-vue'
import PropTypes from '../../utils/props'
import MiDropdown from '../dropdown'
import MiDropdownItem from '../dropdown/item'

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
        const temp = []
        for (let i = 0, l = items.length; i < l; i++) {
            const item = {...items[i]}
            item.callback = () => this.handleRedirect(item.name)
            if (i === 0) this.first = item
            else list.push(item)
            temp.push(item)
        }
        this.left = list
    },
    render() {
        const prefixCls = this.getPrefixCls()
        let element: any = null
        if (this.$g.mobile) {
            const icons = []
            const items = [this.first].concat(this.left)
            for (let i = 0, l = items.length; i < l; i++) {
                icons.push(
                    <a onClick={(e) => items[i].callback ? items[i].callback.call(this, e) : e}>
                        <MiDropdownItem item={items[i]}></MiDropdownItem>
                    </a>
                )
            }
            element = (
                <div class={`${prefixCls} ${prefixCls}-mobile`}>
                    <div class={`${prefixCls}-line`}></div>
                    <div class={`${prefixCls}-title`}>其它登录方式</div>
                    <div class={`${prefixCls}-cates`}>
                        { ...icons }
                    </div>
                </div>
            )
        } else {
            const title = <MoreOutlined />
            const firstIcon = this.first ? this.first.icon : <GithubOutlined />
            const hasCallback = this.first && this.first.callback && typeof this.first.callback === 'function'
            element = (
                <div class={prefixCls}>
                    其它登录方式
                    <div onClick={(e) => hasCallback ? this.first.callback.call(this, e) : e}>{ firstIcon }</div>
                    <MiDropdown title={title} items={this.left}></MiDropdown>
                </div>
            )
        }
        return element
    }
})