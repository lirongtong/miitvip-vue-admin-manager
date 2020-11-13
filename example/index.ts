import { createApp } from 'vue'
import router from './router'
import { BellOutlined } from '@ant-design/icons-vue'
import MakeitAdminPro from 'makeit-admin-pro'
import App from './app.vue'
import 'ant-design-vue/dist/antd.css'
import 'makeit-admin-pro/style'

const app = createApp(App)
app.component(BellOutlined.displayName, BellOutlined)
app.use(router)
app.use(MakeitAdminPro)
app.mount('#app')