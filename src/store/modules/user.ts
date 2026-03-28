import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {

    const isBindReferral = ref(false)

    const orders = ref<any[]>([])

    const list1Length = ref(0)

    return {
        isBindReferral,
        orders,
        list1Length
    }
})