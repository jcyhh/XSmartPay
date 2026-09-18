<template>
    <CusNav :title="$t('提现记录')" :show-bg="false" :show-glass="false"></CusNav>

    <CusTab v-model="current" :list="tabs"></CusTab>

    <van-pull-refresh class="page rel" v-bind="props">
        <van-list class="page" v-bind="listProps">
            <div class="pl30 pr30">
        
                <div class="cell card mb20" v-for="(item, index) in list" :key="index">
                    <div class="flex size28 bold">
                        <div v-init:address="item.address"></div>
                        <div class="">
                            <span v-if="current==0" v-init="item.amount"></span>
                            <span class="green" v-else-if="current==1" v-init="item.amount"></span>
                            <span class="red" v-else v-init="item.amount"></span>
                        </div>
                    </div>
                    <div class="flex jb ac opc6 size24 mt20">
                        <div>{{ item.created_at }}</div>
                        <div>
                            <span>{{ currencyNames[item.ccy] || item.ccy }}</span>
                        </div>
                    </div>
                </div>

                <CusEmpty v-if="list?.length==0"></CusEmpty>

            </div>
        </van-list>
    </van-pull-refresh>
    
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTab from '@/components/CusTab/index.vue'
import { assetAIX, assetAXE, assetNFTC, assetUSDT } from '@/config';
import { t } from '@/locale';
import { computed, ref, watch } from 'vue';
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'

const current = ref(0)

const currencyNames: Record<string, string> = {
    balance_usdt: assetUSDT,
    balance_aix: assetAIX,
    balance_nftc: assetNFTC,
    balance_axe: assetAXE,
}

const tabs = computed(()=>([
    {name: t('审核中'),value: 1},
    {name: t('通过'),value: 2},
    {name: t('驳回'),value: 3}
]))

const params = computed(()=>({apply_status: tabs.value[current.value].value}))
const { list, props: listProps, loadList } = useLoadList('/api/withdraws', 'withdraws', params)
const { props } = usePullRefresh(loadList)

watch(current, () => loadList(), {immediate:true})
</script>

<style lang="scss" scoped>
.card{
    padding: 30px;
    border-radius: 20px;
    &::before{
        border-radius: 20px;
    }
}
.cardimg{
    width: 280px;
    height: 168px;
}
.price{
    display: inline-block;
    background: linear-gradient(281.88deg, #FFF1BF 24.66%, #FFF1BF 37.09%, #FFCD48 39.28%, #FFF1BF 59.99%, #FFCD48 64.38%, #FFF1BF 75.34%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}
.line{
    width: 100%;
    height: 1px;
    background-color: #FFFFFF1F;
}
.page{
    width: 100vw;
    min-height: calc(100vh - 200px);
    min-height: calc(100dvh - 200px);
}
</style>
