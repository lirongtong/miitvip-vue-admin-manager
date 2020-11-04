import { createApp } from 'vue'
import 'makeit-admin/style'
import MakeitAdmin from 'makeit-admin'
import App from './app.vue'

const app = createApp(App)
app.use(MakeitAdmin)
app.mount('#app')