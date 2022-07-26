<template>
    <mi-code language="js" :content="js" />
    <mi-code language="html" :content="html" />
</template>

<script setup>
const js = `import { createApp } from 'vue'
import MakeitAdminPro from 'makeit-admin-pro'
import 'makeit-admin-pro/dist/miitvip.min.css'

const app = createApp(App)
app.use(router)
app.use(createStore({}))
app.use(MakeitAdminPro)
app.mount('#app')`
const html = `<div class="html">Html Example</div>`
</script>