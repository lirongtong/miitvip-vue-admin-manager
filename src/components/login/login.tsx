import { defineComponent } from 'vue'
import { passportProps } from '../_utils/props-passport'

const Login = defineComponent({
    name: 'MiLogin',
    inheritAttrs: false,
    props: passportProps(),
    setup() {
        return () => {
            return (<div></div>)
        }
    }
})

export default Login