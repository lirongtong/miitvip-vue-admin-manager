<template>
    <a-dropdown placement="bottomCenter" v-model:visible="visible">
        <div class="mi-layout-header-dropdown-title">
            <slot name="title">
                <a-avatar class="avatar" :src="G.avatar" :alt="G.powered" size="small"></a-avatar>
                <span class="name">{{ G.userInfo.nickname ?? G.author }}</span>
            </slot>
        </div>
        <template v-slot:overlay>
            <div class="mi-layout-header-dropdown-menu">
                <slot>
                    <a-menu theme="dark">
                        <a-menu-item
                            v-for="item in (items ?? G.menus.dropdown)"
                            :key="G.prefix + item.name">
                            <template v-if="item.path">
                                <router-link :to="{path: item.path}" v-if="!G.regExp.url.test(item.path)">
                                    <mi-layout-header-dropdown-item :item="item"></mi-layout-header-dropdown-item>
                                </router-link>
                                <a :href="item.path" target="_blank" v-else>
                                    <mi-layout-header-dropdown-item :item="item"></mi-layout-header-dropdown-item>
                                </a>
                            </template>
                            <template v-else>
                                <a @click="e => item.callback ? item.callback.call(this, e) : e.preventDefault()">
                                    <mi-layout-header-dropdown-item :item="item"></mi-layout-header-dropdown-item>
                                </a>
                            </template>
                        </a-menu-item>
                    </a-menu>
                </slot>
            </div>
        </template>
    </a-dropdown>
</template>

<script lang="ts">
    import { defineComponent, reactive, ref, createApp } from 'vue'
    import MiLayoutHeaderDropdownItem from './dropdown-item.vue'
    import { MenuItem } from '/@src/utils/config'

    export default defineComponent({
        components: { MiLayoutHeaderDropdownItem },
        props: {
            items: {
                type: Object,
                default: () => {}
            }
        },
        setup() {
            const menus: MenuItem[] = reactive([])
            const visible = ref(false)
            return { menus, visible }
        }
    })
</script>