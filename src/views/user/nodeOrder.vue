<template>
    <CusNav :title="$t('释放订单')" :show-bg="false" :show-glass="false"></CusNav>

    <div class="pl30 pr30 flex jb ast mt30">
        <div class="leftcard">
            <div class="flex jb as">
                <div class="size24 opc5">{{ $t('累计分红收益') }}</div>
                <img src="@/assets/common/usdt.png" class="img48 ml30 flex0">
            </div>
            <div class="size36 bold mt8" v-init="total_dividend"></div>
        </div>
        <div class="rightcard">
            <div class="size24 opc6">{{ $t('今日分红收益') }}</div>
            <div class="size3 bold mt24" v-init="today_dividend"></div>
        </div>
    </div>

    <CusTab v-model="current" :list="tabs"></CusTab>

    <van-pull-refresh class="page rel" v-bind="props">
        <van-list class="page" v-bind="listProps">
            <div class="pl30 pr30">
        
            <div class="cell card mb20" v-for="(item, index) in list" :key="index">
                <div class="flex jb ac">
                    <div>
                        <div class="size28 bold6">{{ item.node_product.name }}</div>
                        <div class="size24 mt10 opc5">{{ item.created_at }}</div>
                    </div>
                    <div class="mainButton unstake flex ac main size26 bold6" v-if="item.can_redeem" @click="openpop(item.id)">赎回</div>
                </div>
                <div class="flex mt40">
                    <div class="flex1">
                        <div class="size24" v-init="item.total_dividend"></div>
                        <div class="size20 opc5 mt15">{{ $t('累计分红') }} {{ assetUSDT }}</div>
                    </div>
                    <div class="flex1">
                        <div class="size24 green" v-init="item.today_dividend"></div>
                        <div class="size20 opc5 mt15">{{ $t('今日分红') }} {{ assetUSDT }}</div>
                    </div>
                    <div class="flex1" v-if="item.ccy=='balance_aix'">
                        <div class="size24">{{ item.stake_days }}</div>
                        <div class="size20 opc5 mt15">{{ $t('质押周期') }}</div>
                    </div>
                </div>
            </div>
            <CusEmpty v-if="list?.length==0"></CusEmpty>
        </div>
        </van-list>
    </van-pull-refresh>

    <VanPopup v-model:show="show" style="background: transparent;" :close-on-click-overlay="false"
        overlay-class="cusMask" teleport="#app">
        <div class="popupCenter mainCard">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('购买节点') }}</div>
                    <van-icon name="cross" :size="25" @click="show=false" />
                </div>
                <div class="size28 mt30">{{ $t('确定要赎回吗？') }}</div>
                <div class="mt50 flex ac bold5">
                    <div class="mainButton tipbtn flex1 flex jc ac main" @click="show=false">{{ $t('取消') }}</div>
                    <div class="mainBtn tipbtn flex1 flex jc ac ml20" @click="unstake">{{ $t('确认购买') }}</div>
                </div>
            </div>
        </div>
    </VanPopup>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTab from '@/components/CusTab/index.vue'
import { assetUSDT } from '@/config';
import { t } from '@/locale';
import { computed, onMounted, ref, watch } from 'vue';
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'
import { apiNodeStat, apiNodeUnStake } from '@/api/home';
import { message } from '@/utils/message';

const current = ref(0)
const show = ref(false)

const tabs = computed(()=>([
    {
        name: t('进行中'),
        value: 1
    },
    {
        name: t('已赎回'),
        value: 2
    }
]))

const today_dividend = ref(0)
const total_dividend = ref(0)
const loadStats = async () => {
    const res:any = await apiNodeStat()
    today_dividend.value = res.today_dividend
    total_dividend.value = res.total_dividend
}

const params = computed(()=>({status: tabs.value[current.value].value}))
const { list, props: listProps, loadList } = useLoadList('/api/node-product/orders', 'orders', params)
const { props } = usePullRefresh(loadList)

watch(current, () => {
    loadStats()
    loadList()
}, {immediate:true})

const orderid = ref()
const openpop = (id:any) => {
    orderid.value = id
    show.value = true
}
const unstake = async () => {
    await apiNodeUnStake({
        order_id: orderid.value
    })
    message(t('操作成功'), 'success')
    show.value = false
    loadList()
    loadStats()
}

onMounted(()=>{
    loadList()
})
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
.leftcard{
    width: 424px;
    height: 170px;
    border-radius: 20px;
    background: linear-gradient(360deg, rgba(255, 229, 165, 0) 0%, #FFE5A5 100%),
linear-gradient(140.58deg, #FFE7AB 5.95%, #D3AC61 94.05%);
    padding: 30px 30px 0 30px;
    color: #000000;
}
.rightcard{
    width: 252px;
    height: 170px;
    border-radius: 20px;
    background: linear-gradient(180deg, rgba(255, 181, 0, 0.1) 0%, rgba(255, 181, 0, 0) 100%);
    border: 1px solid #FFE5A580;
    padding: 30px 24px 0 24px;
}
.unstake{
    height: 60px;
    padding: 0 30px;
}
.tipbtn{
    width: 100%;
    height: 80px;
}
</style>