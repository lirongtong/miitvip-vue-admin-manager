import { App } from 'vue'
import {
    MediumOutlined, LoginOutlined, LogoutOutlined, FastForwardOutlined,
    TagsFilled, SecurityScanOutlined, ThunderboltOutlined, VerifiedOutlined,
    FormOutlined, OrderedListOutlined, AlignLeftOutlined, CreditCardOutlined,
    ShoppingCartOutlined, CheckSquareOutlined, ToolOutlined, FireFilled
} from '@ant-design/icons-vue'

const MiIcons: any = {
    MediumOutlined, LoginOutlined, LogoutOutlined, FastForwardOutlined,
    TagsFilled, SecurityScanOutlined, ThunderboltOutlined, VerifiedOutlined,
    FormOutlined, OrderedListOutlined, AlignLeftOutlined, CreditCardOutlined,
    ShoppingCartOutlined, CheckSquareOutlined, ToolOutlined, FireFilled
}
const icons = {
    install(app: App) {
        Object.keys(MiIcons).forEach((name) => {
            app.component(name, MiIcons[name])
        })
    }
}
export default icons