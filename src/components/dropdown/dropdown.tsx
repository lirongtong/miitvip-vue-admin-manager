import { defineComponent, reactive } from 'vue'
import { Dropdown, Avatar, Menu } from 'ant-design-vue'
import PropTypes, { getSlotContent } from '../../utils/props'

export default defineComponent({
    name: 'MiDropdown',
    props: {
        title: PropTypes.any
    },
    setup() {
        const menus = reactive([])
        return { menus }
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('layout-header-dropdown')
        },
        getOverlayElem() {
            return (
                <Menu theme="dark">
                    <Menu.Item key="1">Good Job</Menu.Item>
                </Menu>
            )
        }
    },
    render() {
        const getPrefixCls = this.getPrefixCls()
        let title = getSlotContent(this, 'title')
        if (!title) {
            title = (
                <div class={getPrefixCls}>
                    <Avatar class="avatar" src={this.$g.avatar} alt={this.$g.powered} size="small" />
                    <span class="name">{ this.$g.userInfo.nickname ?? this.$g.author }</span>
                </div>
            )
        }
        return (
            <Dropdown placement="bottomCenter" trigger={['click']} overlay={ this.getOverlayElem() }>
                { () => title }
            </Dropdown>
        )
    }
})