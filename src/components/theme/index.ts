import type { App, Plugin } from 'vue'
import Theme from './Theme'
import Provider from './Provider'

// 避免与 utils/install -> utils/mixins -> components/theme 产生循环依赖：
// Theme 作为 Mixins 的一部分被安装时，不应再依赖 installs() 去反向引用 utils/install。
;(Theme as any).Provider = Provider
;(Theme as any).install = (app: App) => {
    if (typeof app.component((Theme as any).name) === 'undefined') {
        app.component((Theme as any).name, Theme as any)
    }
    if (typeof app.component((Provider as any).name) === 'undefined') {
        app.component((Provider as any).name, Provider as any)
    }
}

export default Theme as typeof Theme &
    Plugin & {
        readonly Provider: typeof Provider
    }
