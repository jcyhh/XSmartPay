import { apiCardConfig } from '@/api/card'
import { apiUserInfo } from '@/api/user'
import { computedSub } from '@/utils'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {

    const userInfo = ref()

    const loadUserInfo = async () => userInfo.value = await apiUserInfo()

    const card_usdt_pay_rate = ref(0)
    const card_aix_pay_rate = computed(()=>computedSub(100, card_usdt_pay_rate.value))

    const loadCardConfig = async () => {
        const res:any = await apiCardConfig()
        card_usdt_pay_rate.value = res.card_usdt_pay_rate
    }

    return {
        userInfo,
        loadUserInfo,
        card_usdt_pay_rate,
        card_aix_pay_rate,
        loadCardConfig
    }
})