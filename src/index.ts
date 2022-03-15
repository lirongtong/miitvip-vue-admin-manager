import { App } from 'vue'

let _init = false
const install = (app: App) => {
    if (!_init) {
        _init = true
    }
    return app
}

export default {
    install
}