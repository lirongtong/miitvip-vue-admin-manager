import type { App } from 'vue'
import Prism from 'prismjs'

export default {
    install(app: App) {
        app.directive('prism', {
            beforeMount(el: any) {
                Prism.highlightAllUnder(el)
            },
            updated(el: any) {
                Prism.highlightAllUnder(el)
            }
        })
        return app
    }
}
