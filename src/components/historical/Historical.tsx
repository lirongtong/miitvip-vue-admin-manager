import { defineComponent, ref, onMounted, computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useHistoricalStore } from '../../stores/historical'
import { type HistoricalRouting } from './props'
import { Tooltip } from 'ant-design-vue'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import applyTheme from '../_utils/theme'
import styled from './style/historical.module.less'

const MiHistoricalRouting = defineComponent({
    name: 'MiHistoricalRouting',
    inheritAttrs: false,
    setup() {
        const { t } = useI18n()
        const route = useRoute()
        const historicalStore = useHistoricalStore()
        const routes = computed(() => historicalStore.routes)
        const params = reactive({
            current: null,
            active: null
        })
        const itemsRef = ref(null)
        const containerRef = ref(null)

        applyTheme(styled)

        const handleInitHistoricalRouting = (collect = true) => {
            if (collect) handleCollectHistoricalRouting()
        }

        const handleCollectHistoricalRouting = () => {
            params.current = route.name
            if (params.current && !routes.value?.[params.current]) {
                const temp = { ...routes.value }
                temp[params.current] = {
                    name: params.current,
                    title: route.meta?.title || params.current,
                    path: route.path
                } as HistoricalRouting
                params.active = temp?.[params.current]
                historicalStore.setRoutes(temp)
            }
        }

        const handlePrevRoutes = () => {}

        const handleNextRoutes = () => {}

        const handleWindowResize = () => {}

        const renderButton = (handler: (...args: any) => any, type = 'prev') => {
            const icon = (
                <Tooltip title={type === 'prev' ? t('global.page.prev') : t('global.page.next')}>
                    {type === 'prev' ? <LeftOutlined /> : <RightOutlined />}
                </Tooltip>
            )
        }

        const renderItems = () => {
            return <div ref={itemsRef}></div>
        }

        const renderDropdown = () => {}

        onMounted(() => {
            handleInitHistoricalRouting()
        })

        return () => (
            <div ref={containerRef} class={styled.container}>
                {renderButton(handlePrevRoutes)}
                {renderItems()}
                {renderButton(handleNextRoutes, 'next')}
                {renderDropdown()}
            </div>
        )
    }
})

export default MiHistoricalRouting
