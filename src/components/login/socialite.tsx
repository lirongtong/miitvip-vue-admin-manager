import { defineComponent, reactive } from 'vue'
import { MoreOutlined } from '@ant-design/icons-vue'
import { getPrefixCls } from '../_utils/props-tools'
import { $g } from '../../utils/global'
import PropTypes from '../_utils/props-types'

export default defineComponent({
    name: 'MiLoginSocialte',
    props: {
        prefixCls: PropTypes.string,
        domain: PropTypes.string,
        items: PropTypes.array
    },
    setup(props) {
        const prefixCls = getPrefixCls('passport-socialite')
        const params = reactive({
            left: [],
            first: {}
        })

        const redirect = () => {}

        const parseItems = () => {
            const items = props.items ?? $g.socialites.items
            const list = []
            const temp = []
        }
        parseItems()

        return () => <div></div>
    }
})