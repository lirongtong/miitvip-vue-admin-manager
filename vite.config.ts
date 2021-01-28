import path from 'path'
const resolve = (dir: string) => path.join(__dirname, dir)

const config = {
    alias: {
        '/@/': resolve('example'),
        '/@src/': resolve('src'),
        'makeit-admin-pro': '/@src/index.ts',
        'makeit-admin-pro/style': '/@src/style.ts',
        'makeit-admin-pro/less': '/@src/style/miitvip.less'
    },
    cssPreprocessOptions: {
        less: {
            javascriptEnabled: true
        }
    },
    optimizeDeps: {
        include: [
            'axios', 'makeit-captcha', 'makeit-tooltip', 'vue',
            'ant-design-vue', '@ant-design/colors', '@ant-design/icons-vue',
            'screenfull', 'vue-router', 'vuex'
        ]
    },
    proxy: {
        '/v1': {
            target: 'http://local-account.makeit.vip',
            changeOrigin: true
        }
    }
}
module.exports = config