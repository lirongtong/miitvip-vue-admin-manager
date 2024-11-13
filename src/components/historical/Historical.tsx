import {
    defineComponent,
    ref,
    onMounted,
    computed,
    reactive,
    nextTick,
    watch,
    onBeforeUnmount,
    Transition
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HistoricalRoutingProps } from './props'
import { useHistoricalStore } from '../../stores/historical'
import { useLayoutStore } from '../../stores/layout'
import { type Routing } from './props'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'
import { Tooltip } from 'ant-design-vue'
import {
    LeftOutlined,
    RightOutlined,
    CloseOutlined,
    DownOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CloseCircleOutlined
} from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import MiDropdown from '../dropdown/Dropdown'
import applyTheme from '../_utils/theme'
import styled from './style/historical.module.less'

const MiHistoricalRouting = defineComponent({
    name: 'MiHistoricalRouting',
    inheritAttrs: false,
    props: HistoricalRoutingProps(),
    setup(props) {
        const { t } = useI18n()
        const route = useRoute()
        const router = useRouter()
        const historicalStore = useHistoricalStore()
        const layoutStore = useLayoutStore()
        const routes = computed(() => historicalStore.routes)
        const collapsed = computed(() => layoutStore.collapsed)
        const params = reactive({
            offset: 0,
            max: 0,
            middle: 0,
            scroll: false,
            current: null,
            active: null,
            first: false
        })
        const listRef = ref(null)
        const itemsRef = ref(null)
        const containerRef = ref(null)

        applyTheme(styled)

        const handleInit = (collect = true) => {
            if (collect) handleCollect()
            handleScroll()
        }

        const handleCollect = () => {
            params.current = route.name
            if (params.current && !routes.value?.[params.current]) {
                const temp = { ...routes.value }
                temp[params.current] = {
                    name: params.current,
                    title: route.meta?.title || params.current,
                    path: route.path
                } as Routing
                params.active = temp?.[params.current]
                historicalStore.setRoutes(temp)
            } else params.active = routes.value?.[params.current]
        }

        const handleScroll = () => {
            nextTick().then(() => {
                if (containerRef.value && listRef.value && itemsRef.value) {
                    setTimeout(() => {
                        const listWidth = listRef.value?.clientWidth
                        const itemsWidth = itemsRef.value?.clientWidth
                        const max = itemsWidth - listWidth
                        params.scroll = max > 0
                        params.middle = Math.floor(listWidth / 2)
                        if (params.scroll) params.max = itemsWidth - listWidth
                        else params.max = max > 0 ? max : 0
                        handleRedirect(params.active)
                    }, props.animationDuration)
                }
            })
        }

        const handleRedirect = (item: Routing) => {
            nextTick().then(() => {
                const elem = document.getElementById(`${$g.prefix}item-${item?.name}`)
                if (elem) {
                    const halfWidth = Math.ceil(elem.clientWidth / 2)
                    const offsetLeft = elem.offsetLeft + halfWidth
                    const diff = offsetLeft - params.middle
                    const offset = params.first
                        ? 0
                        : diff < 0
                          ? 0
                          : diff > params.max
                            ? params.max
                            : diff
                    params.offset = routes.value.length <= 1 ? 0 : -offset
                    params.active = item
                    params.current = item?.name
                    if (item?.path && route.path !== item?.path) router.push({ path: item?.path })
                }
            })
        }

        const handleRemove = (item: Routing, evt?: MouseEvent) => {
            const temp = {}
            const keys = Object.keys({ ...routes.value })
            const len = keys.length
            let prev: Routing | null = null
            let next: Routing | null = null
            for (let i = 0; i < len; i++) {
                if (keys[i] !== item.name) {
                    temp[keys[i]] = routes.value?.[keys[i]]
                } else {
                    prev = routes.value?.[keys[i - 1]] ?? null
                    next = routes.value?.[keys[i + 1]] ?? null
                }
            }
            if (item.name === params.current) {
                if (len > 1) {
                    params.active = prev ?? next ?? null
                    params.current = prev ? prev.name : next ? next.name : null
                    router.push({ path: params.active.path })
                    params.first = !prev
                }
            } else params.first = false
            if (len - 1 > 0) historicalStore.setRoutes(temp)
            if (evt) evt?.preventDefault()
        }

        const handleClose = (type: string) => {
            const temp = {
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
                    const item = routes.value[name] as Routing
                    if (name === params.current) {
                        flag.left = true
                        flag.right = true
                    }
                    if (!flag.left) temp.left[name] = item
                    if (name !== params.current) {
                        if (flag.right) temp.right[name] = item
                        temp.other[name] = item
                    }
                }
            }
            if (type === 'all') {
                historicalStore.setRoutes({})
                handleCollect()
                handleWindowResize()
            } else {
                const data = temp?.[type]
                const keys = Object.keys(data)
                for (let i = 0, l = keys.length; i < l; i++) {
                    delete routes.value[keys[i]]
                }
                historicalStore.setRoutes({ ...routes.value })
            }
            nextTick().then(() => setTimeout(() => handleInit(false), props.animationDuration))
        }

        const handlePrev = () => {
            const listWidth = listRef.value?.clientWidth
            const offset = Math.abs(params.offset) - listWidth
            params.offset = -(offset <= 0 ? 0 : offset)
        }

        const handleNext = () => {
            const listWidth = listRef.value?.clientWidth
            const offset = Math.abs(params.offset) + listWidth
            params.offset = -(offset >= params.max ? params.max : offset)
        }

        const handleWindowResize = () => handleScroll()

        const renderButton = (handler: (...args: any) => any, type = 'prev') => {
            const icon = (
                <Tooltip
                    title={type === 'prev' ? t('global.page.prev') : t('global.page.next')}
                    zIndex={Date.now()}>
                    {type === 'prev' ? <LeftOutlined /> : <RightOutlined />}
                </Tooltip>
            )
            const disabled =
                type === 'prev'
                    ? params.offset === 0
                        ? styled.btnDisabled
                        : ``
                    : Math.abs(params.offset) >= params.max
                      ? styled.btnDisabled
                      : ``
            return (
                <div class={[styled.btn, disabled]} onClick={handler}>
                    {icon}
                </div>
            )
        }

        const renderList = () => {
            const items = []
            for (const name in routes.value || {}) {
                if (Object.prototype.hasOwnProperty.call(routes.value, name)) {
                    const item = routes.value?.[name] as Routing
                    const classes = [
                        styled.item,
                        params.current === item.name ? styled.itemActive : ''
                    ]
                    const elem = (
                        <div
                            class={classes}
                            key={name}
                            id={`${$g.prefix}item-${item?.name}`}
                            style={{ transitionDuration: `${props.animationDuration}ms` }}>
                            <span class={styled.itemName} innerHTML={item?.title}></span>
                            <div class={styled.itemMask} onClick={() => handleRedirect(item)}></div>
                            <CloseOutlined
                                onClick={(evt?: MouseEvent) => handleRemove(item, evt)}
                            />
                        </div>
                    )
                    items.push(
                        props.animationName !== 'false' ? (
                            <Transition
                                name={`${$g.prefix}anim-${props.animationName}`}
                                appear={true}>
                                {elem}
                            </Transition>
                        ) : (
                            elem
                        )
                    )
                }
            }
            return (
                <div ref={listRef} class={styled.list}>
                    <div
                        ref={itemsRef}
                        class={styled.items}
                        style={{
                            transform: `translateX(${$tools.convert2rem(params.offset)})`
                        }}>
                        {items}
                    </div>
                </div>
            )
        }

        const renderDropdown = () => {
            const items = [
                {
                    icon: ArrowLeftOutlined,
                    title: t('global.closes.left'),
                    name: 'left',
                    callback: () => handleClose('left')
                },
                {
                    icon: ArrowRightOutlined,
                    title: t('global.closes.right'),
                    name: 'right',
                    callback: () => handleClose('right')
                },
                {
                    icon: CloseOutlined,
                    title: t('global.closes.other'),
                    name: 'other',
                    callback: () => handleClose('other')
                },
                {
                    icon: CloseCircleOutlined,
                    title: t('global.closes.all'),
                    name: 'all',
                    callback: () => handleClose('all')
                }
            ]
            return (
                <MiDropdown
                    v-slots={{
                        title: () => (
                            <div class={styled.dropdown}>
                                <DownOutlined />
                            </div>
                        )
                    }}
                    items={items}
                    trigger="click"
                />
            )
        }

        watch(
            () => collapsed.value,
            () => nextTick().then(() => handleInit(false))
        )

        watch(
            () => route.path,
            () => nextTick().then(() => handleInit())
        )

        onMounted(() => {
            handleInit()
            $tools.on(window, 'resize', handleWindowResize)
        })

        onBeforeUnmount(() => $tools.off(window, 'resize', handleWindowResize))

        return () => (
            <div ref={containerRef} class={styled.container}>
                {renderButton(handlePrev)}
                {renderList()}
                {renderButton(handleNext, 'next')}
                {renderDropdown()}
            </div>
        )
    }
})

export default MiHistoricalRouting
