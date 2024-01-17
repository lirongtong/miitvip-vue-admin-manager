import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import EslintPlugin from 'vite-plugin-eslint'
import path from 'path'
// eslint-disable-next-line import/no-unresolved
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

const resolve = (dir: string) => path.join(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
    },
    resolve: {
        alias: {
            '@': resolve('example'),
            'makeit-admin-pro': resolve('src/index')
        }
    },
    css: {
        devSourcemap: true,
        modules: { generateScopedName: 'mi-[name]-[hash:base64:8]', localsConvention: 'camelCase' },
        preprocessorOptions: { less: { javascriptEnabled: true } }
    },
    optimizeDeps: {
        include: [
            'vue',
            'vue-router',
            'ant-design-vue',
            'axios',
            'nprogress',
            'vue-i18n',
            '@ant-design/icons-vue',
            'pinia',
            'md5',
            'prismjs',
            'screenfull',
            'style-inject',
            'vue-types',
            '@material/material-color-utilities'
        ]
    },
    server: {
        host: '0.0.0.0',
        proxy: {
            '/v1': {
                target: 'http://local-api.makeit.vip',
                changeOrigin: true
            },
            '/api/trans': {
                target: 'http://fanyi-api.baidu.com',
                changeOrigin: true
            }
        }
    },
    plugins: [
        vue(),
        vueJsx(),
        EslintPlugin(),
        VueI18nPlugin({ include: resolve('./src/locales') })
    ],
    esbuild: { jsxFactory: 'h', jsxFragment: 'Fragment' }
})
