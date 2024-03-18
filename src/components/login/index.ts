import type { App, Plugin } from 'vue'
import Mixins from '../../utils/mixins'
import Login from './Login'

Login.install = (app: App) => {
    Mixins(app)
    if (typeof app.component(Login.name) === 'undefined') {
        app.component(Login.name, Login)
        app.component(Login.Socialite.name, Login.Socialite)
    }
    return app
}

export default Login as typeof Login & Plugin
