<template>
    <CusNav :title="$t('赚币宝')"></CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="flex jc">
            <div class="tag flex ac">
                <img src="@/assets/user/18.png" class="img30 mr10">
                <div class="size24">{{ $t('资产安全有保障') }}</div>
            </div>
        </div>

        <div class="card mt30">
            <div class="opc5 size24 tc">{{ $t('总金额') }}({{ assetUSDT }})</div>
            <div class="tc bold size52 mt20" v-init="stats?.deposit_amount"></div>
            <div class="stats mt30 flex ac tc">
                <div class="flex1">
                    <div class="size28 bold6" v-init="stats?.total_income"></div>
                    <div class="size24 opc5 mt10">{{ $t('累计收益') }}</div>
                </div>
                <div class="line"></div>
                <div class="flex1">
                    <div class="size28 bold6" v-init="stats?.yesterday_income"></div>
                    <div class="size24 opc5 mt10">{{ $t('昨日收益') }}</div>
                </div>
            </div>
            <div class="pl6 pr6 mt40 flex size28 bold6">
                <div class="btn btn1 flex jc ac" @click="routerPush('/yuebao/record')">{{ $t('明细') }}</div>
                <div class="btn btn2 flex jc ac ml20" @click="saveRef?.open()">{{ $t('存入') }}</div>
            </div>
        </div>
    </div>

    <CusTab v-model="current" :list="tabs"></CusTab>

    <van-list class="page rel" v-bind="listProps">
        <div class="pl30 pr30 rel">

            <div class="cell item mb20" v-for="(item, index) in list" :key="index">
                <div class="flex jb">
                    <div>
                        <div class="size24 opc5">{{ $t('存入金额(USDT)') }}</div>
                        <div class="size40 bold6 main mt10" v-init="item.amount"></div>
                        <div class="size24 mt10">
                            <span>{{ $t('年化利率') }}</span>
                            <span class="green ml10">{{ item.annual_rate }}%</span>
                        </div>
                    </div>
                    <div class="flex col ae">
                        <div class="mainButton btn flex jc ac" v-scale v-if="item.can_withdraw && current==0" @click="openTakeout(item.id)">{{ $t('取出') }}</div>
                        <div class="progressBox mt30" v-if="!item.can_withdraw && current==0">
                            <CusProgress :progress="getPercent(item.released_days, item?.package?.days)"></CusProgress>
                        </div>
                        <div class="size24 opc5 mt10">{{ $t('进度') }} {{ item.released_days }}/{{ item?.package?.days }}{{ $t('天') }}</div>
                    </div>
                </div>
                <div class="flex mt40">
                    <div class="flex1">
                        <div v-init="item.total_profit"></div>
                        <div class="mt10 size20 opc5">{{ $t('累计收益') }}({{ assetUSDT }})</div>
                    </div>
                    <div class="flex1">
                        <div v-init="item.daily_profit"></div>
                        <div class="mt10 size20 opc5">{{ $t('每日预估收益') }}({{ assetUSDT }})</div>
                    </div>
                    <div class="flex1">
                        <div v-init="item.released_token_amount"></div>
                        <div class="mt10 size20 opc5">
                            {{ $t('已释放') }}
                            <span v-if="item.ccy=='balance_usdt'">({{ assetUSDT }})</span>    
                            <span v-else-if="item.ccy=='balance_aix'">({{ assetAIX }})</span> 
                            <span v-else>({{ assetNFTC }})</span> 
                        </div>
                    </div>
                </div>
            </div>
            <CusEmpty v-if="list?.length==0"></CusEmpty>
        </div>
    </van-list>
    
    <VanPopup v-model:show="showAsk" style="background: transparent;" overlay-class="cusMask" teleport="#app">
        <div class="popupCenter mainCard">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('提示') }}</div>
                    <van-icon size="20" name="cross" color="#8D9094" @click="showAsk=false" />
                </div>

                <div class="size26 mt50">{{ $t('确定要取出吗？') }}</div>

                <div class="mt50 flex ac bold5">
                    <div class="mainButton btn flex jc ac main" @click="showAsk=false">{{ $t('取消') }}</div>
                    <div class="mainBtn btn ml20 flex jc ac" @click="takeOut">{{ $t('确认') }}</div>
                </div>
            </div>
        </div>
    </VanPopup>

    <Save ref="saveRef" @success="onSuccess()"></Save>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTab from '@/components/CusTab/index.vue'
import { assetAIX, assetNFTC, assetUSDT } from '@/config';
import { t } from '@/locale';
import { computed, onMounted, ref, watch } from 'vue';
import CusProgress from '@/components/CusProgress/index.vue'
import { getPercent } from '@/utils';
import { useLoadList } from '@/hooks/useLoadList';
import CusEmpty from '@/components/CusEmpty/index.vue'
import { apiTakeOut, apiYuebaoStats } from '@/api/yuebao';
import { routerPush } from '@/router';
import { message } from '@/utils/message';
import Save from './components/Save.vue';

const saveRef = ref()

const current = ref(0)

const tabs = computed(()=>([
    {
        name: t('进行中'),
        value: 1
    },
    {
        name: t('已完成'),
        value: 2
    }
]))

const params = computed(()=>({status: tabs.value[current.value].value}))
const { list, props: listProps, loadList } = useLoadList('/api/yuebao/orders', 'orders', params)

watch(current, () => loadList(), {immediate:true})

const stats = ref()
const loadData = async () => stats.value = await apiYuebaoStats()

const orderId = ref()
const showAsk = ref(false)
const openTakeout = (id:any) => {
    orderId.value = id
    showAsk.value = true
}
const takeOut = async () => {
    await apiTakeOut({
        order_id: orderId.value
    })
    message(t('操作成功'), 'success')
    showAsk.value = false
    loadData()
    loadList()
}

const onSuccess = () => {
    loadData()
    loadList()
}

onMounted(()=>{
    loadData()
})
</script>

<style lang="scss" scoped>
.tag{
    height: 54px;
    border-radius: 27px;
    background-color: #FFFFFF33;
    padding: 0 30px;
}
.card{
    background: linear-gradient(140.58deg, #FFE7AB 5.95%, #D3AC61 94.05%);
    border-radius: 20px;
    padding: 50px 24px 30px 24px;
    color: #000000;
    .stats{
        width: 100%;
        height: 144px;
        background-image: url("@/assets/user/19.png");
        background-size: 100% 100%;
        .line{
            width: 1px;
            height: 60px;
            background-color: #00000029;
        }
    }
    .btn{
        height: 80px;
        border-radius: 40px;
        flex: 1;
    }
    .btn1{
        background-color: #0000001A;
    }
    .btn2{
        background-color: #000000;
        color: #FFFFFF;
    }
}
.item{
    padding: 30px;
    border-radius: 20px;
    &::before{
        border-radius: 20px;
    }
    .btn{
        height: 60px;
        padding: 0 30px;
        font-size: 26px;
        color: $main-color;
    }
    .progressBox{
        width: 200px;
        height: 16px;
        border-radius: 8px;
    }
}
</style>