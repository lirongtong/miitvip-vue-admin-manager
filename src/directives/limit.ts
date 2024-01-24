import type { App } from 'vue'

export default {
    install(app: App) {
        app.directive('limit', {
            mounted(el: any, params: any) {
                if (el && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
                    const reg = params?.value?.reg
                    if (reg) {
                        el.addEventListener('keyup', (evt: any) => {
                            evt.preventDefault()
                            el.value = evt.target.value.replace(new RegExp(reg, 'ig'), '')
                        })
                    }
                }
            }
        })
        return app
    }
}
