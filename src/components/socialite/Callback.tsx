import { defineComponent, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../utils/api'
import { $tools } from '../../utils/tools'
import { $request } from '../../utils/request'
import { $cookie } from '../../utils/cookie'
import { $storage } from '../../utils/storage'
import { SocialiteCallbakProps } from './props'
import { type ResponseData } from '../../utils/types'
import { message } from 'ant-design-vue'
import applyTheme from '../_utils/theme'
import styled from './style/callback.module.less'

const MiSocialiteCallback = defineComponent({
    name: `MiSocialiteCallback`,
    inheritAttrs: false,
    props: SocialiteCallbakProps(),
    setup(props) {
        applyTheme(styled)
        const { t } = useI18n()
        const route = useRoute()
        const router = useRouter()
        onMounted(() => {
            const { socialite, token } = route.params
            if (socialite && token) {
                $request
                    .post(
                        $tools.replaceUrlParams(props?.link || api?.oauth?.authorize, {
                            socialite
                        }),
                        {
                            token
                        }
                    )
                    .then((res: ResponseData) => {
                        if (res?.ret?.code === 200) {
                            const tokens = res?.data?.tokens
                            if (tokens?.access_token) {
                                $cookie.set(
                                    'access-token',
                                    tokens?.access_token,
                                    tokens?.expires_in
                                )
                                $cookie.set('refresh-token', tokens?.refresh_token)
                                if (res?.data?.user) $storage.set('user-info', res?.data?.user)
                                router.push({ path: '/' })
                            }
                        } else {
                            router.push({ path: '/login' })
                            message.error({ content: res?.ret?.message || t(`login.auth-failed`) })
                        }
                    })
                    .catch((err?: any) => {
                        router.push({ path: '/login' })
                        if (err?.message) message.error(err?.message)
                    })
            }
        })

        return () => (
            <div class={styled.container}>
                <div class={styled.inner}>
                    <div class={styled.lines}></div>
                </div>
                <div innerHTML={t(`login.auth`)}></div>
            </div>
        )
    }
})

export default MiSocialiteCallback
