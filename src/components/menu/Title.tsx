import { defineComponent } from 'vue'
import { MenuTitleProperties } from './props'
import { Row } from 'ant-design-vue'
import applyTheme from '../_utils/theme'
import styled from './style/title.module.less'

const MiMenuTitle = defineComponent({
    name: 'MiMenuTitle',
    inheritAttrs: false,
    props: MenuTitleProperties(),
    setup(props) {
        applyTheme(styled)

        const renderIcon = () => {}

        const renderTitle = () => {
            const title = props?.item?.meta?.title || null
            const subTitle = props?.item?.meta?.subTitle || null
            return props.showTitle ? (
                <Row class={styled.title}>
                    {title ? <span innerHTML={title}></span> : null}
                    {subTitle ? <span class={styled.titleSub} innerHTML={subTitle}></span> : null}
                </Row>
            ) : null
        }

        const renderTag = () => {}

        return () => (
            <>
                {renderIcon()}
                {renderTitle()}
                {renderTag()}
            </>
        )
    }
})

export default MiMenuTitle
