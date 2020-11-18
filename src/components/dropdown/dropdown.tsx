import { defineComponent, reactive, ref } from 'vue'
import { Dropdown, Avatar, Menu } from 'ant-design-vue'
import PropTypes, { getSlotContent } from '../../utils/props'

export default defineComponent({
    name: 'MiDropdown',
    props: {
        title: PropTypes.any,
        placement: PropTypes.string.def('bottomCenter')
    },
    setup() {
        const menus = reactive([])
        const visible = ref(false)
        return { menus, visible }
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('layout-header-dropdown')
        },
        getOverlayElem() {
            return (
                <Menu theme="dark">
                    { () => <Menu.Item key="1">
                        { () => 'Good Job' }
                    </Menu.Item> }
                </Menu>
            )
        },
        handleUpdateVisible() {
            this.visible = !this.visible
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
            <Dropdown
                placement={this.placement}
                trigger={['click']}
                overlay={ this.getOverlayElem() }>
                { () => title }
            </Dropdown>
        )
    }
})