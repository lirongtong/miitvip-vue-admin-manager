import { App } from 'vue'
import { MediumOutlined } from '@ant-design/icons-vue'

const icons: any = {
    MediumOutlined
}
const MiIcons = {
    install(app: App) {
        Object.keys(icons).forEach((name) => {
            app.component(name, icons[name])
        })
    }
}
export default MiIcons