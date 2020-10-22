import path from 'path'
const resolve = (dir: string) => path.join(__dirname, dir)
const primaryColor = '#0aa679'

const config = {
    alias: {
        '/@/': resolve('example'),
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