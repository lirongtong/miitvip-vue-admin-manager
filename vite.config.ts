import path from 'path'
const resolve = (dir: string) => path.join(__dirname, dir)

const config = {
    alias: {
        '/@/': resolve('example'),
        '/@src/': resolve('src'),
        'makeit-admin-pro': '/@src/index.ts',
        'makeit-admin-pro/style': '/@src/style.ts'
    },
    cssPreprocessOptions: {
        less: {
            javascriptEnabled: true,
            modifyVars: {
                'theme': 'dark'
            }
        }
    },
    optimizeDeps: {
        include: ['ant-design-vue', '@ant-design/colors', '@ant-design/icons-vue']
    },
    proxy: {
        '/v1': {
            target: 'http://local-account.makeit.vip',
            changeOrigin: true
        }
    }
}
module.exports = config