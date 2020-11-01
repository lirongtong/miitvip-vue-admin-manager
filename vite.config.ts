import path from 'path'
const resolve = (dir: string) => path.join(__dirname, dir)

const config = {
    alias: {
        '/@/': resolve('example'),
        '/@views/': resolve('example/views'),
        '/@src/': resolve('src'),
        'makeit-admin': '/@src/index.ts',
        'makeit-admin/styles': '/@src/styles/makeit.less'
    },
    cssPreprocessOptions: {
        less: {
            javascriptEnabled: true
        }
    },
    optimizeDeps: {
        include: ['@ant-design/colors', '@ant-design/icons-vue']
    },
    proxy: {
        '/v1': {
            target: 'http://local-api.makeit.vip',
            rewrite: (path: any) => path.replace(/^\/v1/, ''),
            changeOrigin: true
        }
    }
}
module.exports = config