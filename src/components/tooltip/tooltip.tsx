import { defineComponent, Teleport, Transition, VNode, vShow, withDirectives } from 'vue'
import PropTypes, { getSlot, tuple, getEvents, getSlotContent } from '../../utils/props'

export default defineComponent({
    name: 'MiTooltip',
    inheritAttrs: false,
    props: {
        title: PropTypes.any,
        visible: PropTypes.bool,
        placement: PropTypes.oneOf(
            tuple(
                'top', 'topLeft', 'topRight', 'top-left', 'top-right',
                'left', 'leftTop', 'leftBottom', 'left-top', 'left-bottom',
                'bottom', 'bottomLeft', 'bottomRight', 'bottom-left', 'bottom-right',
                'right', 'rightTop', 'rightBottom', 'right-top', 'right-bottom'
            )
        ).def('top'),
        trigger: PropTypes.oneOf(
            tuple(
                'hover', 'click',
                'focus', 'contextmenu'
            )
        ).def('hover'),
        animation: PropTypes.oneOf(
            tuple(
                'scale', 'newspaper', 'sticky', 'sign', 'flip',
                'flip-horizontal', 'flip-vertical', 'shake'
            )
        ).def('scale'),
        animationDuration: PropTypes.number,
        className: PropTypes.string,
        forceRender: PropTypes.bool.def(false),
        delayShow: PropTypes.number.def(0),
        delayHide: PropTypes.number.def(0),
        autoAdjust: PropTypes.bool.def(true),
        container: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.object]),
        destroy: PropTypes.bool.def(false),
        bgColor: PropTypes.string,
        textColor: PropTypes.string
    },
    watch: {
        visible(val: boolean) {
            this.show = val
        }
    },
    data() {
        return {
            id: `mi-${(this.$tools as any).uid()}`,
            prefixCls: 'mi-tooltip',
            originEvents: {},
            show: this.$props.visible,
            position: {},
            direction: this.$props.placement,
            offset: 16,
            clickOutside: null,
            _container: null,
            _component: null
        }
    },
    methods: {
        getContainer() {
            const type = typeof this.container
            if (type === 'function') return this.container()
            if (type === 'string') {
                let temp = this.container
                if (temp.indexOf('#') === -1) temp = `#${temp}`
                return document.querySelector(temp)
            }
            if (
                type === 'object' &&
                this.container instanceof window.HTMLElement
            ) return this.container
            return document.body
        },
        createContainer() {
            this._container = this.getContainer()
            this.$forceUpdate()
        },
        removeContainer() {
            this._container = null
            this._component = null
        },
        saveContainer(elem: any) {
            this._component = elem
        },
        onMouseEnter(e: any) {
            this.fireEvents('onMouseEnter', e)
            this.delayPopupVisible(true, this.delayShow, e)
        },
        onMouseLeave(e: any) {
            this.fireEvents('onMouseLeave', e)
            this.delayPopupVisible(false, this.delayHide)
        },
        onMouseDown(e: any) {
            this.fireEvents('onMouseDown', e)
        },
        onClick(e: any) {
            this.fireEvents('onClick', e)
            if (e && e.preventDefault) e.preventDefault()
            if (e && e.domEvent) e.domEvent.preventDefault()
            const visible = !this.show
            this.delayPopupVisible(visible, visible ? this.delayShow : this.delayHide, e ?? null)
        },
        onTouchStart(e: any) {
            this.fireEvents('onTouchstart', e)
        },
        onFocus(e: any) {
            this.fireEvents('onFocus', e)
            this.delayPopupVisible(true, this.delayShow, e)
        },
        onBlur(e: any) {
            this.fireEvents('onBlur', e)
            this.delayPopupVisible(false, this.delayHide)
        },
        fireEvents(type: string, e: any) {
            if (this.originEvents[type]) this.originEvents[type](e)
            const event = this.$props[type] || this.$attrs[type]
            if (event) event(e)
        },
        onContextmenu(e: any) {
            if (e && e.preventDefault) e.preventDefault()
            if (e && e.domEvent) e.domEvent.preventDefault()
            this.fireEvents('onContextmenu', e)
            const visible = !this.show
            this.delayPopupVisible(visible, visible ? this.delayShow : this.delayHide, e ?? null)
        },
        onDocumentClick(e: any) {
            const target = e.target
            const root = this.$tools.findDOMNode(this)
            if (root && !root.contains(target)) this.delayPopupVisible(false, this.delayHide)
        },
        popupVisible(popupVisible: boolean, event: any) {
            this.clearDelayTimer()
            this.show = popupVisible
            if (event) {
                this.$nextTick(() => {
                    const elem = this.$refs[`${this.prefixCls}-content`]
                    const width = elem.offsetWidth
                    const height = elem.offsetHeight
                    const target = event.target
                    const targetWidth = target.offsetWidth
                    const targetHeight = target.offsetHeight
                    const halfWidth = Math.round(targetWidth / 2 * 100) / 100
                    const halfHeight = Math.round(targetHeight / 2 * 100) / 100
                    const offsetX = event.offsetX || 0
                    const offsetY = event.offsetY || 0
                    const pageX = event.pageX || this.$tools.getElementActualTopLeft(target, 'left')
                    const pageY = event.pageY || this.$tools.getElementActualTopLeft(target)
                    let x = pageX + (halfWidth - offsetX) - (Math.round(width / 2 * 100) / 100)
                    let y = pageY - offsetY - height - this.offset
                    const leftX = pageX - offsetX - width - this.offset
                    const rightX = pageX + targetWidth - offsetX + this.offset
                    const bottomY = pageY - offsetY + targetHeight + this.offset
                    if (this.autoAdjust) this.autoAdjustPlacement(target, elem)
                    switch (this.direction) {
                        case 'topLeft':
                        case 'top-left':
                            x = pageX - offsetX
                            break;
                        case 'topRight':
                        case 'top-right':
                            x = pageX + (targetWidth - offsetX) - width
                            break;
                        case 'leftTop':
                        case 'left-top':
                            x = leftX
                            y = pageY - offsetY
                            break;
                        case 'left':
                            x = leftX
                            y = pageY + (halfHeight - offsetY) - Math.round(height / 2 * 100) / 100
                            break;
                        case 'leftBottom':
                        case 'left-bottom':
                            x = leftX
                            y = pageY - offsetY + targetHeight - height
                            break;
                        case 'bottomLeft':
                        case 'bottom-left':
                            x = pageX - offsetX
                            y = bottomY
                            break;
                        case 'bottom':
                            y = bottomY
                            break;
                        case 'bottomRight':
                        case 'bottom-right':
                            x = pageX - offsetX + targetWidth - width
                            y = bottomY
                            break;
                        case 'rightTop':
                        case 'right-top':
                            x = rightX
                            y = pageY - offsetY
                            break;
                        case 'right':
                            x = rightX
                            y = pageY + (halfHeight - offsetY) - Math.round(height / 2 * 100) / 100
                            break;
                        case 'rightBottom':
                        case 'right-bottom':
                            x = rightX
                            y = pageY - offsetY + targetHeight - height
                            break;
                    }
                    this.position = {x, y}
                })
            }
        },
        delayPopupVisible(visible: boolean, time: number, event: any) {
            const delay = time * 1000
            this.clearDelayTimer()
            if (delay) {
                this.delayTimer = this.$tools.createRequestAnimationFrame(() => {
                    this.popupVisible(visible, event)
                    this.clearDelayTimer()
                }, delay)
            } else this.popupVisible(visible, event)
        },
        clearDelayTimer() {
            if (this.delayTimer) {
                this.$tools.cancelRequestAnimationFrame(this.delayTimer)
                this.delayTimer = null
            }
        },
        autoAdjustPlacement(
            targetElem: HTMLElement,
            contentElem: HTMLElement
        ) {
            if (targetElem && contentElem) {
                let direction = this.direction
                const width = document.body.clientWidth
                const height = document.body.clientHeight
                const targetWidth = targetElem.offsetWidth
                const targetHeight = targetElem.offsetHeight
                const contentWidth = contentElem.offsetWidth
                const contentHeight = contentElem.offsetHeight
                const top = this.$tools.getElementActualTopLeft(targetElem)
                const left = this.$tools.getElementActualTopLeft(targetElem, 'left')
                const offset = {
                    top,
                    left,
                    right: width - targetWidth - left,
                    bottom: height - targetHeight - top
                }
                switch (this.placement) {
                    case 'left':
                    case 'leftTop':
                    case 'left-top':
                    case 'leftBottom':
                    case 'left-bottom':
                        if (
                            offset.left < contentWidth &&
                            offset.right > offset.left
                        ) {
                            if (this.direction === 'left') direction = 'right'
                            if (
                                this.direction === 'leftTop' ||
                                this.direction === 'left-top'
                            ) direction = 'right-top'
                            if (
                                this.direction === 'leftBottom' ||
                                this.direction === 'left-bottom'
                            ) direction = 'right-bottom'
                        } else direction = this.placement
                        break;
                    case 'right':
                    case 'rightTop':
                    case 'right-top':
                    case 'rightBottom':
                    case 'right-bottom':
                        if (
                            offset.right < contentWidth &&
                            offset.left > offset.right
                        ) {
                            if (this.direction === 'right') direction = 'left'
                            if (
                                this.direction === 'rightTop' ||
                                this.direction === 'right-top'
                            ) direction = 'left-top'
                            if (
                                this.direction === 'rightBottom' ||
                                this.direction === 'right-bottom'
                            ) direction = 'left-bottom'
                        } else direction = this.placement
                        break;
                    case 'top':
                    case 'topLeft':
                    case 'top-left':
                    case 'topRight':
                    case 'top-right':
                        if (
                            offset.top < contentHeight &&
                            offset.bottom > offset.top
                        ) {
                            if (this.direction === 'top') direction = 'bottom'
                            if (
                                this.direction === 'topLeft' ||
                                this.direction === 'top-left'
                            ) direction = 'bottom-left'
                            if (
                                this.direction === 'topRight' ||
                                this.direction === 'top-right'
                            ) direction = 'bottom-right'
                        } else direction = this.placement
                        break;
                    case 'bottom':
                    case 'bottomLeft':
                    case 'bottom-left':
                    case 'bottomRight':
                    case 'bottom-right':
                        if (
                            offset.bottom < contentHeight &&
                            offset.top > offset.bottom
                        ) {
                            if (this.direction === 'bottom') direction = 'top'
                            if (
                                this.direction === 'bottomLeft' ||
                                this.direction === 'bottom-left'
                            ) direction = 'top-left'
                            if (
                                this.direction === 'bottomRight' ||
                                this.direction === 'bottom-right'
                            ) direction = 'top-right'
                        } else direction = this.placement
                        break;
                }
                if (direction !== this.direction) this.direction = direction
            }
        }
    },
    beforeUnmount() {
        this.removeContainer()
    },
    mounted() {
        this.createContainer()
        if (this.forceRender || this.show) {
            this.$nextTick(() => {
                const elem = document.getElementById(this.id)
                if (elem) {
                    const elemWidth = elem.offsetWidth
                    const elemHeight = elem.offsetHeight
                    const position = {
                        x: this.$tools.getElementActualTopLeft(elem, 'left'),
                        y: this.$tools.getElementActualTopLeft(elem)
                    }
                    const content = this.$refs[`${this.prefixCls}-content`]
                    const width = content.offsetWidth
                    const height = content.offsetHeight
                    let x = position.x - (Math.round((width - elemWidth) / 2 * 100) / 100)
                    let y = position.y - (height + this.offset)
                    const centerY = position.y + (Math.round(elemHeight / 2 * 100) / 100) - Math.round(height / 2 * 100) / 100
                    const bottomY = position.y + elemHeight + this.offset
                    const leftX = position.x - width - this.offset
                    const rightX = position.x + elemWidth + this.offset
                    if (this.autoAdjust) this.autoAdjustPlacement(elem, content)
                    switch (this.direction) {
                        case 'topLeft':
                        case 'top-left':
                            x = position.x
                            break;
                        case 'topRight':
                        case 'top-right':
                            x = position.x + elemWidth - width
                            break;
                        case 'leftTop':
                        case 'left-top':
                            x = leftX
                            y = position.y
                            break;
                        case 'left':
                            x = leftX
                            y = centerY
                            break;
                        case 'leftBottom':
                        case 'left-bottom':
                            x = leftX
                            y = position.y + elemHeight - height
                            break;
                        case 'bottomLeft':
                        case 'bottom-left':
                            x = position.x
                            y = bottomY
                            break;
                        case 'bottom':
                            y = bottomY
                            break;
                        case 'bottomRight':
                        case 'bottom-right':
                            x = position.x + elemWidth - width
                            y = bottomY
                            break;
                        case 'rightTop':
                        case 'right-top':
                            x = rightX
                            y = position.y
                            break;
                        case 'right':
                            x = rightX
                            y = centerY
                            break;
                        case 'rightBottom':
                        case 'right-bottom':
                            x = rightX
                            y = position.y + elemHeight - height
                            break;
                    }
                    this.position = {x, y}
                }
            })
        }
        if (
            !this.clickOutside &&
            (this.trigger === 'click' ||
            this.trigger === 'contextmenu')
        ) this.clickOutside = this.$tools.on(document.body, 'mousedown', this.onDocumentClick)
    },
    render() {
        const children = this.$tools.filterEmpty(getSlot(this))
        const child = children[0]
        this.originEvents = getEvents(child)
        const newChildProps = {key: 'trigger', id: this.id} as any
        switch (this.trigger) {
            case 'hover':
                newChildProps.onMouseEnter = this.onMouseEnter
                newChildProps.onMouseLeave = this.onMouseLeave
                break;
            case 'click':
                newChildProps.onClick = this.onClick
                newChildProps.onMousedown = this.onMouseDown
                newChildProps.onTouchstart = this.onTouchStart
                break;
            case 'focus':
                newChildProps.onFocus = this.onFocus
                newChildProps.onBlur = this.onBlur
                break;
            case 'contextmenu':
                newChildProps.onContextmenu = this.onContextmenu
                break;
        }
        const newChild = this.$tools.cloneElement(child, newChildProps)
        let teleport: any
        if (
            this._container &&
            (this.show || this.forceRender || this._component)
        ) {
            const style = {
                left: `${this.position.x}px`,
                top: `${this.position.y}px`,
                transitionDuration: this.animationDuration
                    ? `${this.animationDuration}s`
                    : null
            }
            const bgColor = {background: this.bgColor ?? null}
            const boxShadow = {boxShadow: this.bgColor ? `0 0 6px ${this.bgColor}` : null}
            const arrowColor = {
                background: this.bgColor ?? null,
                boxShadow: this.bgColor ? `0 0 4px ${this.bgColor}` : null
            }
            const textColor = {color: this.textColor ?? null}
            const title = <div style={textColor}>{ getSlotContent(this, 'title') }</div>
            teleport = (
                <Teleport to={this._container} ref={this.saveContainer}>
                    <div ref={this.prefixCls}
                        class={this.prefixCls + `${this.className ? ` ${this.className}` : ''}`}>
                        <Transition key="tooltip" name={`mi-${this.animation}`} appear>
                            { withDirectives((
                                <div class={`${this.prefixCls}-${this.direction}`} style={this._component ? style : null}>
                                    <div class={`${this.prefixCls}-content`} ref={`${this.prefixCls}-content`} style={boxShadow}>
                                        <div class={`${this.prefixCls}-arrow`}>
                                            <span class={`${this.prefixCls}-arrow-inner`} style={arrowColor}></span>
                                        </div>
                                        <div class={`${this.prefixCls}-inner`} style={bgColor}>
                                            { title }
                                        </div>
                                    </div>
                                </div>
                            ) as VNode, [[vShow, this.show]]) }
                        </Transition>
                    </div>
                </Teleport>
            )
        }
        return [teleport, newChild]
    }
})