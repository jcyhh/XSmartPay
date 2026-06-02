<template>
    <CusNav :title="$t('全部订单')" :show-bg="false" :show-glass="false"></CusNav>

    <CusTab v-model="current" :list="tabs"></CusTab>

    <div class="ccys">
        <div class="ccyBox flex ac">
            <div class="ccyItem mr60 bold6" v-for="(item,index) in ccys" :key="item.value || index" @click="onCcyChange(index)">
                <span :class="index==ccyCur?'main':''">{{ item.name }}</span>
                <div class="ccyLine animate__animated animate__zoomIn ani3" v-if="index==ccyCur"></div>
            </div>
        </div>
    </div>

    <div class="gap90"></div>

    <van-pull-refresh class="list rel" v-bind="refreshProps">
        <van-list class="list" v-bind="listProps">
            <div class="pl30 pr30 mb30">

                <template v-if="current==0">
                    <div class="card mb20" v-for="item in list" :key="item.id" @click="goOrderDetail(item)">
                        <div class="flex jb ac">
                            <div class="flex ac">
                                <div class="tag" :class="item.type==1?'in':'out'">{{ item.type==1 ? $t('买入') : $t('卖出') }}</div>
                                <div class="ml16">
                                    <span class="size32">{{ getAssetByCode(item.ccy) }}</span>
                                    <span class="size32 opc5">/</span>
                                    <span class="size24 opc5">CNY</span>
                                </div>
                            </div>
                            <div class="size24" :class="getOrderStatusClass(item.status)">{{ getOrderStatusText(item.status) }}</div>
                        </div>
                        <div class="size24 opc5 mt20">{{ item.created_at }}</div>
                        <div class="flex mt24">
                            <div class="flex1">
                                <div class="size20 opc5">{{ $t('交易单价') }}</div>
                                <div class="size24 bold5 mt10">
                                    <span>¥</span>
                                    <span v-init="item.price"></span>
                                </div>
                            </div>
                            <div class="flex1">
                                <div class="size20 opc5">{{ $t('剩余数量') }}({{ getAssetByCode(item.ccy) }})</div>
                                <div class="size24 bold5 mt10">
                                    <span v-init="item.remain_num"></span>
                                </div>
                            </div>
                            <div class="flex1">
                                <div class="size20 opc5">{{ $t('交易总额') }}</div>
                                <div class="size24 bold5 mt10">
                                    <span v-init="item.total_amount"></span>
                                </div>
                            </div>
                        </div>
                        <div class="cancel flex jc ac mt30 size24" v-if="item.status==1" @click.stop="openCancel(item)">{{ $t('撤销委托单') }}</div>
                    </div>
                </template>

                <template v-else>
                    <div class="card mb20" v-for="item in list" :key="item.id" @click="goTradeDetail(item)">
                        <div class="flex jb ac">
                            <div class="flex ac">
                                <div class="tag" :class="item.role=='buyer'?'in':'out'">{{ item.role=='buyer' ? $t('买入') : $t('卖出') }}</div>
                                <div class="ml16">
                                    <span class="size32">{{ getAssetByCode(item.ccy) }}</span>
                                    <span class="size32 opc5">/</span>
                                    <span class="size24 opc5">CNY</span>
                                </div>
                            </div>
                            <div class="size24" :class="getTradeStatusClass(item.status)">{{ getTradeStatusText(item.status) }}</div>
                        </div>
                        <div class="size24 opc5 mt20">{{ item.created_at }}</div>
                        <div class="flex mt24">
                            <div class="flex1">
                                <div class="size20 opc5">{{ $t('交易单价') }}</div>
                                <div class="size24 bold5 mt10">
                                    <span>¥</span>
                                    <span v-init="item.price"></span>
                                </div>
                            </div>
                            <div class="flex1">
                                <div class="size20 opc5">{{ $t('交易数量') }}({{ getAssetByCode(item.ccy) }})</div>
                                <div class="size24 bold5 mt10">
                                    <span v-init="item.num"></span>
                                </div>
                            </div>
                            <div class="flex1">
                                <div class="size20 opc5">{{ $t('交易总额') }}</div>
                                <div class="size24 bold5 mt10">
                                    <span v-init="item.total_amount"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <CusEmpty v-if="list?.length==0"></CusEmpty>
            </div>
        </van-list>
    </van-pull-refresh>

    <CusAsk v-model:show="showAsk" :title="$t('撤销委托单')" @submit="confirmCancel">
        <div class="size28">{{ $t('确认撤销此委托单吗？') }}</div>
    </CusAsk>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusTab from '@/components/CusTab/index.vue'
