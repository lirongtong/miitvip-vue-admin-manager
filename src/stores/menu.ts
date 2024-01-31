import { defineStore } from 'pinia'

const useMenuStore = defineStore('menus', {
    state: () => ({
        menus: []
    })
})

export default useMenuStore
