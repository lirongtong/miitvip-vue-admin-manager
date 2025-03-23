/// <reference types="vitest" />
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
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            thresholds: {
                lines: 90,
                functions: 75,
                branches: 85
            },
            exclude: ['**/*.d.ts', '**/__mocks__/**']
        },
        include: ['**/*.{test,spec}.{js,ts,tsx}'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/cypress/**',
            '**/.{idea,git,cache,output,temp}/**',
            '**/example/**'
        ],
        setupFiles: './vitest.setup.ts'
    },
    resolve: {
        alias: {
            '@': resolve('example'),
            '@miitvip/admin-pro': resolve('src/index')
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
            'style-inject',
            'vue-types',
            'swiper/element/bundle',
            'swiper/modules',
            'swiper/css/*',
            '@material/material-color-utilities',
            'vue3-colorpicker'
        ]
    },
    server: {
        host: '0.0.0.0',
        port: 5800,
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
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag: string) => tag.startsWith('swiper-')
                }
            }
        }),
        vueJsx({
            isCustomElement: (tag: string) => tag.startsWith('swiper-')
        }),
        EslintPlugin(),
        VueI18nPlugin({ include: resolve('./src/locales') })
    ],
    esbuild: { jsxFactory: 'h', jsxFragment: 'Fragment' }
})
