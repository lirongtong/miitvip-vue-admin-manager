import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import EslintPlugin from 'vite-plugin-eslint'
// eslint-disable-next-line import/no-unresolved
import Components from 'unplugin-vue-components/vite'
// eslint-disable-next-line import/no-unresolved
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
// eslint-disable-next-line import/no-unresolved
import vueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import path from 'path'
const resolve = (dir: string) => path.join(__dirname, dir)

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve('example'),
            '@views': resolve('example/views'),
            '@images': resolve('example/assets/images'),
            '@src': resolve('src'),
            '@utils': resolve('src/utils'),
            'makeit-admin-pro': resolve('src'),
            'makeit-admin-pro/style': resolve('src/style.ts')
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
            '@ant-design/icons-vue',
            'vue-i18n',
            'nprogress'
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
        VueJsx(),
        EslintPlugin(),
        Components({
            resolvers: [AntDesignVueResolver()]
        }),
        vueI18nPlugin({
            include: resolve('src/locales/**')
        })
    ],
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
    }
})
