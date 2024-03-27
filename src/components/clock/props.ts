import { object } from 'vue-types'
import { DeviceSize, PropTypes } from '../../utils/types'

/**
 * +====================+
 * |       Clock        |
 * +====================+
 * @param size 大小
 */
export interface ClockProperties {
    size: string | number | DeviceSize
}
export const ClockProps = () => ({
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def(240)
})
