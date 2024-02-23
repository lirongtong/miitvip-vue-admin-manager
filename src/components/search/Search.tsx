import {
    SlotsType,
    defineComponent,
    isVNode,
    h,
    reactive,
    Teleport,
    Transition,
    type VNode
} from 'vue'
import { useI18n } from 'vue-i18n'
import { SearchProps } from './props'
import { getPropSlot, getPrefixCls } from '../_utils/props'
import { $tools } from '../../utils/tools'
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

        const renderDefaultResultList = (item: any) => {}

        const renderCustomResultList = (templates: VNode[], item: object) => {}

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
            const pushResultItem = (item: {}, elem: any) => {}
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
