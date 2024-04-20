import {
    SlotsType,
    defineComponent,
    isVNode,
    h,
    reactive,
    Transition,
    type VNode,
    cloneVNode,
    Component,
    onMounted,
    onUnmounted,
    nextTick,
    computed,
    type VNodeTypes
} from 'vue'
import { useI18n } from 'vue-i18n'
import { SearchProps } from './props'
import { getPropSlot, getPrefixCls } from '../_utils/props'
import { $tools } from '../../utils/tools'
import { $g } from '../../utils/global'
import { useWindowResize } from '../../hooks/useWindowResize'
import type { SearchData } from '../../utils/types'
import { $request } from '../../utils/request'
import {
    SearchOutlined,
    FormOutlined,
    FrownOutlined,
    LeftCircleOutlined,
    RightCircleOutlined
} from '@ant-design/icons-vue'
import MiSearchKey from './Key'
import applyTheme from '../_utils/theme'
import styled from './style/search.module.less'

const MiSearch = defineComponent({
    name: 'MiSearch',
    inheritAttrs: false,
    props: SearchProps(),
    slots: Object as SlotsType<{
        default: VNodeTypes
        suffix: VNodeTypes
        itemTemplate: VNodeTypes
    }>,
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
    setup(props, { slots, emit }) {
        const { t } = useI18n()
        const prefixCls = getPrefixCls('search')
        const prefixIdx = getPrefixCls('index')
        const { width } = useWindowResize()
        const size = computed(() => {
            return {
                width: $tools.distinguishSize(props.width, width.value),
                height: $tools.distinguishSize(props.height, width.value)
            }
        })
        const sizeStyle = computed(() => {
            return {
                width: $tools.convert2rem(size.value.width),
                height: $tools.convert2rem(size.value.height),
                borderRadius: $tools.convert2rem($tools.distinguishSize(props.radius, width.value))
            }
        })
        const listStyle = computed(() => {
            return {
                width: $tools.convert2rem($tools.distinguishSize(props.listWidth, width.value)),
                height: $tools.convert2rem($tools.distinguishSize(props.listHeight, width.value)),
                top: $tools.convert2rem($tools.distinguishSize(props.height ?? 34, width.value)),
                borderRadius: $tools.convert2rem(
                    $tools.distinguishSize(props.listRadius, width.value)
                )
            }
        })
        const params = reactive({
            id: $tools.uid(),
            loading: false,
            keyword: '',
            show: false,
            focused: false,
            error: null,
            data: (props?.data || []) as SearchData[],
            list: (props?.data || []) as SearchData[],
            animation: {
                list: getPrefixCls(`anim-${props.listAnimation}`),
                item: getPrefixCls(`anim-slide`)
            },
            delayTimer: null,
            page: {
                total: 0,
                active: 1
            }
        })
        applyTheme(styled)

        const handleSearch = (evt?: Event) => {
            if (evt) evt.preventDefault()
            const search = async () => {
                if (props.searchAction) {
                    if (typeof props.searchAction === 'function') {
                        const res = await props.searchAction(params.keyword)
                        params.data = Array.isArray(res) ? res : []
                        renderSearchResult()
                        params.loading = false
                    } else {
                        $request[(props.searchMethod || 'post').toLowerCase()](
                            props.searchAction,
                            props.searchParams
                        )
                            .then((res: any) => {
                                if (res?.ret?.code === 200) {
                                    params.data = res?.data || []
                                    renderSearchResult()
                                } else {
                                    params.error = (
                                        <>
                                            <FrownOutlined />
                                            <p innerHTML={t('search.failed.message')} />
                                            <p>{t('search.failed.code') + res?.ret?.code}</p>
                                            <p>{t('search.failed.reason') + res?.ret?.message}</p>
                                        </>
                                    )
                                }
                            })
                            .catch((err: any) => {
                                params.error = (
                                    <>
                                        <FrownOutlined />
                                        <p innerHTML={t('search.failed.error')} />
                                        {err?.message ? <p innerHTML={err.message} /> : null}
                                    </>
                                )
                            })
                            .finally(() => (params.loading = false))
                    }
                } else {
                    params.loading = false
                    renderSearchResult()
                }
            }
            if (!$tools.isEmpty(props.searchDelay)) {
                if (params.delayTimer) clearTimeout(params.delayTimer)
                params.delayTimer = setTimeout(
                    () => search(),
                    parseInt(props.searchDelay.toString())
                )
            } else search()
        }

        const handleFocus = (evt: Event) => {
            params.focused = true
            params.show = true
            emit('focus', evt)
        }

        const handleInput = (evt: Event) => {
            const keyword = (evt.target as HTMLInputElement).value
            params.list = []
            params.page.active = 1
            params.error = null
            params.keyword = keyword
            if (keyword) {
                params.loading = true
                handleSearch()
            } else {
                params.loading = false
                params.list = props.searchAction ? [] : params.data || []
            }
            emit('update:value', keyword)
            emit('input', keyword, evt)
            emit('change', keyword, evt)
        }

        const handleKeydown = (evt: KeyboardEvent) => {
            if (evt.key.toLowerCase() === 'enter') {
                params.list = []
                handleSearch()
                emit('pressEnter', evt)
            }
            emit('keydown', evt)
        }

        const handleKeyup = (evt: KeyboardEvent) => {
            emit('keyup', evt)
        }

        const handleListItemClick = (data: any, evt?: any) => {
            emit('itemClick', data, evt)
        }

        const handlePaginationInput = (evt: Event) => {
            const value = parseInt((evt?.target as HTMLInputElement).value)
            if (value) params.page.active = value
            else params.page.active = 1
            if (value > params.page.total) params.page.active = params.page.total
        }

        const handlePaginationBlur = (evt: Event) => {
            handlePaginationInput(evt)
        }

        const handlePaginationKeydown = (evt: KeyboardEvent) => {
            if (evt.key.toLowerCase() === 'enter') handlePaginationInput(evt)
        }

        const handlePaginationPrev = () => {
            if (params.page.active > 1) params.page.active--
        }

        const handlePaginationNext = () => {
            const next = params.page.active + 1
            if (next <= params.page.total) params.page.active = next
        }

        const renderSuffix = () => {
            const suffix = getPropSlot(slots, props, 'suffix')
            return (
                <div class={styled.suffix} onMousedown={handleSearch}>
                    {props.suffix ? isVNode(suffix) ? suffix : h(suffix) : <SearchOutlined />}
                </div>
            )
        }

        const renderLoading = () => {
            return params.loading ? (
                <div class={styled.loading}>
                    <div class={styled.loadingSpinner}>
                        <div class={styled.loadingAnim}>
                            <div>
                                <div>
                                    <div />
                                    <div />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class={styled.loadingText} innerHTML={t('search.searching')} />
                </div>
            ) : null
        }

        const renderSearchKey = (node: VNode, item: any) => {
            const nodeProps = node?.props as any
            const tag = nodeProps?.tag
            const name = nodeProps?.name
            const type = nodeProps?.type
            const key = $tools.uid()
            const content = nodeProps?.content || item?.[name] || item?.title
            return <MiSearchKey name={name} tag={tag} type={type} key={key} content={content} />
        }

        const renderDefaultResultList = (item: any) => {
            const avatar = item?.avatar ? (
                <div class={styled.itemAvatar}>
                    <img src={item.avatar} alt={item?.name ?? $g.prowered} />
                </div>
            ) : null
            let icon: any = null
            if (item?.icon) {
                const IconTag = isVNode(item.icon) ? item.icon : h(item.icon)
                icon = <IconTag />
            }
            const info = (
                <div class={styled.itemInfo}>
                    <div class={styled.itemInfoTitle} innerHTML={item[props.searchKey]} />
                    <div class={styled.itemInfoSummary} innerHTML={item?.summary || null} />
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
            const elems: any[] = []
            ;(templates || []).forEach((template: VNode) => {
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

        const renderCustomResultListItem = (node: VNode | any, item: object) => {
            if (node?.children?.length > 0) {
                const data = { ...item }
                const children: any[] = []
                for (let i = 0, l = node.children.length; i < l; i++) {
                    const cur = node.children[i]
                    if (isVNode(cur)) {
                        let child = cloneVNode(cur)
                        if ((child?.type as Component).name === MiSearchKey.name) {
                            children[i] = renderSearchKey(child, item)
                        } else children[i] = child
                        child = renderCustomResultListItem(child, data)
                    }
                }
                node.children = children
            }
            return node
        }

        const renderResultList = () => {
            const res: any[] = []
            const template = getPropSlot(slots, props, 'itemTemplate')
            let min = 0
            let max = 0
            if (props.pagination) {
                min = (params.page.active - 1) * $tools.distinguishSize(props.pageSize)
                max = params.page.active * $tools.distinguishSize(props.pageSize)
            }
            const key = getPrefixCls(`item-${min}-${max}`)
            const pushResultItem = (item: {}, elem: any) => {
                res.push(
                    <div
                        class={styled.item}
                        onClick={(evt: Event) =>
                            handleListItemClick(params.data[item[prefixIdx]] ?? item, evt)
                        }>
                        {elem}
                    </div>
                )
            }
            if (template) {
                const templates = isVNode(template) ? [template] : template
                params.list?.forEach((item: {}, idx: number) => {
                    let elems: any[] = []
                    if (props.pagination) {
                        if (idx >= min && idx < max) elems = renderCustomResultList(templates, item)
                    } else elems = renderCustomResultList(templates, item)
                    if (elems.length > 0) pushResultItem(item, elems)
                })
            } else {
                params.list?.forEach((item: {}, idx: number) => {
                    let elem: any = null
                    if (props.pagination) {
                        if (idx >= min && idx < max) elem = renderDefaultResultList(item)
                    } else elem = renderDefaultResultList(item)
                    if (elem) pushResultItem(item, elem)
                })
            }
            return res.length > 0 ? (
                <Transition name={params.animation.item} appear={true}>
                    <div
                        class={`${styled.items}${
                            props.pagination ? ` ${styled.itemsPagination}` : ''
                        }`}
                        key={key}>
                        {res}
                    </div>
                </Transition>
            ) : null
        }

        const renderSearchResult = () => {
            const reg = new RegExp(params.keyword, 'ig')
            params.list = []
            ;(params.data || []).forEach((data: SearchData, idx: number) => {
                if (data[props.searchKey] && reg.test(data[props.searchKey])) {
                    const temp = { ...data }
                    temp[props.searchKey] = data[props.searchKey].replace(
                        reg,
                        `<span class="${styled.searchKey}">${params.keyword}</span>`
                    )
                    temp[prefixIdx] = idx
                    params.list.push(temp)
                }
            })
        }

        const renderPagination = () => {
            const len = params.list.length
            if (props.pagination && !params.error && !params.loading && len > 0) {
                const total = Math.ceil(len / ($tools.distinguishSize(props.pageSize) || 10))
                params.page.total = total
                return (
                    <div class={styled.pagination}>
                        <div class={styled.paginationPage}>
                            <span
                                class={`${styled.paginationPrev}${
                                    params.page.active <= 1 ? ' disabled' : ''
                                }`}
                                title={t('pagination.prev')}
                                onClick={handlePaginationPrev}>
                                <LeftCircleOutlined />
                            </span>
                            {t('pagination.prefix')}
                            <input
                                min={1}
                                max={total}
                                type="number"
                                value={params.page.active}
                                onInput={handlePaginationInput}
                                onBlur={handlePaginationBlur}
                                onKeydown={handlePaginationKeydown}
                            />{' '}
                            / {total} {t('pagination.unit')}
                            <span
                                class={`${styled.paginationNext}${
                                    params.page.active >= params.page.total ? ' disabled' : ''
                                }`}
                                title={t('pagination.next')}
                                onClick={handlePaginationNext}>
                                <RightCircleOutlined />
                            </span>
                        </div>
                        <div class={styled.paginationTotal}>
                            {t('pagination.total')}
                            <span innerHTML={len} />
                            {t('pagination.strip')}
                        </div>
                    </div>
                )
            }
        }

        const renderList = () => {
            const elem = (
                <>
                    {params.list.length <= 0 && !params.loading && !params.error ? (
                        <div class={styled.noData}>
                            <FormOutlined />
                            <p innerHTML={props.listNoDataText || t('global.no-data')} />
                        </div>
                    ) : null}
                    {params.error ? (
                        <div class={styled.error}>
                            <div class={styled.errorInner}>{params.error}</div>
                        </div>
                    ) : null}
                    {renderLoading()}
                    {renderResultList()}
                    {renderPagination()}
                </>
            )
            return (
                <Transition name={params.animation.list} appear={true}>
                    {params.show ? (
                        <div class={styled.list} style={listStyle.value}>
                            {elem}
                        </div>
                    ) : null}
                </Transition>
            )
        }

        const handleClose = (evt: any) => {
            nextTick().then(() => {
                if (params.show) {
                    const target = evt?.target
                    const elem = document.getElementById(params.id)
                    if (elem && target !== elem && !elem.contains(target)) {
                        params.focused = false
                        params.show = false
                        emit('close')
                        if (evt.preventDefault) evt.preventDefault()
                    }
                }
            })
        }

        onMounted(() => $tools.on(window, 'click', (evt) => handleClose(evt)))
        onUnmounted(() => $tools.off(window, 'click', (evt) => handleClose(evt)))

        return () => (
            <div
                class={`${styled.container}${
                    params.focused || params.keyword ? ` ${styled.focused}` : ''
                }${size.value.width ? ` ${styled.customWidth}` : ''}`}
                id={params.id}>
                <input
                    class={styled.input}
                    name={prefixCls}
                    ref={prefixCls}
                    placeholder={props.placeholder || t('search.name')}
                    value={params.keyword}
                    autoComplete="off"
                    onFocus={handleFocus}
                    onInput={$tools.debounce(handleInput, 200)}
                    onKeydown={handleKeydown}
                    onKeyup={handleKeyup}
                    style={sizeStyle.value}
                />
                {renderSuffix()}
                {renderList()}
            </div>
        )
    }
})

MiSearch.Key = MiSearchKey

export default MiSearch as typeof MiSearch & {
    readonly Key: typeof MiSearchKey
}
