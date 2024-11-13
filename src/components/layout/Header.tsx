import { defineComponent, type SlotsType, ref, computed } from 'vue'
import { LayoutHeaderProps } from './props'
import { getPropSlot } from '../_utils/props'
import { useMenuStore } from '../../stores/menu'
import { useLayoutStore } from '../../stores/layout'
import { useAuthStore } from '../../stores/auth'
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
    LikeFilled,
    LogoutOutlined
} from '@ant-design/icons-vue'
import { __DONATE_ALIPAY__, __DONATE_WECHAT__ } from '../../utils/images'
import MiModal from '../modal/Modal'
import MiTitle from '../title/Title'
import MiSearch from '../search/Search'
import MiPalette from '../palette/Palette'
import MiDropdown from '../dropdown/Dropdown'
import MiBreadcrumb from '../breadcrumb/Breadcrumb'
import MiDrawerMenu from '../menu/Drawer'
import MiHistoricalRouting from '../historical/Historical'
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
        const useAuth = useAuthStore()
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
                          title: '赞助 ( Donate )',
                          icon: CoffeeOutlined,
                          tag: { icon: LikeFilled, color: '#31eb0c' },
                          callback: () => (modalOpen.value = !modalOpen.value)
                      }
                  ]
        )
        if (useMenu.dropdowns.length <= 0 && useAuth.token.access) {
            dropdownData.value.push({
                name: 'logout',
                title: '退出登录',
                icon: LogoutOutlined,
                callback: () => handleLogout()
            })
        }
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

        const handleLogout = () => {
            useAuth.logout()
            if (useMenu.dropdowns.length <= 0) dropdownData.value.pop()
            router.push({ path: '/login' })
        }

        const renderCoffeeModal = () => {
            return (
                <MiModal
                    v-model:open={modalOpen.value}
                    title={false}
                    footer={false}
                    animation="newspaper"
                    footerBtnPosition="center"
                    width={840}>
                    <div class={styled.coffee}>
                        <MiTitle
                            title={t('global.donate')}
                            center={true}
                            margin={{ top: 0 }}
                            size={{ mobile: 20 }}
                        />
                        <div class={styled.qrcode}>
                            <img src={__DONATE_ALIPAY__} alt="makeit.vip alipay QRCode" />
                            <img src={__DONATE_WECHAT__} alt="makeit.vip wechat QRCode" />
                        </div>
                    </div>
                </MiModal>
            )
        }

        return () => (
            <header
                class={`${styled.container}${collapsed.value ? ` ${styled.collapsed}` : ''}${
                    $g?.showHistoryRoutes ? ` ${styled.hasHistoricalRoutes}` : ``
                }`}>
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
                            {getPropSlot(slots, props, 'palette') ?? (
                                <MiPalette {...props.paletteSetting} />
                            )}
                        </div>
                        <div class={styled.user}>
                            {getPropSlot(slots, props, 'dropdown') ?? (
                                <MiDropdown items={dropdownData.value} {...props.dropdownSetting} />
                            )}
                        </div>
                    </div>
                    {renderCoffeeModal()}
                </div>
                {$g?.showHistoryRoutes ? <MiHistoricalRouting /> : null}
            </header>
        )
    }
})

export default MiLayoutHeader
