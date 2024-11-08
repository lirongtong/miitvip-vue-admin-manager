<template>
    <mi-theme>
        <mi-layout />
    </mi-theme>
</template>

<script lang="ts" setup>
import { useStoreMenu, useStoreSearch } from '../../src/index'
import { searchData } from '../assets/data/search'
import { menusData } from '../assets/data/menus'

const menuStore = useStoreMenu()
menuStore.updateMenus(menusData)

const searchStore = useStoreSearch()
searchStore.updateData(searchData)
</script>