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
        name: 'boolean',
        type: Boolean,
        default: undefined,
        getter: true
    },
    {
        name: 'style',
        type: [String, Object],
        default: undefined,
        getter: true
    }
])

export default PropTypes as VueTypesInterface & {
    readonly boolean: VueTypeValidableDef<boolean>
    readonly style: VueTypeValidableDef<CSSProperties>
}