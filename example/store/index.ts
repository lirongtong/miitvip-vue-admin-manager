import { createStore } from 'vuex'

export default createStore({
    strict: process.env.NODE_ENV !== 'production'
})