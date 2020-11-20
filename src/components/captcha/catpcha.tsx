import { defineComponent } from 'vue'
import PropTypes from '../../utils/props'

export default defineComponent({
    name: 'MiCaptcha',
    props: {
        width: PropTypes.number,
        height: PropTypes.number,
        radius: PropTypes.number,
        themeColor: PropTypes.string,
        logo: PropTypes.string,
        text: PropTypes.string,
        background: PropTypes.string,
        image: PropTypes.string,
        getImageAction: PropTypes.string,
        maxTries: PropTypes.number,
        initAction: PropTypes.string,
        verifyAction: PropTypes.string
    },
    methods: {
        getPrefixCls() {
            return this.$tools.getPrefixCls('captcha')
        },
        getRadarElem() {
            
        }
    },
    render() {
        const prefixCls = this.getPrefixCls()
        const cls = `${prefixCls}${this.$g.mobile ? ` ${prefixCls}-mobile` : ''}`
        return (
            <div class={cls}>
                <div class={`${prefixCls}-form`}></div>
                <div class={`${prefixCls}-radar`}>
                    { () => this.getRadarElem() }
                </div>
            </div>
        )
    }
})