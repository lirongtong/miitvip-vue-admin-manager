import { createApp } from 'vue'
import router from './router'
import App from './app.vue'
import MakeitAdminPro from '../src/index'

const app = createApp(App)
app.use(router)
app.use(MakeitAdminPro)
app.mount('#app')
