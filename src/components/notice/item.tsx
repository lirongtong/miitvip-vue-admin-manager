import { defineComponent } from 'vue'
import { Avatar } from 'ant-design-vue'
import PropTypes from '../_utils/props-types'
import { getPropSlot, getPrefixCls } from '../_utils/props-tools'

export default defineComponent({
    name: 'MiNoticeItem',
    props: {
        avatarLink: PropTypes.string,
        avatarIcon: PropTypes.any,
        avatarColor: PropTypes.string,
        title: PropTypes.any,
        content: PropTypes.any,
        time: PropTypes.string,
        extra: PropTypes.any
    },
    setup(props, { slots }) {
        const prefixCls = getPrefixCls('notice-item')
        const getDynamicElem = (name: string) => {
            const dynamic = getPropSlot(slots, props, name)
            return dynamic ? <div class={`${prefixCls}-${name}`}>{dynamic}</div> : null
        }
        const getAvatarElem = () => {
            const icon = getPropSlot(slots, props, 'avatarIcon')
            let avatar: any = null
            if (props.avatarLink || icon) {
                const style = props.avatarColor ? { background: props.avatarColor } : null
                avatar = (
                    <Avatar
                        class={`${prefixCls}-avatar`}
                        src={props.avatarLink}
                        icon={icon}
                        style={style}
                    />
                )
            }
            return avatar
        }
        return () => (
            <div class={prefixCls}>
                <div class={`${prefixCls}-default`}>
                    {getAvatarElem()}
                    <div class={`${prefixCls}-info`}>
                        {getDynamicElem('title')}
                        {getDynamicElem('content')}
                        {getDynamicElem('time')}
                    </div>
                    {getDynamicElem('extra')}
                </div>
                {getPropSlot(slots, props)}
            </div>
        )
    }
})
