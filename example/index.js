import { createApp } from 'vue'

import 'ant-design-vue/lib/layout/style/index.less'

import 'makeit-admin-pro/style'
import MakeitAdminPro from 'makeit-admin-pro'
import App from './app.vue'

const app = createApp(App)
app.use(MakeitAdminPro)
app.mount('#app')