import { getAssetByCode } from '@/config';
import { t } from '@/locale';
import { computed, onMounted, ref, watch } from 'vue';
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'
import CusAsk from '@/components/CusAsk/index.vue'
import { routerPush } from '@/router';
import { apiCancelOtcOrder, apiOtcAssets } from '@/api/otc';
import { message } from '@/utils/message';

const current = ref(0)
const tabs = computed(() => ([
    {
        name: t('委托订单'),
        value: 1
    },
    {
        name: t('交易订单'),
        value: 0
    }
]))

const ccyCur = ref(0)
const ccys = ref<{ name:string, value:string }[]>([])

const listParams = computed(() => ({
    ccy: ccys.value[ccyCur.value]?.value || 'balance_usdt'
}))

const orderList = useLoadList('/api/otc/my', 'data', listParams)
const tradeList = useLoadList('/api/otc/trades', 'data', listParams)

const list = computed(() => current.value === 0 ? orderList.list.value : tradeList.list.value)
const listProps = computed(() => current.value === 0 ? orderList.props.value : tradeList.props.value)

const loadList = () => {
    if (current.value === 0) orderList.loadList()
    else tradeList.loadList()
}

const { props: refreshProps } = usePullRefresh(loadList)

const onCcyChange = (index:number) => {
    if(ccyCur.value==index)return
    ccyCur.value = index
    loadList()
}

const getOrderStatusText = (status:number) => {
    if(status==0)return t('已取消')
    if(status==1)return t('挂单中')
    if(status==2)return t('已完成')
    return '--'
}

const getOrderStatusClass = (status:number) => {
    if(status==1)return 'green'
    if(status==2)return 'opc5'
    return 'red'
}

const getTradeStatusText = (status:number) => {
    if(status==0)return t('已取消')
    if(status==1)return t('待付款')
    if(status==2)return t('待确认收款')
    if(status==3)return t('申诉中')
    if(status==4)return t('已完成')
    return '--'
}

const getTradeStatusClass = (status:number) => {
    if(status==1 || status==2)return 'green'
    if(status==3)return 'red'
    if(status==4)return 'opc5'
    return 'red'
}

const goOrderDetail = (item:any) => {
    routerPush(`/otc/details/${item.id}`)
}

const goTradeDetail = (item:any) => {
    routerPush(`/otc/detail/${item.id}`)
}

const showAsk = ref(false)
const cancelId = ref<number>()
const canceling = ref(false)

const openCancel = (item:any) => {
    cancelId.value = item.id
    showAsk.value = true
}

const confirmCancel = async () => {
    if (!cancelId.value || canceling.value) return
    canceling.value = true
    try {
        await apiCancelOtcOrder(cancelId.value)
        message(t('撤销成功'), 'success')
        showAsk.value = false
        cancelId.value = undefined
        orderList.loadList()
    } finally {
        canceling.value = false
    }
}

const loadAssets = async () => {
    const res:any = await apiOtcAssets()
    const assetList = Array.isArray(res) ? res : res?.list || []

    ccys.value = assetList.map((item:any) => ({
        name: item.asset_name,
        value: item.asset_code
    }))

    if (ccyCur.value >= ccys.value.length) ccyCur.value = 0
}

watch(current, () => {
    loadList()
})

onMounted(async () => {
    await loadAssets()
    loadList()
})
</script>

<style lang="scss" scoped>
.ccys{
    height: 90px;
    width: 100vw;
    background-color: #040404;
    position: fixed;
    top: 250px;
    left: 0;
    z-index: 10;
    .ccyBox{
        border-bottom: 1px solid #FFFFFF33;
        padding-left: 30px;
        .ccyItem{
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding-bottom: 10px;
            .ccyLine{
                width: 40px;
                height: 4px;
                border-radius: 2px;
                background-color: #FFE5A5;
                position: absolute;
                bottom: 0;
            }
        }
    }
}
.list{
    width: 100%;
    min-height: calc(100vh - 340px);
    min-height: calc(100vh - 340dvh);
}
.card{
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    border-radius: 20px;
    padding: 30px;
    .tag{
        height: 44px;
        border-radius: 10px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        font-size: 24px;
    }
    .in{
        background-color: #2CA230;
    }
    .out{
        background-color: #E33232;
    }
    .cancel{
        height: 66px;
        border-radius: 33px;
        background-color: #E332321A;
        color: #E33232;
        border: 1px solid #E3323280;
    }
}
</style>
