import { createApp } from 'vue'
import router from '@/router'
import { createStore } from 'vuex'
import App from '@/app.vue'
import MakeitAdminPro from 'makeit-admin-pro'

const app = createApp(App)
app.use(router)
app.use(createStore({}))
app.use(MakeitAdminPro)
app.mount('#app')
