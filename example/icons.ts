import { App } from 'vue'
import { MediumOutlined } from '@ant-design/icons-vue'

const MiIcons: any = {
    MediumOutlined
}
const icons = {
    install(app: App) {
        Object.keys(MiIcons).forEach((name) => {
            app.component(name, MiIcons[name])
        })
    }
}
export default icons