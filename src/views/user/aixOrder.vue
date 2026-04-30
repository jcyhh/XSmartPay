<template>
    <CusNav :title="`AIX ${$t('释放订单')}`" :show-bg="false" :show-glass="false"></CusNav>

    <CusTab v-model="current" :list="tabs"></CusTab>

    <van-pull-refresh class="page rel" v-bind="props">
        <van-list class="page" v-bind="listProps">
            <div class="pl30 pr30">
        
            <div class="cell card mb20" v-for="(item, index) in list" :key="index">
                <div class="flex jb size24">
                    <div class="opc5">{{ $t('总额度') }}({{ assetAIX }})</div>
                    <div class="prog">
                        <CusProgress :progress="getPercent(item.release_count, item.total_count)"></CusProgress>
                        <div class="tr size24 mt10">
                            <span class="opc5 mr10">{{ $t('释放次数') }}</span>
                            <span class="main">{{ item.release_count }}</span>
                            <span class="main ml5 mr5">/</span>
                            <span class="main">{{ item.total_count }}</span>
                        </div>
                    </div>
                </div>
                <div class="size40 bold6 mt20 main" v-init="item.total_amount"></div>
                <div class="flex mt40">
                    <div class="flex1">
                        <div class="size28 bold6" v-init="item.today_amount"></div>
                        <div class="size20 opc5 mt15">{{ $t('今日释放') }}({{ assetAIX }})</div>
                    </div>
                    <div class="flex1">
                        <div class="size28 bold6" v-init="item.release_amount"></div>
                        <div class="size20 opc5 mt15">{{ $t('已释放') }}({{ assetAIX }})</div>
                    </div>
                </div>
                <div class="line mt30 mb20"></div>
                <div class="size24 opc5">{{ item.created_at }}</div>
            </div>
            <CusEmpty v-if="list?.length==0"></CusEmpty>
        </div>
        </van-list>
    </van-pull-refresh>
    
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTab from '@/components/CusTab/index.vue'
import { assetAIX } from '@/config';
import { t } from '@/locale';
import { computed, ref, watch } from 'vue';
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'
import CusProgress from '@/components/CusProgress/index.vue'
import { getPercent } from '@/utils';

const current = ref(0)

const tabs = computed(()=>([
    {
        name: t('进行中'),
        value: 1
    },
    {
        name: t('已结束'),
        value: 0
    }
]))

const params = computed(()=>({status: tabs.value[current.value].value}))
const { list, props: listProps, loadList } = useLoadList('/api/burn_orders/releases', 'data', params)
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
.prog{
    width: 200px;
    height: 12px;
    border-radius: 6px;
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