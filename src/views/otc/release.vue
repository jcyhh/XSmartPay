<template>
    <CusNav :title="$t('我的卡包')" :show-bg="false" :show-glass="false"></CusNav>

    <CusTab v-model="current" :list="tabs"></CusTab>

    <div class="pl30 pr30">
        <ReleaseBuy v-if="current==0"></ReleaseBuy>
        <ReleaseSale v-else></ReleaseSale>
    </div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTab from '@/components/CusTab/index.vue'
import { t } from '@/locale';
import { computed, ref } from 'vue';
import ReleaseBuy from './components/ReleaseBuy.vue';
import ReleaseSale from './components/ReleaseSale.vue';

const current = ref(0)

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
</script>

<style lang="scss" scoped>

</style>