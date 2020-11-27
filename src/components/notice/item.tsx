import { defineComponent } from 'vue'
import { Avatar } from 'ant-design-vue'
import PropTypes, { getSlot, getSlotContent } from '../../utils/props'

export default defineComponent({
    name: 'MiNoticeItem',
    props: {
        avatar: PropTypes.string,
        avatarIcon: PropTypes.any,
        avatarColor: PropTypes.string,
        title: PropTypes.any,
        content: PropTypes.any,
        time: PropTypes.string,
        extra: PropTypes.any
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('notice-item')
        },
        getDynamicElem(name: string) {
            const prefixCls = this.getPrefixCls()
            const dynamic = getSlotContent(this, name)
            return dynamic ? (
                <div class={`${prefixCls}-${name}`}>
                    { dynamic }
                </div>
            ) : null
        },
        getAvatarElem() {
            const prefixCls = this.getPrefixCls()
            const icon = getSlotContent(this, 'avatarIcon')
            let avatar = null
            if (this.avatar || icon) {
                const style = this.avatarColor ? {background: this.avatarColor} : null
                avatar = <Avatar class={`${prefixCls}-avatar`} src={this.avatar} icon={icon} style={style}></Avatar>
            }
            return avatar
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        return (
            <div class={`${prefixCls}`}>
                <div class={`${prefixCls}-default`}>
                    { this.getAvatarElem() }
                    <div class={`${prefixCls}-info`}>
                        { this.getDynamicElem('title') }
                        { this.getDynamicElem('content') }
                        { this.getDynamicElem('time') }
                    </div>
                    { this.getDynamicElem('extra') }
                </div>
                { getSlot(this) }
            </div>
        )
    }
})