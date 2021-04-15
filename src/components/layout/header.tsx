import { defineComponent, computed } from 'vue'
import { Layout, Popover, Radio } from 'ant-design-vue'
import { useStore } from 'vuex'
import screenfull from 'screenfull'
import {
    MenuFoldOutlined, MenuUnfoldOutlined, ExpandOutlined,
    CompressOutlined, BgColorsOutlined
} from '@ant-design/icons-vue'
import PropTypes, { getSlotContent } from '../../utils/props'
import { mutations } from '../../store/types'
import MiNotice from '../notice'
import MiDropdown from '../dropdown'
import MiModal from '../modal'

export default defineComponent({
    name: 'MiLayoutHeader',
    props: {
        className: PropTypes.string,
        notice: PropTypes.any,
        dropdown: PropTypes.any,
        palette: PropTypes.any,
        stretchIcon: PropTypes.any,
        extra: PropTypes.any
    },
    setup() {
        const store = useStore()
        const collapsed = computed(() => store.getters['layout/collapsed'])
        const full = false
        return {collapsed, store, full}
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('layout-header')
        },
        getStretchIcon() {
            let icon = getSlotContent(this, 'stretchIcon')
            if (icon === undefined) {
                if (this.$g.mobile) icon = <MenuUnfoldOutlined />
                else if (!this.collapsed) icon = <MenuFoldOutlined />
                else icon = <MenuUnfoldOutlined />
            }
            return icon
        },
        getDefaultScreenIcon() {
            let screen = !this.full
                ? <ExpandOutlined onClick={this.screenfullQuitOrIn}></ExpandOutlined>
                : <CompressOutlined onClick={this.screenfullQuitOrIn}></CompressOutlined>
            if (this.$g.mobile) screen = null
            return screen
        },
        getNoticeElem() {
            const prefixCls = this.getPrefixCls()
            const notice = getSlotContent(this, 'notice')
            return (notice ?? <MiNotice class={`${prefixCls}-notice`}></MiNotice>)
        },
        getDropdownElem() {
            const dropdown = getSlotContent(this, 'dropdown')
            return (dropdown ?? <MiDropdown></MiDropdown>)
        },
        handlePaletteChange() {
            this.$g.theme = this.$g.theme === 'dark'
                ? 'light'
                : 'dark'
            this.$tools.setThemeVariables(this.$g.theme)
            this.$cookie.set(this.$g.caches.cookies.theme, this.$g.theme)
        },
        getPaletteContentElem() {
            const prefixCls = `${this.getPrefixCls()}-palette`
            return (
                <div class={prefixCls}>
                    <div class={`${prefixCls}-item${this.$g.theme === 'dark' ? ' active' : ''}`}
                        onClick={this.handlePaletteChange}>
                        <div class={`${prefixCls}-thumb`}>
                            <img src={this.$g.thumbnails.dark} />
                        </div>
                        <div class={`${prefixCls}-select`}>
                            <Radio checked={this.$g.theme === 'dark'}>深色</Radio>
                        </div>
                    </div>
                    <div class={`${prefixCls}-item${this.$g.theme === 'light' ? ' active' : ''}`}
                        onClick={this.handlePaletteChange}>
                        <div class={`${prefixCls}-thumb`}>
                            <img src={this.$g.thumbnails.light} />
                        </div>
                        <div class={`${prefixCls}-select`}>
                            <Radio checked={this.$g.theme === 'light'}>浅色</Radio>
                        </div>
                    </div>
                </div>
            )
        },
        getPaletteElem() {
            const palette = getSlotContent(this, 'palette')
            return palette ?? (
                <Popover trigger="click"
                    placement="bottom"
                    content={this.getPaletteContentElem()}>
                    <BgColorsOutlined />
                </Popover>
            )
        },
        setCollapsed() {
            if (this.$g.mobile) {
                this.$g.menus.drawer = !this.$g.menus.drawer
            } else {
                const collapse = !this.collapsed
                this.$g.menus.collapsed = collapse
                this.store.commit(`layout/${mutations.layout.collapsed}`, collapse)
            }
        },
        screenfullQuitOrIn() {
            if (screenfull.isEnabled) {
                const elem = document.body
                if (elem) {
                    this.full = !this.full
                    this.$forceUpdate()
                    if (this.full) {
                        screenfull.request(elem)
                        screenfull.on('error', () => MiModal.error({content: '全屏失败，请刷新后再试'}))
                    } else screenfull.exit()
                    screenfull.on('change', () => {
                        const isFullscreen = (screenfull as any).isFullscreen
                        if (isFullscreen !== this.full) {
                            this.full = this.isFullscreen
                            this.$forceUpdate()
                        }
                    })
                } else MiModal.error({content: '未获取到要全屏展示的内容'})
            } else MiModal.error({content: '当前浏览器不支持全屏操作'})
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        const headerCls = {
            left: `${prefixCls}-left`,
            right: `${prefixCls}-right`,
            trigger: `${prefixCls}-trigger`,
            triggerMin: `${prefixCls}-trigger-min`
        }
        const triggerCls = `${headerCls.trigger} ${headerCls.triggerMin}`
        const headerExtra = getSlotContent(this, 'extra')
        const screenfullIcon = this.getDefaultScreenIcon()
        const screenfullElem = screenfullIcon
            ? <div class={triggerCls}>{ screenfullIcon }</div>
            : null
        return (
            <Layout.Header class={`${prefixCls} ${this.className ?? ''}`}>
                <div class={headerCls.left}>
                    <div class={headerCls.trigger} onClick={this.setCollapsed}>
                        { this.getStretchIcon() }
                    </div>
                </div>
                <div class={headerCls.right}>
                    { headerExtra }
                    { screenfullElem }
                    <div class={triggerCls}>{ this.getPaletteElem() }</div>
                    <div class={triggerCls}>{ this.getNoticeElem() }</div>
                    <div class={triggerCls}>{ this.getDropdownElem() }</div>
                </div>
            </Layout.Header>
        )
    }
})
