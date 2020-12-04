import { defineComponent, createVNode } from 'vue'
import {
    LeftOutlined, RightOutlined, CloseOutlined, DownOutlined,
    ArrowLeftOutlined, ArrowRightOutlined, CloseCircleOutlined
} from '@ant-design/icons-vue'
import { $tools } from '../../utils/tools'
import MiDropdown from '../dropdown'
import { mutations } from '../../store/types'

const prefixCls = $tools.getPrefixCls('layout-history')
export default defineComponent({
    name: 'MiHistory',
    computed: {
        collapsed() {return this.$store.getters['layout/collapsed']},
        routes() {return this.$store.getters['layout/routes']}
    },
    data() {
        return {
            max: 0,
            offset: 0,
            middle: 0,
            scroll: false,
            active: null,
            current: null
        }
    },
    watch: {
        collapsed() {this.$nextTick(() => this.initHistory(false))},

        $route() {this.$nextTick(() => this.initHistory())}
    },
    beforeUnmount() {
        this.$tools.off(window, 'resize', this.windowResize)
    },
    mounted() {
        this.$nextTick(() => this.initHistory())
        this.$tools.on(window, 'resize', this.windowResize)
    },
    methods: {
        initHistory(collect = true) {
            if (collect) this.collectHistoryRoute()
            this.initHistoryRouteScroll()
            this.gotoHistoryRoute(this.active)
        },
        initHistoryRouteScroll() {
            const container = this.$refs[prefixCls]
            const list = this.$refs[`${prefixCls}-list`]
            const items = this.$refs[`${prefixCls}-items`]
            if (container && list && items) {
                const listWidth = list.clientWidth
                const itemsWidth = items.clientWidth
                const max = itemsWidth - listWidth
                this.middle = Math.floor(listWidth / 2)
                this.scroll = max > 0
                if (this.scroll) {
                    this.$nextTick(() => {
                        this.max = itemsWidth - list.clientWidth
                    })
                } else this.max = max > 0 ? max : 0
            }
        },
        prevHistoryRoute() {
            const list = this.$refs[`${prefixCls}-list`]
            const listWidth = list.clientWidth
            const offset = Math.abs(this.offset) - listWidth
	        this.offset = -(offset <= 0 ? 0 : offset)
        },
        nextHistoryRoute() {
            const list = this.$refs[`${prefixCls}-list`]
            const listWidth = list.clientWidth
            const offset = Math.abs(this.offset) + listWidth;
            this.offset = -(offset >= this.max ? this.max : offset)
        },
        collectHistoryRoute() {
            this.current = this.$route.name
            if (!this.routes[this.$route.name]) {
                const routes = Object.assign({}, this.routes)
                routes[this.$route.name] = {
                    name: this.$route.name,
                    title: this.$route.meta.title,
                    path: this.$route.path
                }
                this.active = routes[this.$route.name]
                this.$store.commit(`layout/${mutations.layout.routes}`, routes)
            } else this.active = this.routes[this.$route.name]
        },
        closeHistoryRoute(type: string) {
            const routes = {
                left: {},
                right: {},
                other: {}
            }
            const flag = {
                left: false,
                right: false
            }
            for (const name in this.routes) {
                if (Object.prototype.hasOwnProperty.call(this.routes, name)) {
                    const cur = this.routes[name]
                    if (name === this.current) {
                        flag.left = true
                        flag.right = true
                    }
                    if (!flag.left) routes.left[name] = cur
                    if (name !== this.current) {
                        if (flag.right) routes.right[name] = cur
                        routes.other[name] = cur
                    }
                }
            }
            if (type === 'all') {
                this.$store.commit(`layout/${mutations.layout.routes}`, {})
                this.collectHistoryRoute()
                this.windowResize()
            } else {
                const data = routes[type]
                const keys = Object.keys(data)
                for (let i = 0, len = keys.length; i < len; i++) {
                    delete this.routes[keys[i]]
                }
                const history = Object.assign({}, this.routes)
                this.$store.commit(`layout/${mutations.layout.routes}`, history)
            }
            this.$nextTick(() => this.initHistory(false))
        },
        gotoHistoryRoute(item: any) {
            const elem = this.$refs[`${prefixCls}-item-${item.name}`]
            if (elem) {
                const width = Math.ceil(elem.clientWidth / 2)
                const left = elem.offsetLeft + width
                const diff = left - this.middle
                const offset = diff < 0 ? 0 : (diff > this.max ? this.max : diff)
                this.offset = - offset
                this.active = item
                this.current = item.name
                if (this.$route.path !== item.path) {
                    this.$router.push({path: item.path})
                    const active = this.$g.prefix + item.name
                    this.$g.menus.active = [active]
                }
            }
        },
        removeHistoryRoute(item: any) {
            const routes = {}
            const keys = Object.keys(this.routes)
            const len = keys.length
            let prev: any, next: any;
            for(let i = 0; i < len; i++) {
                if (keys[i] !== item.name) {
                    routes[keys[i]] = this.routes[keys[i]]
                } else {
                    prev = this.routes[keys[i - 1]] ?? null
                    next = this.routes[keys[i + 1]] ?? null
                }
            }
            /** delete selected - reselect */
            if (item.name === this.current) {
                if (len > 1) {
                    this.active = prev ?? next ?? null
                    this.current = prev ? prev.name : (next ? next.name : null)
                    this.$router.push({path: this.active.path})
                }
            }
            if (len - 1 > 0) this.$store.commit(`layout/${mutations.layout.routes}`, routes)
        },
        windowResize() {
            this.initHistoryRouteScroll()
            this.gotoHistoryRoute(this.active)
        },
        getBtnElem(clickHandler: (...args: any) => {}, type = 'prev') {
            const icon = type === 'prev'
                ? <LeftOutlined />
                : <RightOutlined />
            return (
                <div class={`${prefixCls}-btn`} onClick={clickHandler}>
                    { icon }
                </div>
            )
        },
        getListElem() {
            const itemsStyle = {transform: `translateX(${this.offset}px)`}
            const items = []
            for (const name in this.routes) {
                if (Object.prototype.hasOwnProperty.call(this.routes, name)) {
                    const item = this.routes[name]
                    items.push((
                        <div class={`${prefixCls}-item${this.current === item.name ? ' active' : ''}`}
                            ref={`${prefixCls}-item-${item.name}`} key={name} onClick={this.gotoHistoryRoute.bind(this, item)}>
                            <span innerHTML={item.title}></span>
                            <CloseOutlined onClick={this.removeHistoryRoute.bind(this, item)} />
                        </div>
                    ))
                }
            }
            return (
                <div class={`${prefixCls}-list`} ref={`${prefixCls}-list`}>
                    <div class={`${prefixCls}-items`} ref={`${prefixCls}-items`} style={itemsStyle}>
                        { ...items }
                    </div>
                </div>
            )
        },
        getMenuItem() {
            return (
                <div class={`${prefixCls}-menu`}>
                    <MiDropdown title={createVNode(DownOutlined)} items={[{
                        icon: createVNode(ArrowLeftOutlined),
                        title: '关闭左侧',
                        name: 'left',
                        callback: () => this.closeHistoryRoute('left')
                    }, {
                        icon: createVNode(ArrowRightOutlined),
                        title: '关闭右侧',
                        name: 'right',
                        callback: () => this.closeHistoryRoute('right')
                    }, {
                        icon: createVNode(CloseOutlined),
                        title: '关闭其它',
                        name: 'other',
                        callback: () => this.closeHistoryRoute('other')
                    }, {
                        icon: createVNode(CloseCircleOutlined),
                        title: '关闭全部',
                        name: 'all',
                        callback: () => this.closeHistoryRoute('all')
                    }]} placement="bottomLeft"></MiDropdown>
                </div>
            )
        }
    },
    render() {
        const cls = `${prefixCls}${!this.scroll ? ` ${prefixCls}-btn-disabled` : ''}`
        return (
            <div class={cls} ref={prefixCls}>
                { this.getBtnElem(this.prevHistoryRoute) }
                { this.getListElem() }
                { this.getBtnElem(this.nextHistoryRoute, 'next') }
                { this.getMenuItem() }
            </div>
        )
    }
})