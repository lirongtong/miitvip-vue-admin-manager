<template>
    <a-card class="mi-card-tab mi-card-body-custom" :tab-list="tabs.list">
        <div v-if="tabs.active === 'effect'">
            <mi-code language="js" :content="js" />
        </div>
        <div v-if="tabs.active === 'template'">2</div>
    </a-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const js = `import { createApp } from 'vue'
import MakeitAdminPro from 'makeit-admin-pro'
import 'makeit-admin-pro/dist/miitvip.min.css'

const app = createApp(App)
app.use(router)
app.use(createStore({}))
app.use(MakeitAdminPro)
app.mount('#app')`

const tabs = reactive({
    list: [{
        key: 'effect',
        tab: '实时效果'
    }, {
        key: 'template',
        tab: '模版示例'
    }, {
        key: 'variables',
        tab: '封装参数'
    }],
    active: 'effect'
})
</script>