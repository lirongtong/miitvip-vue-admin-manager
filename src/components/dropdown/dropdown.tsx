import { defineComponent, reactive, ref } from 'vue'
import { Dropdown, Avatar, Menu } from 'ant-design-vue'

export default defineComponent({
    name: 'MiDropdown',
    setup() {
        const menus = reactive([])
        const visible = ref(false)
        return { menus, visible }
    },
    render() {
        const overlay = (
            <Menu theme="dark">
                <Menu.Item>Good</Menu.Item>
            </Menu>
        )
        return (
            <Dropdown placement="bottomCenter" visible={this.visible} overlay={() => overlay}>
                { () => (
                    <div class="title">
                        <Avatar class="avatar" src={this.$g.avatar} alt={this.$g.powered} size="small"></Avatar>
                        <span class="name">{ this.$g.userInfo.nickname ?? this.$g.author }</span>
                    </div>
                ) }
            </Dropdown>
        )
    }
})