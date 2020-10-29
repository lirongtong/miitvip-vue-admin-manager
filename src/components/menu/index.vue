<template>
    <a-menu
        ref="mi-menus"
        class="mi-layout-sider-menu"
        theme="dark"
        mode="inline"
        :force-sub-menu-render="true"
        @click="setActive"
        @openChange="setOpenKeys"
        :inline-collapsed="collapsed"
        v-model:openKeys="G.menus.opens"
        v-model:selectedKeys="G.menus.active">
        <slot name="menu">
            <template v-for="item in G.menus.items" :key="G.prefix + item.name">
                <mi-layout-menu
                    :item="item"
                    :key="G.prefix + item.name"
                    :top="collapsed"
                    v-if="item.children && item.children.length > 0">
                </mi-layout-menu>
                <mi-layout-menu-item
                    :item="item"
                    :key="G.prefix + item.name"
                    :top="collapsed"
                    v-else>
                </mi-layout-menu-item>
            </template>
        </slot>
    </a-menu>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from "vue";
import { useStore } from "vuex";
import MiLayoutMenu from "./menu.vue";
import MiLayoutMenuItem from "./item.vue";
import { mutations } from "/@src/store/types";
import { MenuItems } from "/@src/utils/config";

export default defineComponent({
    components: { MiLayoutMenu, MiLayoutMenuItem },
    props: {
        menuClassName: {
            type: String,
            default: "",
        },
    },
    setup() {
        const store = useStore();
        const menus: any = reactive({});
        const collapsed = computed(() => store.getters["layout/collapsed"]);
        return { store, collapsed, menus };
    },
    created() {
        const data = this.G.menus.items as MenuItems[];
        let allChildren: { [index: string]: any } = {};
        const getChildren = (item: MenuItems[]) => {
            for (let k = 0; k < item.length; k++) {
                allChildren[this.G.prefix + (item[k].name as string)] = true;
                const child = item[k].children;
                if (child && child.length > 0) getChildren(child);
            }
        };
        for (let i = 0; i < data.length; i++) {
            const name = this.G.prefix + (data[i].name as string);
            this.menus[name] = {};
            const children = data[i].children;
            if (children && children.length > 0) {
                getChildren(children);
                this.menus[name] = allChildren;
                allChildren = {};
            }
        }
    },
    methods: {
        setOpenKeys(openKeys: string[]): void {
            console.log(openKeys)
            let opens: (string | number)[] = [];
            if (openKeys.length > 0) {
                opens = openKeys;
                if (this.G.menus.accordion) {
                    const first = openKeys[0];
                    const last = openKeys[openKeys.length - 1];
                    if (this.menus[first] && !this.menus[first][last]) opens = [last];
                }
            }
            this.store.commit(`layout/${mutations.layout.opens}`, opens);
            this.G.menus.opens = opens;
        },
        setActive(item: any): void {
            if (item.keyPath && item.keyPath.length <= 1) {
                this.G.menus.opens = [];
                this.store.commit(`layout/${mutations.layout.opens}`, []);
            }
            this.store.commit(`layout/${mutations.layout.active}`, [item.key]);
        },
    },
});
</script>