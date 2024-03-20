import { defineComponent, reactive, isVNode, h } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    MoreOutlined,
    GithubOutlined,
    WeiboCircleOutlined,
    QqOutlined,
    GoogleOutlined
} from '@ant-design/icons-vue'
import { $g, __MI_SOCIALITE_DOMAIN__ } from '../../utils/global'
import { LoginSocialiteProps } from './props'
import { useWindowResize } from '../../hooks/useWindowResize'
import type { DropdownItem } from '../../utils/types'
import MiDropdown from '../dropdown/Dropdown'
import MiLink from '../link/Link'
import applyTheme from '../_utils/theme'
import styled from './style/socialite.module.less'

const MiLoginSocialite = defineComponent({
    name: 'MiLoginSocialite',
    inheritAttrs: false,
    props: LoginSocialiteProps(),
    setup(props) {
        const { t } = useI18n()
        const { width } = useWindowResize()
        const params = reactive({
            remain: [] as DropdownItem[],
            first: {} as DropdownItem
        })
        applyTheme(styled)

        const redirect = (url: string) => {
            const domain = props.domain ?? __MI_SOCIALITE_DOMAIN__
            const link = `${domain}/${url}`
            window.open(link, '_self')
        }

        const parseItems = () => {
            const data = (
                (props.items || []).length > 0
                    ? props.items
                    : [
                          { name: 'github', icon: GithubOutlined },
                          { name: 'weibo', icon: WeiboCircleOutlined },
                          { name: 'qq', icon: QqOutlined },
                          { name: 'google', icon: GoogleOutlined }
                      ]
            ) as DropdownItem[]
            const items: DropdownItem[] = []
            ;(data || []).forEach((item: DropdownItem, idx: number) => {
                item.callback = item.callback ?? (() => redirect(item.name))
                if (idx === 0) params.first = item
                else items.push(item)
            })
            params.remain = items
        }
        parseItems()

        return () => {
            if (width.value < $g.breakpoints.md) {
                const items: DropdownItem[] = [{ ...params.first }].concat(params.remain)
                const icons: any[] = []
                ;(items || []).forEach((item: DropdownItem) => {
                    icons.push(
                        <MiLink
                            onClick={(evt?: any) => (item.callback ? item.callback(evt) : null)}>
                            <MiDropdown.Item item={item} />
                        </MiLink>
                    )
                })
                return (
                    <div class={styled.mobile}>
                        <div class={styled.mobileLine} />
                        <div class={styled.mobileTitle} innerHTML={t('login.socialite')} />
                        <div class={styled.mobileCates}>{...icons}</div>
                    </div>
                )
            } else {
                const hasCallback =
                    params.first?.callback && typeof params.first?.callback === 'function'
                return (
                    <div class={styled.container}>
                        {props.tip || t('login.socialite')}
                        <div
                            onClick={(evt?: any) =>
                                hasCallback ? params.first.callback(evt) : null
                            }
                            class={styled.first}>
                            {params.first && params.first?.icon ? (
                                isVNode(params.first.icon) ? (
                                    params.first.icon
                                ) : (
                                    h(params.first.icon)
                                )
                            ) : (
                                <GithubOutlined />
                            )}
                        </div>
                        <MiDropdown title={<MoreOutlined />} items={params.remain} />
                    </div>
                )
            }
        }
    }
})

export default MiLoginSocialite
