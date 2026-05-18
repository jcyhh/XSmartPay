<template>
    <CusNav :title="$t('资产明细')" :show-bg="false" :show-glass="false"></CusNav>

    <CusTabScroll v-model="current" :list="tabs"></CusTabScroll>

    <van-pull-refresh class="page rel" v-bind="props">
        <van-list class="page" v-bind="listProps">
            <div class="pl30 pr30">
        
                <div class="cell card mb20" v-for="(item, index) in list" :key="index">
                    <div class="flex jb ac">
                        <div class="size28">{{ item.content }}</div>
                        <div class="size28 bold" :class="item.is_inc ? 'green' : 'red'">
                            <span>{{ item.is_inc ? '+' : '-' }}</span>
                            <span v-init="item.amount"></span>
                        </div>
                    </div>
                    <div class="flex jb ac size24 opc5 mt20">
                        <div>{{ item.created_at }}</div>
                        <div>{{ tabs[current].name }}</div>
                    </div>
                </div>

                <CusEmpty v-if="list?.length==0"></CusEmpty>

            </div>
        </van-list>
    </van-pull-refresh>
    
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTabScroll from '@/components/CusTabScroll/index.vue'
import { assetAIX, assetNFTC, assetUSDT } from '@/config';
import { computed, ref, watch } from 'vue';
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'
import { t } from '@/locale';

const current = ref(0)

const tabs = computed(()=>([
    {
        name: assetUSDT,
        value: 'balance_usdt'
    },
    {
        name: assetAIX,
        value: 'balance_aix'
    },
    {
        name: assetNFTC,
        value: 'balance_nftc'
    },
    {
        name: `${t('抽奖')} ${assetAIX}`,
        value: 'balance_lottery_aix'
    },
    {
        name: `${t('年终奖')}`,
        value: 'balance_year'
    },
    {
        name: `${t('年终奖')} ${assetAIX}`,
        value: 'balance_year_aix'
    }
]))

const params = computed(()=>({ccy: tabs.value[current.value].value}))
const { list, props: listProps, loadList } = useLoadList('/api/balance_logs', 'asset_logs', params)
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