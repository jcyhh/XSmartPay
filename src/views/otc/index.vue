<template>
    <CusNav :title="$t('交易')" :show-bg="false"></CusNav>
    <img src="@/assets/otc/4.png" class="img92 pic92" @click="routerPush('/otc/release')">
    <div class="header">
        <div class="flex jb ac">
            <div class="tab flex size30 bold5">
                <div class="item flex ac jc" :style="{color:type==0?'#000000':'#FFFFFF80'}" @click="onTypeChange(0)">{{ $t('买入') }}</div>
                <div class="item flex ac jc" :style="{color:type==1?'#000000':'#FFFFFF80'}" @click="onTypeChange(1)">{{ $t('卖出') }}</div>
                <div class="line" :class="type==0?'line0':'line1'"></div>
            </div>
            <img src="@/assets/otc/1.png" class="img48" @click="routerPush('/otc/order')">
        </div>
        <div class="flex ac mt20">
            <div class="mainButton flex ac pick" @click="pickerShow=true">
                <img :src="currentPicker?.image" class="img32 mr10" v-if="currentPicker?.image">
                <div class="size24">{{ currentPicker?.name }}</div>
                <img src="@/assets/otc/2.png" class="pic2 ml10">
            </div>
            <div class="flex ac mainButton pick flex1 ml20">
                <div class="size24 main bold6 flex1">
                    <span>1 {{ currentPicker?.name }} ≈</span>
                    <span class="ml5 mr5" v-init="currentPicker?.price"></span>
                    <span>CNY</span>
                </div>
                <div class="line flex0"></div>
                <div class="flex ac ml30 flex0">
                    <img src="@/assets/otc/3.png" class="img24 mr10">
                    <div class="size24 opc5">{{ $t('指导价') }}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="gap200"></div>

    <van-pull-refresh class="fullPage rel" v-bind="props">
        <van-list class="fullPage" v-bind="listProps">
            <div class="pl30 pr30 pt30">

                <div class="card mb20" v-for="(item,index) in list" :key="index">
                    <div class="flex jb ac">
                        <div class="flex ac">
                            <img src="@/assets/user/1.png" class="img60 mr16">
                            <div class="size28" v-init:address="item.address || item.email"></div>
                        </div>
                        <div class="size28 main">
                            <span class="mr5">¥</span>
                            <span v-init="item.price"></span>
                        </div>
                    </div>
                    <div class="line mt24 mb24"></div>
                    <div class="size24 opc5">
                        <span class="mr10">{{ $t('数量') }}:</span>
                        <span v-init="item.remain_num" class="mr10"></span>
                        <span>{{ currentPicker?.name }}</span>
                    </div>
                    <div class="size24 opc5 mt16">
                        <span class="mr10">{{ $t('订单限额') }}:</span>
                        <span v-init="item.cny_min_num" class="mr10"></span>
                        <span>CNY - </span>
                        <span v-init="item.cny_max_num" class="mr10"></span>
                        <span>CNY</span>
                    </div>
                    <div class="flex jb ac mt20">
                        <div class="flex ac size22">
                            <template v-for="payType in getPayTypes(item.pay_types)" :key="payType">
                                <div class="typeLine" :class="payTypeClass(payType)"></div>
                                <div class="ml10 mr30">{{ payTypeName(payType) }}</div>
                            </template>
                        </div>
                        <div class="mainButton btn flex ac size24 main" @click="openBuy(item)" v-if="type==0">{{ $t('购买') }} {{ currentPicker?.name }}</div>
                        <div class="mainButtonDel btn flex ac size24 main" @click="openSale(item)" v-else>{{ $t('出售') }} {{ currentPicker?.name }}</div>
                    </div>
                </div>

            </div>
            <CusEmpty v-if="list?.length==0"></CusEmpty>
        </van-list>
    </van-pull-refresh>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" @change="onCcyChange">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.name }}</span>
        </template>
    </CusPicker>

    <Buy ref="buyRef" @success="loadList"></Buy>

    <Sale ref="saleRef" @success="loadList"></Sale>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { computed, onMounted, ref } from 'vue';
