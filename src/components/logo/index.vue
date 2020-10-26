<template>
    <div class="mi-layout-sider-logo">
        <router-link class="mi-layout-sider-logo-site" :to="{path: '/'}">
            <img :src="G.logo" :alt="G.title" v-if="G.logo" />
        </router-link>
    </div>
</template>