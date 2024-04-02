import { reactive } from 'vue'
import { api } from '../utils/api'
import { $g } from '../utils/global'
import { $cookie } from '../utils/cookie'
import { $request } from '../utils/request'
import { $storage } from '../utils/storage'
import { $tools } from '../utils/tools'
import { useWindowResize } from './useWindowResize'

export function useHooks() {
    return { api: reactive(api), $g, $cookie, $request, $storage, $tools, useWindowResize }
}

export default useHooks
