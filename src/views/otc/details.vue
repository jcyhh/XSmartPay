<template>
    <CusNav :title="$t('委托单详情')"></CusNav>

    <div class="pl30 pr30 pt30 rel" v-if="order">

        <div class="mainCard size26 mb30">
            <div class="flex jb ac">
                <div class="opc5">{{ $t('委托单号') }}</div>
                <div>{{ order.order_no || '--' }}</div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">{{ $t('交易单价') }}</div>
                <div>
                    <span>¥</span>
                    <span v-init="order.price"></span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">{{ $t('交易限额') }}</div>
                <div>
                    <span v-init="order.cny_min_num"></span>
                    <span class="ml5 mr5">CNY</span>
                    <span>-</span>
                    <template v-if="hasMaxLimit">
                        <span class="ml5 mr5" v-init="order.cny_max_num"></span>
                        <span>CNY</span>
                    </template>
                    <span class="ml5" v-else>{{ $t('不限') }}</span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">{{ $t('交易数量') }}</div>
                <div>
                    <span v-init="order.num"></span>
                    <span class="ml5">{{ assetName }}</span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">{{ $t('交易总额') }}</div>
                <div>
                    <span v-init="order.total_amount"></span>
                    <span class="ml5">CNY</span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">{{ $t('已交易数量') }}</div>
                <div>
                    <span v-init="order.traded_num"></span>
                    <span class="ml5">{{ assetName }}</span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">{{ $t('已交易总额') }}</div>
                <div>
                    <span>¥</span>
                    <span v-init="order.traded_amount"></span>
                </div>
            </div>
            <div class="flex jb ac mt25">
                <div class="opc5">{{ $t('支付方式') }}</div>
                <div class="flex ac pay size22">
                    <template v-for="payType in getPayTypes(order.pay_types)" :key="payType">
                        <div class="line ml30" :class="payTypeClass(payType)"></div>
                        <div class="ml10">{{ payTypeName(payType) }}</div>
                    </template>
                </div>
            </div>
        </div>

        <div class="card mb20" v-for="item in trades" :key="item.id" @click="goTradeDetail(item)">
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

        <CusEmpty v-if="trades.length==0"></CusEmpty>
    </div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusEmpty from '@/components/CusEmpty/index.vue'
import { getAssetByCode } from '@/config';
import { t } from '@/locale';
import { routerPush } from '@/router';
import { apiOtcOrderDetail } from '@/api/otc';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const { params } = useRoute()

const order = ref<any>()
const trades = ref<any[]>([])

const assetName = computed(() => getAssetByCode(order.value?.ccy))

const hasMaxLimit = computed(() => Number(order.value?.max_num) > 0)

const payTypeMap:Record<string, { name:string, className:string }> = {
    bank_card: {
        name: t('银行卡'),
        className: 'bank'
    },
    wechat: {
        name: t('微信'),
        className: 'wechat'
    },
    alipay: {
        name: t('支付宝'),
        className: 'alipay'
    }
}

const payTypeName = (type:string) => payTypeMap[type]?.name || type
const payTypeClass = (type:string) => payTypeMap[type]?.className || ''
const payTypeOrder = ['bank_card', 'wechat', 'alipay']
const getPayTypes = (payTypes:string[] = []) => payTypeOrder.filter(type => payTypes?.includes(type))

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

const goTradeDetail = (item:any) => {
    routerPush(`/otc/detail/${item.id}`)
}

const loadData = async () => {
    const res:any = await apiOtcOrderDetail(params.id)
    order.value = res?.order
    trades.value = res?.trades || []
}

onMounted(() => {
    loadData()
})
</script>

<style lang="scss" scoped>
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
}
</style>
