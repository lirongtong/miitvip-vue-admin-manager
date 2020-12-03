import { App } from 'vue'
import hljs from 'highlight.js'

const hightlight = {
    install(app: App) {
        app.directive('highlight', {
            beforeMount(el: any) {
                const blocks = el.querySelectorAll('pre code')
                for (let i = 0, l = blocks.length; i < l; i++) {
                    const item = blocks[i]
                    hljs.highlightBlock(item)
                }
            },
            updated(el: any, binding: any) {
                const targets = el.querySelectorAll('code')
                for (let i = 0, l = targets.length; i < l; i++) {
                    const target = targets[i]
                    if (typeof binding.value === 'string') {
                        target.textContent = binding.value
                    }
                    hljs.highlightBlock(target)
                }
            }
        })
    }
}
export default hightlight