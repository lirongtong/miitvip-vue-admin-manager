import path from 'path'
import { SharedConfig } from 'vite'
const resolve = (dir: string) => path.join(__dirname, dir)

const config: SharedConfig = {
    alias: {
        '/@/': resolve('src'),
        'makeit-admin': resolve('src/index.ts')
    }
}
module.exports = config