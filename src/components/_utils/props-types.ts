import { CSSProperties } from 'vue'
import { createTypes, VueTypesInterface, VueTypeValidableDef } from 'vue-types'

export interface CommonRequestProps {
    url?: string
    method?: string
    params?: object
    callback?: Function
}

const PropTypes = createTypes({
    func: undefined,
    bool: undefined,
    string: undefined,
    number: undefined,
    array: undefined,
    object: undefined,
    integer: undefined
})

export declare type Key = string | number

export default PropTypes as VueTypesInterface & {
    readonly style: VueTypeValidableDef<CSSProperties>
}
