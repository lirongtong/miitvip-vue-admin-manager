import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { UserConfig  } from 'vite'
const resolve = (dir: string) => path.join(__dirname, dir)

const config: UserConfig = {
    resolve: {
        alias: {
            '/@/': resolve('example'),
            '/@src/': resolve('src'),
            'makeit-admin-pro': resolve('src'),
            'makeit-admin-pro/style': '/src/style.ts',
            'makeit-admin-pro/less': '/src/style/miitvip.less'
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    optimizeDeps: {
        include: [
            'axios', 'vue', 'ant-design-vue', '@ant-design/colors',
            '@ant-design/icons-vue', 'screenfull', 'vue-router', 'vuex'
        ]
    },
    server: {
        proxy: {
            '/v1': {
                target: 'http://local-account.makeit.vip',
                changeOrigin: true
            }
        }
    },
    plugins: [vue(), vueJsx()],
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
    }
}
module.exports = config