import {
    defineComponent,
    Transition,
    reactive,
    Teleport,
    isVNode,
    VNode,
    cloneVNode,
    Component,
    h
} from 'vue'
import MiSearchKey from './key'
import {
    FormOutlined,
    FrownOutlined,
    LeftCircleOutlined,
    RightCircleOutlined
} from '@ant-design/icons-vue'
import PropTypes from '../_utils/props-types'
import { getPrefixCls, tuple, getPropSlot } from '../_utils/props-tools'
import { $tools } from '../../utils/tools'
import { $g } from '../../utils/global'
import { $request } from '../../utils/request'
import { useI18n } from 'vue-i18n'

export const searchProps = () => ({
    prefixCls: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    radius: PropTypes.number.def(48),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    suffix: PropTypes.any,
    gap: PropTypes.number.def(0),
    borderColor: PropTypes.string,
    textColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    boxShadow: PropTypes.bool.def(false),
    boxShadowColor: PropTypes.string.def('#000'),
    boxShadowBlur: PropTypes.number.def(6),
    searchAction: PropTypes.string,
    searchMethod: PropTypes.string.def('post'),
    searchParams: PropTypes.object.def({}),
    searchKey: PropTypes.string.isRequired,
    searchKeyColor: PropTypes.string,
    searchDelay: PropTypes.number,
    data: PropTypes.array,
    listShowAnimation: PropTypes.oneOf(
        tuple(
            'fade',
            'scale',
            'slide',
            'slide-right',
            'slide-bottom',
            'slide-fall',
            'newspaper',
            'sticky',
            'flip',
            'flip-horizontal',
            'flip-vertical',
            'fall',
            'rotate',
            'sign'
        )
    ).def('scale'),
    itemTemplate: PropTypes.any,
    itemColor: PropTypes.string,
    listWidth: PropTypes.number,
    listHeight: PropTypes.number,
    listRadius: PropTypes.number.def(24),
    listBorderColor: PropTypes.string,
    listBackground: PropTypes.string,
    listBoxShadow: PropTypes.bool.def(true),
    listBoxShadowColor: PropTypes.string,
    listBoxShadowBlur: PropTypes.number.def(6),
    listNoDataText: PropTypes.string,
    listNoDataColor: PropTypes.string.def('#000'),
    listDestroyOnHide: PropTypes.bool.def(false),
    pagination: PropTypes.bool.def(true),
    pageSize: PropTypes.number.def(10),
    pageColor: PropTypes.string,
    colseAfterItemClick: PropTypes.bool.def(false)
})

