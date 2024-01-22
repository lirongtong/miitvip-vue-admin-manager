import { object } from 'vue-types'
import { DeviceSize, PropTypes } from '../../utils/types'

/**
 * 时钟
 * @param width 宽度
 */
export interface ClockProperties {
    width: string | number | DeviceSize
}
export const ClockProps = () => ({
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def(240)
})
