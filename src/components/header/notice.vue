<template>
    <a-popover class="mi-layout-header-notice" placement="bottom" trigger="click">
        <div class="mi-layout-header-notice-icon">
            <slot name="title">
                <a-badge :count="1" dot><BellOutlined /></a-badge>
            </slot>
        </div>
        <template v-slot:content>
            <div class="mi-layout-header-notice-content">
                <slot name="content">
                    <a-tabs>
                        <a-tab-pane key="1">
                            <template v-slot:tab>
                                通知（1）
                            </template>
                            通知
                        </a-tab-pane>
                        <a-tab-pane key="2">
                            <template v-slot:tab>
                                待办（1）
                            </template>
                            待办
                        </a-tab-pane>
                    </a-tabs>
                </slot>
            </div>
        </template>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { install } from '/@src/_base/type'
    
    const MiLayoutHeaderNotice = defineComponent({
        name: 'MiLayoutHeaderNotice'
    })
    export default install(MiLayoutHeaderNotice)
</script>