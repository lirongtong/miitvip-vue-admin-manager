import { Layout } from 'ant-design-vue'

import 'ant-design-vue/lib/layout/style/index.less'

const components = { Layout }
const antd = {
    install(app) {
        Object.keys(components).forEach(name => {
            app.use(components[name])
        })
    }
}
export default antd