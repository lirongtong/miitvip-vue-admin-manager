import { App, Plugin } from 'vue'
import Login from './login'

Login.install = (app: App) => {
    app.component(Login.name, Login)
    app.component(Login.Quick.name, Login.Quick)
    return app
}

export default Login as typeof Login & Plugin
