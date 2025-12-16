import { createRequire } from 'module'
import builtins from 'builtin-modules'

const requireRes = createRequire(import.meta.url)
const pkg = requireRes('../package.json')

const dependencies = Object.keys(pkg.dependencies || {})
const globalDependencies = {}
dependencies.forEach((key) => {
    const camelCase = key.replace(/@/g, '').replace(/[\/-]/g, '')
    globalDependencies[key] = camelCase
})

export const externalPackages = [
    ...dependencies,
    ...builtins,
    /swiper/,
    /prismjs/,
    /vue3-colorpicker/,
    /nprogress/,
    /@babel\/runtime/,
    /@babel\/runtime-corejs3/,
    /style-inject/
]

export const externalGlobals = Object.assign(globalDependencies, { 'style-inject': 'styleInject' })