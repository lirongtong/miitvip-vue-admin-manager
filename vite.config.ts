import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import EslintPlugin from 'vite-plugin-eslint'
import path from 'path'

const resolve = (dir: string) => path.join(__dirname, dir)

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve('example'),
            '@views': resolve('example/views'),
            '@src': resolve('src')
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
            'vue',
            'vuex',
            'vue-router',
            'ant-design-vue',
            'axios',
            '@ant-design/icons-vue'
        ]
    },
    server: {
        proxy: {
            '/v1': {
                target: 'http://local-admin.makeit.vip',
                changeOrigin: true
            }
        }
    },
    plugins: [
        vue(),
        VueJsx(),
        EslintPlugin()
    ],
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
    }
})