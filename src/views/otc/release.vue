<template>
    <CusNav :title="$t('发布委托')" :show-bg="false" :show-glass="false"></CusNav>

    <CusTab v-model="current" :list="tabs"></CusTab>

    <div class="pl30 pr30">
        <ReleaseBuy v-if="current==0" :picker-list="pickerList"></ReleaseBuy>
        <ReleaseSale v-else :picker-list="pickerList"></ReleaseSale>
    </div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTab from '@/components/CusTab/index.vue'
import { apiOtcAssets } from '@/api/otc';
import { t } from '@/locale';
import { computed, onMounted, ref } from 'vue';
import ReleaseBuy from './components/ReleaseBuy.vue';
import ReleaseSale from './components/ReleaseSale.vue';

interface OtcAsset {
    asset_code: string
    asset_name: string
    image?: string
    price?: number | string
    fee_rate?: number | string
    min_price?: number | string
    max_price?: number | string
    min_order_amount?: number | string
    max_order_amount?: number | string
}

const current = ref(0)
const pickerList = ref<any[]>([])

const tabs = computed(() => ([
    {
        name: t('挂买'),
        value: 1
    },
    {
        name: t('挂卖'),
        value: 0
    }
]))

const loadAssets = async () => {
    const res:any = await apiOtcAssets()
    const list:OtcAsset[] = Array.isArray(res) ? res : res?.list || []

    pickerList.value = list.map(item => ({
        name: item.asset_name,
        icon: item.image,
        value: item.asset_code,
        price: item.price,
        fee_rate: item.fee_rate,
        min_price: item.min_price,
        max_price: item.max_price,
        min_order_amount: item.min_order_amount,
        max_order_amount: item.max_order_amount
    }))
}

onMounted(() => {
    loadAssets()
})
</script>

<style lang="scss" scoped>

</style>