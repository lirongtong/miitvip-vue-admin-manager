import {
    SlotsType,
    defineComponent,
    isVNode,
    h,
    reactive,
    Teleport,
    Transition,
    type VNode,
    cloneVNode,
    Component
} from 'vue'
import { useI18n } from 'vue-i18n'
import { SearchProps } from './props'
import { getPropSlot, getPrefixCls } from '../_utils/props'
import { $tools } from '../../utils/tools'
import { $g } from '../../utils/global'
import { $request } from '../../utils/request'
import { SearchOutlined, FormOutlined, FrownOutlined } from '@ant-design/icons-vue'
import MiSearchKey from './Key'
import applyTheme from '../_utils/theme'
import styled from './style/search.module.less'

const MiSearch = defineComponent({
    name: 'MiSearch',
    inheritAttrs: false,
    props: SearchProps(),
    slots: Object as SlotsType<{
        default: any
        suffix: any
        itemTemplate: any
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
        const params = reactive({
            loading: false,
            keyword: '',
            show: false,
            focused: false,
            error: null,
            data: props?.data || [],
            list: props?.data || [],
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
            if (params.loading || !params.keyword) return
            const search = () => {
                params.loading = true
                if (props.searchAction) {
                    if (typeof props.searchAction === 'function') {
                        props.searchAction()
                    } else {
                        $request[(props.searchMethod || 'post').toLowerCase()](
                            props.searchAction,
                            props.searchParams
                        )
                            .then((res: any) => {
                                params.loading = false
                                if (res?.ret?.code === 200) {
                                    params.data = res?.data || []
                                } else {
                                    params.error = (
                                        <>
                                            <FrownOutlined />
                                            <p innerHTML={t('search.failed.message')} />
                                            <p
                                                innerHTML={t('search.failed.code') + res?.ret?.code}
                                            />
                                            <p
                                                innerHTML={
                                                    t('search.failed.reason') + res?.ret?.message
                                                }
                                            />
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
                                            <p innerHTML={t('search.failed.error')} />
                                            <p innerHTML={err.message} />
                                        </>
                                    )
                                }
                            })
                    }
                } else {
                    params.loading = false
                    renderResultList()
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

        const handleMaskClick = () => {
            params.show = false
            params.focused = false
            emit('close')
        }

        const handleFocus = (evt: Event) => {
            params.focused = true
            params.show = true
            emit('focus', evt)
        }

        const handleBlur = (evt: Event) => {
            params.focused = !(params.list.length >= 0) && !params.keyword
            params.show = params.focused || !!params.keyword
            emit('blur', evt)
        }

        const handleInput = (evt: Event) => {
            const keyword = (evt.target as HTMLInputElement).value
            params.list = []
            params.error = null
            if (keyword) handleSearch()
            else {
                params.loading = false
                params.list = params.data || []
            }
            params.keyword = keyword
            emit('update:value', keyword)
            emit('input', keyword, evt)
            emit('change', keyword, evt)
        }

        const handleKeydown = (evt: KeyboardEvent) => {
            if (evt.key.toLowerCase() === 'enter') {
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
            return (
                <MiSearchKey
                    name={name}
                    tag={tag}
                    type={type}
                    key={key}
                    data={name !== props.searchKey ? $tools.htmlEncode(item?.name) : item?.name}
                />
            )
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
                            children[i] = renderSearchKey(child, data)
                        } else children[i] = child
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
                            handleListItemClick(params.data[item[prefixIdx]] || item, evt)
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
                    <div class={styled.items} key={key}>
                        {res}
                    </div>
                </Transition>
            ) : null
        }

        const renderPagination = () => {}

        const renderList = () => {
            const style = {
                width: $tools.convert2rem($tools.distinguishSize(props.listWidth)),
                height: $tools.convert2rem($tools.distinguishSize(props.listHeight)),
                top: $tools.convert2rem($tools.distinguishSize(props.height ?? 34)),
                borderRadius: $tools.convert2rem($tools.distinguishSize(props.listRadius))
            }
            const elem = (
                <>
                    {/* no data */}
                    {params.list.length <= 0 && !params.loading && !params.error ? (
                        <div class={styled.noData}>
                            <FormOutlined />
                            <p innerHTML={props.listNoDataText || t('global.no-data')} />
                        </div>
                    ) : null}
                    {/* error */}
                    {params.error ? <div class={styled.error} innerHTML={params.error} /> : null}
                    {renderLoading()}
                    {renderResultList()}
                    {renderPagination()}
                </>
            )
            return (
                <Transition name={params.animation.list} appear={true}>
                    {params.show ? (
                        <div class={styled.list} style={style}>
                            {elem}
                        </div>
                    ) : null}
                </Transition>
            )
        }

        return () => (
            <>
                <div
                    class={`${styled.container}${
                        params.focused || params.keyword ? ` ${styled.focused}` : ''
                    }`}>
                    <input
                        class={styled.input}
                        name={prefixCls}
                        ref={prefixCls}
                        placeholder={props.placeholder || t('search.name')}
                        value={params.keyword}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onInput={$tools.debounce(handleInput, 200)}
                        onKeydown={handleKeydown}
                        onKeyup={handleKeyup}
                    />
                    {renderSuffix()}
                    {renderList()}
                </div>
                {params.show ? (
                    <Teleport to="body">
                        <div
                            class={styled.mask}
                            onClick={() => handleMaskClick()}
                            key={$tools.uid()}
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
