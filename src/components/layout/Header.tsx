import { defineComponent, type SlotsType, ref, computed } from 'vue'
import { LayoutHeaderProps } from './props'
import { getPropSlot } from '../_utils/props'
import { useMenuStore } from '../../stores/menu'
import { useLayoutStore } from '../../stores/layout'
import { useSearchStore } from '../../stores/search'
import { useI18n } from 'vue-i18n'
import { $tools } from '../../utils/tools'
import { $g } from '../../utils/global'
import { useRouter } from 'vue-router'
import { useWindowResize } from '../../hooks/useWindowResize'
import type { SearchData, DropdownItem } from '../../utils/types'
import {
    GithubOutlined,
    AppstoreAddOutlined,
    FireFilled,
    CoffeeOutlined,
    LikeFilled
} from '@ant-design/icons-vue'
import { __DONATE_ALIPAY__ } from '../../utils/images'
import MiModal from '../modal/Modal'
import MiTitle from '../title/Title'
import MiSearch from '../search/Search'
import MiPalette from '../palette/Palette'
import MiDropdown from '../dropdown/Dropdown'
import MiBreadcrumb from '../breadcrumb/Breadcrumb'
import MiDrawerMenu from '../menu/Drawer'
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
        palette: any
        extra: any
    }>,
    props: LayoutHeaderProps(),
    setup(props, { slots }) {
        const { t, tm } = useI18n()
        const { width } = useWindowResize()
        const router = useRouter()
        const useLayout = useLayoutStore()
        const useMenu = useMenuStore()
        const useSearch = useSearchStore()
        const searchKey = ref('title')
        const searchData = ref((useSearch.data || tm('search.data')) as SearchData[])
        const dropdownData = ref<Partial<DropdownItem>[]>(
            useMenu.dropdowns.length > 0
                ? useMenu.dropdowns
                : [
                      {
                          name: 'github',
                          title: 'Github',
                          path: 'https://github.com/lirongtong/miitvip-vue-admin-manager',
                          target: '_blank',
                          icon: GithubOutlined,
                          tag: { content: 'Hot' }
                      },
                      {
                          name: 'npmjs',
                          title: 'NpmJS',
                          path: 'https://www.npmjs.com/package/@miitvip/admin-pro',
                          target: '_blank',
                          icon: AppstoreAddOutlined,
                          tag: { icon: FireFilled, color: '#ff4d4f' }
                      },
                      {
                          name: 'coffee',
                          title: '来一杯咖啡',
                          icon: CoffeeOutlined,
                          tag: { icon: LikeFilled, color: '#31eb0c' },
                          callback: () => (modalOpen.value = !modalOpen.value)
                      }
                  ]
        )
        const collapsed = computed(() => useLayout.collapsed)
        const menuOpen = computed(() => useMenu.drawer)
        const modalOpen = ref<boolean>(false)
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

        const renderCoffeeModal = () => {
            return (
                <MiModal
                    v-model:open={modalOpen.value}
                    title={false}
                    footer={false}
                    animation="newspaper"
                    footerBtnPosition="center"
                    width={420}>
                    <div class={styled.coffee}>
                        <MiTitle
                            title={t('global.donate')}
                            center={true}
                            margin={{ top: 0 }}
                            size={{ mobile: 20 }}
                        />
                        <img src={__DONATE_ALIPAY__} alt="makeit.vip alipay QRCode" />
                    </div>
                </MiModal>
            )
        }

        return () => (
            <header class={`${styled.container}${collapsed.value ? ` ${styled.collapsed}` : ''}`}>
                <div class={styled.inner}>
                    <div class={styled.left}>
                        {width.value > $g.breakpoints.sm ? (
                            getPropSlot(slots, props, 'breadcrumb') ?? (
                                <MiBreadcrumb {...props.breadcrumbSetting} />
                            )
                        ) : (
                            <div class={styled.drawer}>
                                <MiDrawerMenu open={menuOpen.value} />
                            </div>
                        )}
                    </div>
                    <div class={styled.right}>
                        {getPropSlot(slots, props, 'extra')}
                        {width.value > $g.breakpoints.sm
                            ? getPropSlot(slots, props, 'search') ?? (
                                  <MiSearch
                                      searchKey={searchKey.value}
                                      data={searchData.value}
                                      onItemClick={handleSearchListItemClick}
                                      {...props.searchSetting}
                                  />
                              )
                            : null}
                        <div class={styled.palette}>
                            {getPropSlot(slots, props, 'palette') ?? <MiPalette />}
                        </div>
                        <div class={styled.user}>
                            {getPropSlot(slots, props, 'dropdown') ?? (
                                <MiDropdown items={dropdownData.value} />
                            )}
                        </div>
                    </div>
                    {renderCoffeeModal()}
                </div>
            </header>
        )
    }
})

export default MiLayoutHeader
