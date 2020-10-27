import path from 'path'
const resolve = (dir: string) => path.join(__dirname, dir)

const config = {
    alias: {
        '/@/': resolve('example'),
        '/@src/': resolve('src'),
        '/@assets/': resolve('example/assets'),
        '/@styles/': resolve('example/assets/styles'),
        '/@images/': resolve('example/assets/images'),
        '/@fonts/': resolve('example/assets/fonts'),
        '/@common/': resolve('example/common'),
        '/@views/': resolve('example/views'),
        '/@store/': resolve('example/store'),
        '/@components/': resolve('example/components')
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