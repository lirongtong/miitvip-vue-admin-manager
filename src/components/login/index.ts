import { App, Plugin } from 'vue'
import Login from './login'

Login.install = (app: App) => {
    app.component(Login.name, Login)
    return app
}

export default Login as typeof Login & Plugin