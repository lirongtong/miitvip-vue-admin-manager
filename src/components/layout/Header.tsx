import { defineComponent, type SlotsType, ref, computed } from 'vue'
import { LayoutHeaderProps } from './props'
import { getPropSlot } from '../_utils/props'
import { useLayoutStore } from '../../stores/layout'
import { useI18n } from 'vue-i18n'
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
        const store = useLayoutStore()
        const searchKey = ref('title')
        const searchData = ref(tm('search.data') as [])
        const collapsed = computed(() => store.collapsed)
        applyTheme(styled)

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
                                data={searchData}
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
