import { CSSProperties } from 'vue'
import { createTypes, VueTypesInterface, VueTypeValidableDef } from 'vue-types'

const PropTypes = createTypes({
    func: undefined,
    bool: undefined,
    string: undefined,
    number: undefined,
    array: undefined,
    object: undefined,
    integer: undefined
})

PropTypes.extend([
    {
        name: 'style',
        type: [String, Object],
        getter: true,
        default: undefined
    }
])

export default PropTypes as VueTypesInterface & {
    readonly style: VueTypeValidableDef<CSSProperties>
}
