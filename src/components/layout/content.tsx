import { defineComponent, withDirectives, vShow, VNode, Transition } from 'vue'
import { RouterView } from 'vue-router'
import { Layout } from 'ant-design-vue'
import PropTypes from '../../utils/props'
import MiBreadcrumb from './breadcrumb'
import MiRouteHistory from '../history'

export default defineComponent({
    name: 'MiContent',
    props: {
        animation: PropTypes.bool.def(true),
        animationName: PropTypes.string,
        animationDuration: PropTypes.number.def(.2)
    },
    data() {
        return {
            transition: 'slider-right',
            visible: true,
            timer: null
        }
    },
    created() {
        if (!this.$route) this.$tools.importError('vue-router')
        if (this.animationName) this.transition = this.animationName
    },
    mounted() {
        if (this.animation) {
            this.$router.beforeEach((_to, _from, next: any) => {
                this.transition = this.animationName ?? 'slider-left'
                this.visible = false
                if (this.timer) clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.transition = this.animationName ?? 'slider-right'
                    this.visible = true
                    next()
                }, this.animationDuration
                    ? (this.animationDuration * 1000 + 60)
                    : 260
                )
            })
        }
    },
    render() {
        const style = {transition: `all ${this.animationDuration}s ease`}
        const content = this.animation ? (
            <Transition name={`mi-${this.transition}`} appear>
                { withDirectives((
                    <div class="mi-layout-custom-content" style={style}>
                        <RouterView></RouterView>
                    </div>
                ) as VNode, [[vShow, this.visible]]) }
            </Transition>
        ) : (
            <div class="mi-layout-custom-content">
                <RouterView></RouterView>
            </div>
        )
        return (
            <Layout.Content class="mi-layout-content">
                <MiBreadcrumb></MiBreadcrumb>
                <MiRouteHistory></MiRouteHistory>
                { content }
            </Layout.Content>
        )
    }
})