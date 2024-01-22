import { object } from 'vue-types'
import { DefaultProps, DeviceSize, PropTypes } from '../../utils/types'

/**
 * 时钟
 * @param width 宽度
 */
export interface ClockProperties extends DefaultProps {
    width: string | number | DeviceSize
}
export const ClockProps = () => ({
    prefixCls: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string, object<DeviceSize>()]).def(240)
})
