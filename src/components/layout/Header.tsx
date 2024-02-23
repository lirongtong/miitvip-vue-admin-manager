import { defineComponent, type SlotsType, ref, computed } from 'vue'
import { LayoutHeaderProps } from './props'
import { getPropSlot } from '../_utils/props'
import { useLayoutStore } from '../../stores/layout'
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
        const searchKey = ref('')
        const store = useLayoutStore()
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
                            <MiSearch searchKey={searchKey.value} {...props.searchSetting} />
                        )}
                    </div>
                </div>
            </header>
        )
    }
})

export default MiLayoutHeader