const MiSearch = defineComponent({
    name: 'MiSearch',
    inheritAttrs: false,
    props: searchProps(),
    slots: ['itemTemplate', 'suffix'],
    emits: [
        'focus',
        'blur',
        'keydown',
        'keyup',
        'pressEnter',
        'itemClick',
        'input',
        'change',
        'update:value',
        'close'
    ],
    setup(props, { slots, attrs, emit }) {
        const { t } = useI18n()
        const prefixCls = getPrefixCls('search', props.prefixCls)
        const prefixIdx = getPrefixCls('index')
        const listAnim = getPrefixCls(`anim-${props.listShowAnimation}`)
        const itemAnim = getPrefixCls('anim-slide')
        const params = reactive({
            loading: false,
            keyword: '',
            show: false,
            focused: false,
            datas: props.data ?? [],
            list: props.data ?? [],
            error: null,
            timer: null,
            page: {
                total: 0,
                active: 1
            }
        })

        const renderList = () => {
            const style = {
                width: props.listWidth ? `${$tools.px2Rem(props.listWidth)}rem` : null,
                height: props.listHeight
                    ? `${$tools.px2Rem(props.listHeight > 164 ? props.listHeight : 164)}rem`
                    : null,
                top: props.height ? `${$tools.px2Rem(props.height)}rem` : null,
                background: props.listBackground ?? null,
                borderColor: props.listBorderColor ?? null,
                borderRadius: props.listRadius ? `${$tools.px2Rem(props.listRadius)}rem` : null,
                boxShadow:
                    props.listBoxShadow && props.listBoxShadowColor
                        ? `0 0 ${$tools.px2Rem(props.listBoxShadowBlur)}rem ${
                              props.listBoxShadowColor
                          }`
                        : null,
                marginTop: props.gap ? `${$tools.px2Rem(props.gap)}rem` : null
            }
            const elem = (
                <>
                    {/* no data */}
                    {params.list.length <= 0 && !params.loading && !params.error ? (
                        <div class={`${prefixCls}-no-data`}>
                            <FormOutlined />
                            <p>{props.listNoDataText ?? t('no-data')}</p>
                        </div>
                    ) : null}
                    {/* error */}
                    {params.error ? <div class={`${prefixCls}-error`}>{params.error}</div> : null}
                    {renderLoading()}
                    {renderResultList()}
                    {renderPagination()}
                </>
            )
            const res = props.listDestroyOnHide ? (
                params.show ? (
                    <div class={`${prefixCls}-list`} style={style}>
                        {elem}
                    </div>
                ) : null
            ) : (
                <div class={`${prefixCls}-list`} style={style} v-show={params.show}>
                    {elem}
                </div>
            )
            return (
                <Transition name={listAnim} appear={true}>
                    {res}
                </Transition>
            )
        }

        const renderResultList = () => {
            const res = []
            const template = getPropSlot(slots, props, 'itemTemplate')
            let min = 0
            let max = 0
            if (props.pagination) {
                min = (params.page.active - 1) * props.pageSize
                max = params.page.active * props.pageSize
            }
            const key = getPrefixCls(`item-${min}-${max}`, props.prefixCls)
            const pushResultItem = (item: {}, elem: any) => {
                res.push(
                    <div
                        class={`${prefixCls}-item`}
                        style={{ color: props.itemColor ?? null }}
                        onClick={(evt: Event) =>
                            handleListItemClick(params.datas[item[prefixIdx]] ?? item, evt)
                        }>
                        {elem}
                    </div>
                )
            }
            if (template) {
                const templates = isVNode(template) ? [template] : template
                params.list?.forEach((item: {}, idx) => {
                    let elems = []
                    if (props.pagination) {
                        if (idx >= min && idx < max) elems = renderCustomResultList(templates, item)
                    } else elems = renderCustomResultList(templates, item)
                    if (elems.length > 0) pushResultItem(item, elems)
                })
            } else {
                params.list?.forEach((item, idx) => {
                    let elem: any = null
                    if (props.pagination) {
                        if (idx >= min && idx < max) elem = renderDefaultResultList(item)
                    } else elem = renderDefaultResultList(item)
                    if (elem) pushResultItem(item, elem)
                })
            }
            return res.length > 0 ? (
                <Transition name={itemAnim} appear={true}>
                    <div class={`${prefixCls}-items`} key={key}>
                        {res}
                    </div>
                </Transition>
            ) : null
        }

        const renderDefaultResultList = (item: any) => {
            const avatar = item.avatar ? (
                <div class={`${prefixCls}-item-avatar`}>
                    <img src={item.avatar} alt={item.name ?? $g.powered} />
                </div>
            ) : null
            let icon = null
            if (item.icon) {
                const IconTag = isVNode(item.icon) ? item.icon : h(item.icon)
                icon = <IconTag />
            }
            const width = props.width
                ? avatar
                    ? `${$tools.px2Rem(props.width > 260 ? 180 : props.width - 80)}rem`
                    : null
                : null
            const info = (
                <div
                    class={`${prefixCls}-item-info${
                        item.content ? ` ${prefixCls}-item-info-has-content` : ''
                    }`}
                    style={{ width }}>
                    <div innerHTML={item[props.searchKey]} />
                    <div innerHTML={item.content ?? null} />
                </div>
            )
            return (
                <>
                    {avatar ?? icon ?? null}
                    {info}
                </>
            )
        }

        const renderCustomResultList = (templates: VNode[], item: object) => {
            const elems = []
            templates?.forEach((template: VNode) => {
                if (isVNode(template)) {
                    let elem = cloneVNode(template)
                    if ((template?.type as Component).name === MiSearchKey.name) {
                        elem = renderSearchKey(template, item)
                    }
                    elem = renderCustomResultListItem(elem, item)
                    elems.push(elem)
                }
            })
            return elems
        }

        const renderCustomResultListItem = (node: VNode, item: object) => {
            if (node?.children?.length > 0) {
                const data = { ...item }
                const children = []
                for (let i = 0, l = node.children.length; i < l; i++) {
                    const cur = node.children[i]
                    if (isVNode(cur)) {
                        let child = cloneVNode(cur)
                        if ((child.type as Component).name === MiSearchKey.name) {
                            children[i] = renderSearchKey(child, item)
                        } else children[i] = child
                        child = renderCustomResultListItem(child, data)
                    }
                }
                node.children = children
            }
            return node
        }

        const renderSearchKey = (node: VNode, item: {}) => {
            const tag = node.props.tag
            const name = node.props.name
            const type = node.props.type
            const key = $tools.uid(false, $g.prefix)
            return (
                <MiSearchKey
                    name={name}
                    tag={tag}
                    data={name !== props.searchKey ? $tools.htmlEncode(item[name]) : item[name]}
                    type={type}
                    key={key}
                />
            )
        }

        const renderLoading = () => {
            return params.loading ? (
                <div class={`${prefixCls}-loading`}>
                    <div class={`${prefixCls}-loading-spinner`}>
                        <div class={`${prefixCls}-loading-anim`}>
                            <div>
                                <div>
                                    <div style={{ borderColor: props.borderColor ?? null }}></div>
                                    <div style={{ background: props.borderColor ?? null }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class={`${prefixCls}-loading-text`}>{t('search.searching')}</div>
                </div>
            ) : null
        }

        const renderPagination = () => {
            const len = params.list.length
            if (props.pagination && !params.error && !params.loading && len > 0) {
                const total = Math.ceil(len / props.pageSize)
                params.page.total = total
                return (
                    <div class={`${prefixCls}-pagination`}>
                        <div class={`${prefixCls}-pagination-page`} style={style.page}>
                            <span
                                class={`prev${params.page.active <= 1 ? ' disabled' : ''}`}
                                title={t('page.prev')}
                                onClick={handlePagePrev}>
                                <LeftCircleOutlined />
                            </span>
                            {t('page.prefix')}
                            <input
                                min={1}
                                max={total}
                                type="mumber"
                                value={params.page.active}
                                onInput={handlePageInputChange}
                                onBlur={handlePageInputBlur}
                                onKeydown={handlePageInputKeydown}
                            />
                            / {total} {t('page.unit')}
                            <span
                                class={`next${
                                    params.page.active >= params.page.total ? ' disabled' : ''
                                }`}
                                title={t('page.next')}
                                onClick={handlePageNext}>
                                <RightCircleOutlined />
                            </span>
                        </div>
                        <div class={`${prefixCls}-pagination-total`} style={style.page}>
                            {t('page.total')}
                            <span>{len}</span>
                            {t('page.strip')}
                        </div>
                    </div>
                )
            }
        }

        const handlePagePrev = () => {
            if (params.page.active > 1) params.page.active--
        }
        const handlePageNext = () => {
            const next = params.page.active + 1
            if (next <= params.page.total) params.page.active = next
        }
        const handlePageInputChange = (evt: Event) => {
            const value = parseInt((evt.target as HTMLInputElement).value)
            if (value) params.page.active = value
            if (value > params.page.total) params.page.active = params.page.total
            if (!value) params.page.active = 1
        }
        const handlePageInputBlur = (evt: Event) => {
            handlePageInputChange(evt)
        }
        const handlePageInputKeydown = (evt: KeyboardEvent) => {
            if (evt.key === 'Enter') handlePageInputChange(evt)
        }

        const handleSearch = () => {
            const search = () => {
                if (props.searchAction) {
                    $request[props.searchMethod.toLowerCase()](
                        props.searchAction,
                        props.searchParams
                    )
                        .then((res: any) => {
                            params.loading = false
                            if (res.ret.code === 200) {
                                params.datas = res.data
                                handleSearchResult()
                            } else {
                                params.error = (
                                    <>
                                        <FrownOutlined />
                                        <p>{t('search.fail.message')}</p>
                                        <p>{t('search.fail.code') + res.ret.code}</p>
                                        <p>{t('search.fail.reason') + res.ret.message}</p>
                                    </>
                                )
                            }
                        })
                        .catch((err: any) => {
                            if (params.loading) {
                                params.loading = false
                                params.error = (
                                    <>
                                        <FrownOutlined />
                                        <p>{t('search.fail.api')}</p>
                                        <p>{err.message}</p>
                                    </>
                                )
                            }
                        })
                } else {
                    params.loading = false
                    handleSearchResult()
                }
            }
            if (props.searchDelay) {
                if (params.timer) clearTimeout(params.timer)
                params.timer = setTimeout(() => search(), props.searchDelay)
            } else search()
        }

        const handleSearchResult = () => {
            const reg = new RegExp(params.keyword, 'ig')
            params.datas?.forEach((data: {}, idx: number) => {
                if (data[props.searchKey] && reg.test(data[props.searchKey])) {
                    const temp = { ...data }
                    temp[props.searchKey] = data[props.searchKey].replace(
                        reg,
                        `<span class="${prefixCls}-key" ${
                            style.keyword ? `style="${style.keyword}"` : ''
                        }>${params.keyword}</span>`
                    )
                    temp[prefixIdx] = idx
                    params.list.push(temp)
                }
            })
        }

        const handleListItemClick = (data: any, evt?: any) => {
            emit('itemClick', data, evt)
            if (props.colseAfterItemClick) {
                params.show = false
                emit('close')
            }
        }

        const handleOnFocus = (evt: Event) => {
            params.focused = true
            params.show = true
            emit('focus', evt)
        }

        const handleOnBlur = (evt: Event) => {
            params.focused = false
            emit('blur', evt)
        }

        const handleOnInput = (evt: Event) => {
            params.keyword = (evt.target as HTMLInputElement).value
            params.list = []
            params.page.active = 1
            params.error = null
            if (params.keyword) {
                params.loading = true
                handleSearch()
            } else {
                params.list = params.datas ?? []
                params.loading = false
            }
            emit('update:value', params.keyword)
            emit('input', evt)
            emit('change', evt)
        }

        const handleOnKeydown = (evt: KeyboardEvent) => {
            if (evt.key === 'Enter') emit('pressEnter', evt)
            emit('keydown', evt)
        }

        const handleOnKeyup = (evt: KeyboardEvent) => {
            emit('keyup', evt)
        }

        const handleMaskClick = () => {
            params.show = false
            params.focused = false
            emit('close')
        }

        const handleSearchOnClickBtn = () => {
            if (params.keyword) {
                params.loading = true
                handleSearch()
            }
        }

        const style = {
            box: {
                width: props.width ? `${$tools.px2Rem(props.width)}rem` : null,
                height: props.height ? `${$tools.px2Rem(props.height)}rem` : null
            },
            input: {
                background: props.backgroundColor ?? null,
                borderRadius: props.radius ? `${$tools.px2Rem(props.radius)}rem` : null,
                borderColor: props.borderColor ?? null,
                color: props.textColor ?? null,
                boxShadow: props.boxShadow
                    ? `0 0 ${$tools.px2Rem(props.boxShadowBlur)}rem ${props.boxShadowColor}`
                    : null
            },
            keyword: props.searchKeyColor ? `color: ${props.searchKeyColor}` : null,
            page: { color: props.pageColor ?? null }
        }

        const suffix = getPropSlot(slots, props, 'suffix')
        const suffixTag = props.suffix ? (
            <div class={`${prefixCls}-suffix`} onClick={handleSearchOnClickBtn}>
                {isVNode(suffix) ? suffix : h(suffix)}
            </div>
        ) : null

        return () => (
            <>
                <div class={prefixCls} {...attrs} style={style.box}>
                    <input
                        class={`${prefixCls}-input${
                            props.suffix ? ` ${prefixCls}-has-suffix` : ''
                        }`}
                        name={prefixCls}
                        ref={prefixCls}
                        placeholder={props.placeholder ?? t('search.key')}
                        value={params.keyword}
                        onFocus={handleOnFocus}
                        onBlur={handleOnBlur}
                        onInput={handleOnInput}
                        onKeydown={handleOnKeydown}
                        onKeyup={handleOnKeyup}
                        style={style.input}
                    />
                    {suffixTag}
                    {renderList()}
                </div>
                { params.show ? (
                    <Teleport to="body">
                        <div
                            class={`${prefixCls}-mask`}
                            onClick={handleMaskClick}
                            key={$tools.uid(false, $g.prefix)}
                            style={{ display: params.show ? null : 'none' }}
                        />
                    </Teleport>
                ) : null}
            </>
        )
    }
})

MiSearch.Key = MiSearchKey
export default MiSearch as typeof MiSearch & {
    readonly Key: typeof MiSearchKey
}
