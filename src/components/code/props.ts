import { PropTypes } from '../../utils/types'
import type { DividerProps } from 'ant-design-vue'
import { object } from 'vue-types'

/**
 * +===================+
 * |       Code        |
 * +===================+
 * @param language 语言类型
 * @param content 代码内容<Slot />
 * @param canCopy 开启复制代码的按钮
 */
export interface CodeProperties {
    language: string
    content: any
    canCopy: boolean
}
export const CodeProps = () => ({
    language: PropTypes.string.def('html'),
    content: PropTypes.any,
    canCopy: PropTypes.bool.def(true)
})

/**
 * +=======================+
 * |       Code Demo       |
 * +=======================+
 * @param title 标题内容
 * @param titleSetting 标题设置 ( Antdv Divider )
 * @param summary 摘要
 * @param effect 效果<Slot />
 * @param animation Code 展示动画
 * @param language 代码语言
 * @param code 示例代码
 *
 * @see DividerProps
 */
export interface CodeDemoProperties {
    title: string
    titleSetting: Partial<DividerProps>
    summary: string
    effect: any
    animation: string
    language: string
    code: string
}

export const CodeDemoProps = () => ({
    title: PropTypes.string,
    titleSetting: object<Partial<DividerProps>>().def({ orientation: 'left' }),
    summary: PropTypes.string,
    effect: PropTypes.any,
    animation: PropTypes.string.def('fade'),
    language: PropTypes.string.def('html'),
    code: PropTypes.string
})