import CusPicker from '@/components/CusPicker/index.vue';
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'
import Buy from './components/Buy.vue';
import Sale from './components/Sale.vue';
import { routerPush } from '@/router/index.ts';
import { apiOtcAssets } from '@/api/otc';
import { t } from '@/locale';

interface OtcAsset {
    asset_code: string
    asset_name: string
    image?: string
    price?: number | string
    fee_rate?: number | string
}

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
const getPayTypes = (payTypes:string[] = []) => payTypeOrder.filter(type => payTypes.includes(type))

// 买入卖出
const type = ref(0)
const onTypeChange = (index:number) => {
    if(type.value==index)return
    type.value = index
    loadList()
}

// 币种
const pickerShow = ref(false)
const pickerCurrent = ref(0)
const pickerList = ref<any[]>([])
const currentPicker = computed(() => pickerList.value[pickerCurrent.value])
const onCcyChange = (index:number) => {
    pickerCurrent.value = index
    loadList()
}

// 列表
const params = computed(()=>({
    type: type.value == 0 ? 2 : 1,
    ccy: currentPicker.value?.asset_code
}))
const { list, props: listProps, loadList } = useLoadList('/api/otc', 'data', params)
const { props } = usePullRefresh(loadList)
loadList()

const loadAssets = async () => {
    const res:any = await apiOtcAssets()
    const list:OtcAsset[] = Array.isArray(res) ? res : res?.list || []

    pickerList.value = list.map(item => ({
        name: item.asset_name,
        icon: item.image,
        value: item.asset_code,
        asset_code: item.asset_code,
        price: item.price,
        fee_rate: item.fee_rate
    }))

    if (pickerCurrent.value >= pickerList.value.length) pickerCurrent.value = 0
}

// 买入
const buyRef = ref()
const openBuy = (data:any) => {
    buyRef.value?.open(data)
}

// 卖出
const saleRef = ref()
const openSale = (data:any) => {
    const asset = pickerList.value.find(item => item.value === data.ccy) || currentPicker.value
    saleRef.value?.open(data, asset?.fee_rate)
}

onMounted(() => {
    loadAssets()
})
</script>

<style lang="scss" scoped>
.img92{
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 10;
}
.header{
    width: 100vw;
    height: 220px;
    padding: 30px 30px 0 30px;
    position: fixed;
    top: 100px;
    left: 0;
    z-index: 10;
    background-color: #FFFFFF0A;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    .tab{
        border: 1px solid #FFFFFF1A;
        border-radius: 10px;
        padding: 8px;
        position: relative;
        .item{
            height: 60px;
            border-radius: 10px;
            padding: 0 20px;
            width: 150px;
            position: relative;
            z-index: 2;
            transition: all 0.3s;
        }
        .line{
            height: 60px;
            border-radius: 10px;
            width: 150px;
            background: linear-gradient(90deg, #EFB152 0%, #F0CD80 49.4%, #EFB152 100%);
            position: absolute;
            top: 8px;
            transition: all 0.3s;
        }
        .line0{
            left: 8px;
        }
        .line1{
            left: 158px;
        }
    }
    .pick{
        height: 68px;
        border-radius: 10px;
        padding: 0 20px;
        .pic2{
            width: 10px;
            height: 6px;
        }
        .line{
            width: 1px;
            height: 32px;
            background-color: #FFFFFF33;
        }
    }
}
.card{
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    border-radius: 20px;
    padding: 30px;
    .line{
        width: 100%;
        height: 1px;
        background-color: #FFFFFF33;
    }
    .btn{
        height: 60px;
        border-radius: 30px;
        padding: 0 20px;
    }
    .typeLine{
        width: 4px;
        height: 18px;
        border-radius: 2px;
    }
    .bank{
        background-color: #EFB85E;
    }
    .wechat{
        background-color: #0CC76D;
    }
    .alipay{
        background-color: #019CEB;
    }
}
</style>