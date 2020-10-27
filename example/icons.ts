import { App } from 'vue'
import {
    MediumOutlined, LoginOutlined, LogoutOutlined, FastForwardOutlined,
    TagsFilled, SecurityScanOutlined, ThunderboltOutlined
} from '@ant-design/icons-vue'

const MiIcons: any = {
    MediumOutlined, LoginOutlined, LogoutOutlined, FastForwardOutlined,
    TagsFilled, SecurityScanOutlined, ThunderboltOutlined
}
const icons = {
    install(app: App) {
        Object.keys(MiIcons).forEach((name) => {
            app.component(name, MiIcons[name])
        })
    }
}
export default icons