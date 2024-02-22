import { SlotsType, defineComponent, isVNode, h, reactive, Teleport, Transition } from 'vue'
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
            timer: null,
            data: props?.data || [],
            list: props?.data || [],
            animation: {
                list: getPrefixCls(`anim-${props.listAnimation}`),
                item: getPrefixCls(`anim-slide`)
            }
        })
        applyTheme(styled)

        const handleSearch = () => {
            if (params.loading || !params.keyword) return
            const search = () => {
                params.loading = true
                if (props.searchAction) {
                    if (typeof props.searchAction === 'function') {
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
            if (props.searchDelay) {
                if (params.timer) clearTimeout(params.timer)
                params.timer = setTimeout(() => search(), parseInt(props.searchDelay.toString()))
            } else search()
        }

        const handleMaskClick = () => {
            params.show = false
            params.focused = false
            console.log('close')
            emit('close')
        }

        const handleFocus = (evt: Event) => {
            params.focused = true
            params.show = true
            emit('focus', evt)
        }

        const handleBlur = (evt: Event) => {
            setTimeout(() => {
                params.focused = !(params.list.length >= 0) && !params.keyword
                emit('blur', evt)
            }, 0)
        }

        const handleInput = (evt: Event) => {
            const keyword = (evt.target as HTMLInputElement).value
            params.list = []
            params.error = null
            if (keyword) {
                params.loading = true
                handleSearch()
            } else {
                params.loading = false
                params.list = params.data || []
            }
            params.keyword = keyword
            emit('update:value', keyword)
            emit('input', keyword, evt)
            emit('change', keyword, evt)
        }

        const handleKeydown = (evt: KeyboardEvent) => {
            if (evt.key.toLowerCase() === 'enter') emit('pressEnter', evt)
            emit('keydown', evt)
        }

        const handleKeyup = (evt: KeyboardEvent) => {
            emit('keyup', evt)
        }

        const renderSuffix = () => {
            const suffix = getPropSlot(slots, props, 'suffix')
            return (
                <div class={styled.suffix} onClick={handleSearch}>
                    {props.suffix ? isVNode(suffix) ? suffix : h(suffix) : <SearchOutlined />}
                </div>
            )
        }

        const renderLoading = () => {}
        const renderResultList = () => {}
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
                    }`}
                    style={{ zIndex: Date.now() }}>
                    <input
                        class={styled.input}
                        name={prefixCls}
                        ref={prefixCls}
                        placeholder={props.placeholder || t('search.name')}
                        value={params.keyword}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onInput={handleInput}
                        onKeydown={handleKeydown}
                        onKeyup={handleKeyup}
                    />
                    {renderSuffix()}
                    {renderList()}
                </div>
                {params.show ? (
                    <Teleport to="body">
                        <div class={styled.mask} onClick={handleMaskClick} key={$tools.uid()} />
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
