import { defineComponent, onMounted, ref } from 'vue'
import { ThemeProviderProps } from './props'
import { $g } from '../../utils/global'
import { $tools } from '../../utils/tools'

const MiThemeProvider = defineComponent({
    name: 'MiThemeProvider',
    inheritAttrs: false,
    props: ThemeProviderProps(),
    setup(props, { slots }) {
        const key = ref<string>($tools.uid(false, `${$g.prefix}theme-provider-scope-`))
        const id = `${$g.prefix}component-custom-provider-css-variables-${$tools.uid(false, '')}`
        const tokens = ref<string[]>([])
        const getCustomTokens = (data: Record<string, any>, name?: string) => {
            for (const key in data) {
                const index = `${name}-${key}`
                if (typeof data[key] === 'string') {
                    tokens.value.push(`--${index}: ${data[key]};`)
                } else if (typeof data[key] === 'object') {
                    getCustomTokens(data[key], index)
                }
            }
        }
        const prefix = $g.prefix
        getCustomTokens(
            props.tokens,
            prefix.charAt(prefix.length - 1) === '-'
                ? prefix.substring(0, prefix.length - 1)
                : prefix
        )

        onMounted(() =>
            $tools.createCssVariablesElement(tokens.value, id, true, true, `#${key.value}`)
        )

        return () => <div id={key.value}>{slots?.default()}</div>
    }
})

export default MiThemeProvider
