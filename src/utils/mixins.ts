import axios from 'axios'

let _created = false
let _mounted = false

export default {
    created() {
        if (!_created) {
            
            _created = true
        }
    },
    mounted() {

    }
}