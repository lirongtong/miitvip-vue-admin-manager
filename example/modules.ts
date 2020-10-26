import { App } from 'vue'
import 'ant-design-vue/lib/layout/style/index.less'
import { Layout, Menu } from 'ant-design-vue'

const components = {
    Layout, Menu
} as any
const antd = {
    install(app: App) {
        Object.keys(components).forEach((name) => {
            app.use(components[name])
        })
    }
}
export default antd