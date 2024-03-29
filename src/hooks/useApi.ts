import { reactive } from 'vue'
import { api } from '../utils/api'

export function useApi() {
    return reactive(api)
}

export default useApi
