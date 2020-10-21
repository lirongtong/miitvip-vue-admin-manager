import path from 'path'
const resolve = (dir: string) => path.join(__dirname, dir)
const primaryColor = '#0aa679'

const config = {
    alias: {
        '/@/': resolve('src'),
        '/@assets/': resolve('src/assets'),
        '/@styles/': resolve('src/assets/styles'),
        '/@images/': resolve('src/assets/images'),
        '/@fonts/': resolve('src/assets/fonts'),
        '/@common/': resolve('src/common'),
        '/@views/': resolve('src/views'),
        '/@store/': resolve('src/store'),
        '/@components/': resolve('src/components')
    },
    cssPreprocessOptions: {
        less: {
            modifyVars: {
                'btn-primary-bg': primaryColor,
                'link-color': primaryColor,
                'link-active-color': primaryColor,
                'input-color': primaryColor,
                'input-hover-border-color': primaryColor,
                'btn-border-radius-sm': '4px',
                'pagination-item-bg-active': primaryColor
            },
            javascriptEnabled: true
        }
    }
}
module.exports = config