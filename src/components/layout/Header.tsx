import { defineComponent, type SlotsType, ref, computed } from 'vue'
import { LayoutHeaderProps } from './props'
import { getPropSlot } from '../_utils/props'
import { useLayoutStore } from '../../stores/layout'
import { useI18n } from 'vue-i18n'
import { $tools } from '../../utils/tools'
import { useRouter } from 'vue-router'
import type { SearchData } from '../../utils/types'
import MiSearch from '../search/Search'
import MiBreadcrumb from '../breadcrumb/Breadcrumb'
import applyTheme from '../_utils/theme'
import styled from './style/header.module.less'

const MiLayoutHeader = defineComponent({
    name: 'MiLayoutHeader',
    inheritAttrs: false,
    slots: Object as SlotsType<{
        notice: any
        dropdown: any
        breadcrumb: any
        search: any
        extra: any
    }>,
    props: LayoutHeaderProps(),
    setup(props, { slots }) {
        const { tm } = useI18n()
        const router = useRouter()
        const store = useLayoutStore()
        const searchKey = ref('title')
        const searchData = ref(tm('search.data') as SearchData[])
        const collapsed = computed(() => store.collapsed)
        applyTheme(styled)

        const handleSearchListItemClick = (data: SearchData) => {
            if (data.path) {
                if ($tools.isUrl(data.path)) {
                    if (typeof window !== 'undefined') {
                        let url = data.path
                        if (data.query && Object.keys(data.query || {}).length > 0) {
                            url += `?${$tools.getUrlParamsByObj(data.query)}`
                        }
                        window.open(url, '_blank')
                    }
                } else router.push({ path: data.path, query: data?.query || {} })
            }
        }

        return () => (
            <header class={`${styled.container}${collapsed.value ? ` ${styled.collapsed}` : ''}`}>
                <div class={styled.inner}>
                    <div class={styled.left}>
                        {getPropSlot(slots, props, 'breadcrumb') ?? (
                            <MiBreadcrumb {...props.breadcrumbSetting} />
                        )}
                    </div>
                    <div class={styled.right}>
                        {getPropSlot(slots, props, 'search') ?? (
                            <MiSearch
                                searchKey={searchKey.value}
                                data={searchData.value}
                                onItemClick={handleSearchListItemClick}
                                {...props.searchSetting}
                            />
                        )}
                    </div>
                </div>
            </header>
        )
    }
})

export default MiLayoutHeader
