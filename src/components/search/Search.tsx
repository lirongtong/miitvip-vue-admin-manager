import { SlotsType, defineComponent, isVNode, h, reactive, Teleport } from 'vue'
import { useI18n } from 'vue-i18n'
import { SearchProps } from './props'
import { getPropSlot, getPrefixCls } from '../_utils/props'
import { $tools } from '../../utils/tools'
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
            data: props?.data || [],
            list: props?.data || []
        })
        applyTheme(styled)

        const handleSearch = () => {}
        const handleMaskClick = () => {}

        const handleFocus = (evt: Event) => {
            params.focused = true
            params.show = true
            console.log(333)
            emit('focus', evt)
        }

        const handleBlur = (evt: Event) => {
            params.focused = false
            emit('blur', evt)
        }

        const handleInput = (evt: Event) => {
            const keyword = (evt.target as HTMLInputElement).value
            params.list = []
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
            return props.suffix ? (
                <div class={styled.suffix} onClick={handleSearch}>
                    {isVNode(suffix) ? suffix : h(suffix)}
                </div>
            ) : null
        }

        const renderList = () => {}

        return () => (
            <>
                <div class={styled.container}>
                    <input
                        class={styled.input}
                        name={prefixCls}
                        ref={prefixCls}
                        placeholder={props.placeholder ?? t('search.placeholder')}
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
                        <div
                            class={styled.mask}
                            onClick={() => handleMaskClick()}
                            key={$tools.uid()}></div>
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
