<template>
    <div class="mi-layout-sider-logo">
        <slot name="logo">
            <router-link class="mi-layout-sider-logo-site" :to="{path: '/'}">
                <img :src="G.logo" :alt="G.title" v-if="G.logo" />
                <MediumOutlined v-else />
                <h1 v-html="G.title" :title="G.title"></h1>
            </router-link>
        </slot>
    </div>
</template>