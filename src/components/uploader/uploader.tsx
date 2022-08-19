import { defineComponent } from 'vue'
import { uploadProps } from './props'
import { getPrefixCls } from '../_utils/props-tools'
import { useI18n } from 'vue-i18n'
import { UploadOutlined } from '@ant-design/icons-vue'
import { $tools } from '../../utils/tools'

export default defineComponent({
    name: 'MiUploader',
    inheritAttrs: false,
    props: uploadProps(),
    setup(props) {
        const { t } = useI18n()
        const prefixCls = getPrefixCls('uploader', props.prefixCls)

        const renderSingleImage = () => {
            const cls = `${prefixCls}-image`
            return (
                <div
                    class={`${cls} single`}
                    style={{
                        width: props.width ? $tools.convert2Rem(props.width) : null,
                        height: props.height ? $tools.convert2Rem(props.height) : null
                    }}>
                    <input type="file" class={`${cls}-input`} multiple={false} />
                    <div class={`${cls}-icon`}>
                        <UploadOutlined />
                        <span innerHTML={t('upload.image')} />
                    </div>
                    <div class={`${cls}-preview`}></div>
                    <div class={`${cls}-progress`}>
                        <div class="progress">
                            <div class="wrapper">
                                <div class="left" />
                            </div>
                            <div class="wrapper">
                                <div class="right" />
                            </div>
                            <div class="mask"></div>
                        </div>
                    </div>
                    <div class={`${cls}-action`}></div>
                    <div class={`${cls}-error`}></div>
                </div>
            )
        }

        return () => <div class={prefixCls}>{renderSingleImage()}</div>
    }
})
