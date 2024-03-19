import { PropTypes, type DeviceSize } from '../../utils/types'
import { object } from 'vue-types'
import { placement, tuple } from '../_utils/props'

/**
 * +=======================+
 * |       Password        |
 * +=======================+
 * @param width 输入框宽度
 * @param height 输入框高度
 * @param radius 输入框圆角弧度
 * @param value v-model
 * @param skipCheck 跳过密码检查
 * @param min 密码最低长度
 * @param max 密码最大长度
 * @param complexity 是否为复杂密码 ( 字母 + 数字 + 符号 )
 * @param complexityTip 复杂密码提示语
 * @param confirm 是否显示确认密码输入框
 * @param confirmValue v-model 再次确认密码
 * @param level 密码等级提示语
 * @param rules 校验规则 ( Form Rules )
 * @param placement 弹出位置
 * @param isRequired 是否必填 ( 结合 skipCheck 单独生成密码输入框时 )
 */
export interface PasswordProperties {
    width: string | number | DeviceSize
    height: string | number | DeviceSize
    radius: string | number | DeviceSize
    value: string | number
    skipCheck: boolean
    min: number
    max: number
    complexity: boolean
    complexityTip: string
    confirm: boolean
    confirmValue: string | number
    level: object
    rules: object
    placement: string
    isRequired: boolean
}

export const PasswordProps = () => ({
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(42),
    radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number, object<DeviceSize>()]).def(42),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    skipCheck: PropTypes.bool.def(false),
    min: PropTypes.number.def(6),
    max: PropTypes.number.def(32),
    complexity: PropTypes.bool.def(true),
    complexityTip: PropTypes.string.def(undefined),
    confirm: PropTypes.bool.def(false),
    confirmValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    level: object<{ [index: number]: string }>().def(),
    rules: PropTypes.object.def({}),
    placement: PropTypes.oneOf(tuple(...placement)).def('top'),
    isRequired: PropTypes.bool.def(false)
})
