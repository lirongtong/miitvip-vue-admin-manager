import {
    defineComponent,
    reactive,
    computed,
    ref,
    nextTick,
    onMounted,
    onBeforeUnmount,
    watch,
    Transition
} from 'vue'
import {
    LeftOutlined,
    RightOutlined,
    CloseOutlined,
    DownOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CloseCircleOutlined
} from '@ant-design/icons-vue'
import { Tooltip } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { getPrefixCls } from '../_utils/props-tools'
import { mutations } from '../../store/types'
import { $tools } from '../../utils/tools'
import { $g } from '../../utils/global'
import PropTypes from '../_utils/props-types'
import MiDropdown from '../dropdown'

interface RouteHistory {
    name: string
    title: string
    path: string
}

export default defineComponent({
    name: 'MiHistory',
    inheritAttrs: false,
    props: {
        prefixCls: PropTypes.string
    },
    setup(props) {
        const prefixCls = getPrefixCls('layout-route-history', props.prefixCls)
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n()
        const collapsed = computed(() => store.getters['layout/collapsed'])
        const routes = computed(() => store.getters['layout/routes'])
        const animation = getPrefixCls('anim-scale')
        const params = reactive({
            max: 0,
            offset: 0,
            middle: 0,
            scroll: false,
            scrollInit: false,
            scrollOffset: 48,
            active: null,
            current: null
        })
        const containerRef = ref(null)
        const listRef = ref(null)
        const itemsRef = ref(null)

        onBeforeUnmount(() => $tools.off(window, 'resize', windowResize))
        onMounted(() => {
            initRouteHistory()
            $tools.on(window, 'resize', windowResize)
        })

        watch(
            () => collapsed.value,
            () => nextTick().then(() => initRouteHistory(false))
        )
        watch(
            () => route.path,
            () => nextTick().then(() => initRouteHistory())
        )

        const initRouteHistory = (collect = true) => {
            if (collect) collectRouteHistory()
            initRouteHistoryScroll()
            redirectRouteHistory(params.active)
        }

        const collectRouteHistory = () => {
            params.current = route.name
            if (!routes.value[route.name]) {
                const tempRoutes = { ...routes.value }
                tempRoutes[route.name] = {
                    name: route.name,
                    title: route.meta.title,
                    path: route.path
                } as RouteHistory
                params.active = tempRoutes[route.name]
                store.commit(`layout/${mutations.layout.routes}`, tempRoutes)
            } else params.active = routes.value[route.name]
        }

        const initRouteHistoryScroll = () => {
            nextTick().then(() => {
                if (containerRef.value && listRef.value && itemsRef.value) {
                    const listWidth = listRef.value.clientWidth
                    const itemsWidth = itemsRef.value.clientWidth
                    const max = itemsWidth - listWidth
                    params.scroll = max > 0
                    params.scrollOffset = params.scroll ? 96 : 48
                    params.middle = Math.floor((listWidth - (params.scrollInit ? 0 : params.scrollOffset)) / 2)
                    if (params.scroll) params.max = itemsWidth - listRef.value.clientWidth + (params.scrollInit ? 0 : params.scrollOffset)
                    else params.max = max > 0 ? max : 0
                    if (!params.scrollInit) params.scrollInit = true
                }
            })
        }

        const redirectRouteHistory = (item: RouteHistory): any => {
            nextTick().then(() => {
                const elem = document.getElementById(`${prefixCls}-item-${item.name}`)
                if (elem) {
                    const halfWidth = Math.ceil(elem.clientWidth / 2)
                    const offsetLeft = elem.offsetLeft + halfWidth
                    const diff = offsetLeft - params.middle
                    const offset = diff < 0 ? 0 : diff > params.max ? params.max : diff
                    params.offset = - offset
                    params.active = item
                    params.current = item.name
                    if (route.path !== item.path) {
                        router.push({ path: item.path })
                        $g.menus.active = [$g.prefix + item.name]
                    }
                }
            })
        }

        const removeRouteHistory = (item: RouteHistory, evt?: MouseEvent): any => {
            const tempRoutes = {}
            const keys = Object.keys({ ...routes.value })
            const len = keys.length
            let prev: RouteHistory | null
            let next: RouteHistory | null
            for (let i = 0; i < len; i++) {
                if (keys[i] !== item.name) {
                    tempRoutes[keys[i]] = routes.value[keys[i]]
                } else {
                    prev = routes.value[keys[i - 1]] ?? null
                    next = routes.value[keys[i + 1]] ?? null
                }
            }
            if (item.name === params.current) {
                if (len > 1) {
                    params.active = prev ?? next ?? null
                    params.current = prev ? prev.name : (next ? next.name : null)
                    router.push({ path: params.active.path })
                }
            }
            if (len - 1 > 0) store.commit(`layout/${mutations.layout.routes}`, tempRoutes)
            if (evt) evt.preventDefault()
        }

        const closeRouteHistory = (type: string) => {
            const tempRoutes = {
                left: {},
                right: {},
                other: {}
            }
            const flag = {
                left: false,
                right: false
            }
            for (const name in routes.value) {
                if (Object.prototype.hasOwnProperty.call(routes.value, name)) {
                    const item = routes.value[name] as RouteHistory
                    if (name === params.current) {
                        flag.left = true
                        flag.right = true
                    }
                    if (!flag.left) tempRoutes.left[name] = item
                    if (name !== params.current) {
                        if (flag.right) tempRoutes.right[name] = item
                        tempRoutes.other[name] = item
                    }
                }
            }
            if (type === 'all') {
                store.commit(`layout/${mutations.layout.routes}`, {})
                collectRouteHistory()
                windowResize()
            } else {
                const data = tempRoutes[type]
                const keys = Object.keys(data)
                for (let i = 0, l = keys.length; i < l; i++) {
                    delete routes.value[keys[i]]
                }
                store.commit(`layout/${mutations.layout.routes}`, { ...routes.value })
            }
            nextTick().then(() => initRouteHistory(false))
        }

        const prevRouteHistory = () => {
            const listWidth = listRef.value.clientWidth
            const offset = Math.abs(params.offset) - listWidth
            params.offset = -(offset <= 0 ? 0 : offset)
        }

        const nextRouteHistory = () => {
            const listWidth = listRef.value.clientWidth
            const offset = Math.abs(params.offset) + listWidth
            params.offset = -(offset >= params.max ? params.max : offset)
        }

        const windowResize = () => {
            initRouteHistoryScroll()
            redirectRouteHistory(params.active)
        }

        const renderBtn = (clickHandler: (...args: any) => any, type = 'prev') => {
            const icon = type === 'prev'
                ? <Tooltip title={t('page.prev')}><LeftOutlined /></Tooltip>
                : <Tooltip title={t('page.next')}><RightOutlined /></Tooltip>
            const disabled = type === 'prev'
                ? params.offset === 0 ? ' disabled' : ''
                : Math.abs(params.offset) >= params.max ? ' disabled' : ''
            return (
                <div class={`${prefixCls}-btn${disabled}`} onClick={clickHandler}>
                    {icon}
                </div>
            )
        }

        const renderList = () => {
            const items = []
            for (const name in routes.value) {
                if (Object.prototype.hasOwnProperty.call(routes.value, name)) {
                    const item = routes.value[name] as RouteHistory
                    const cls = `${prefixCls}-item${params.current === item.name ? ' active' : ''}`
                    items.push(
                        <Transition name={animation} appear={true}>
                            <div class={cls}
                                key={name}
                                id={`${prefixCls}-item-${item.name}`}>
                                <span innerHTML={item.title} onClick={() => redirectRouteHistory(item)} />
                                <CloseOutlined onClick={(evt: MouseEvent) => removeRouteHistory(item, evt)} />
                            </div>
                        </Transition>
                    )
                }
            }
            return (
                <div class={`${prefixCls}-list`} ref={listRef}>
                    <div class={`${prefixCls}-items`}
                        ref={itemsRef}
                        style={{transform: `translateX(${$tools.convert2Rem(params.offset)})`}}>
                        {items}
                    </div>
                </div>
            )
        }

        const renderMenu = () => {
            return (
                <div class={`${prefixCls}-menu`}>
                    <MiDropdown
                        title={DownOutlined}
                        items={[
                            {
                                icon: ArrowLeftOutlined,
                                title: t('history.close.left'),
                                name: 'left',
                                callback: () => closeRouteHistory('left')
                            },
                            {
                                icon: ArrowRightOutlined,
                                title: t('history.close.right'),
                                name: 'right',
                                callback: () => closeRouteHistory('right')
                            },
                            {
                                icon: CloseOutlined,
                                title: t('history.close.other'),
                                name: 'other',
                                callback: () => closeRouteHistory('other')
                            },
                            {
                                icon: CloseCircleOutlined,
                                title: t('history.close.all'),
                                name: 'all',
                                callback: () => closeRouteHistory('all')
                            }
                        ]}
                    />
                </div>
            )
        }

        return () => {
            const cls = `${prefixCls}${!params.scroll ? ` ${prefixCls}-btn-disabled` : ''}`
            return (
                <div class={cls} ref={containerRef}>
                    {renderBtn(prevRouteHistory)}
                    {renderList()}
                    {renderBtn(nextRouteHistory, 'next')}
                    {renderMenu()}
                </div>
            )
        }
    }
})