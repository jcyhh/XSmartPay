<template>
    <CusNav :title="$t('OTC交易')" :show-bg="false"></CusNav>
    <img src="@/assets/otc/4.png" class="img92 pic92" @click="routerPush('/otc/release')">
    <div class="header">
        <div class="flex jb ac">
            <div class="tab flex size30 bold5">
                <div class="item flex ac jc" :style="{color:type==0?'#000000':'#FFFFFF80'}" @click="onTypeChange(0)">买入</div>
                <div class="item flex ac jc" :style="{color:type==1?'#000000':'#FFFFFF80'}" @click="onTypeChange(1)">卖出</div>
                <div class="line" :class="type==0?'line0':'line1'"></div>
            </div>
            <img src="@/assets/otc/1.png" class="img48" @click="routerPush('/otc/order')">
        </div>
        <div class="flex ac mt20">
            <div class="mainButton flex ac pick" @click="pickerShow=true">
                <img :src="pickerList[pickerCurrent].icon" class="img32 mr10">
                <div class="size24">{{ pickerList[pickerCurrent].name }}</div>
                <img src="@/assets/otc/2.png" class="pic2 ml10">
            </div>
            <div class="flex ac mainButton pick flex1 ml20">
                <div class="size24 main bold6 flex1">
                    <span>1 USDT ≈</span>
                    <span class="ml5 mr5" v-init="1000"></span>
                    <span>CNY</span>
                </div>
                <div class="line flex0"></div>
                <div class="flex ac ml30 flex0">
                    <img src="@/assets/otc/3.png" class="img24 mr10">
                    <div class="size24 opc5">指导价</div>
                </div>
            </div>
        </div>
    </div>

    <div class="gap200"></div>

    <van-pull-refresh class="fullPage rel" v-bind="props">
        <van-list class="fullPage" v-bind="listProps">
            <div class="pl30 pr30 pt30">

                <div class="card mb20" v-for="(item,index) in 10" :key="index">
                    <div class="flex jb ac">
                        <div class="flex ac">
                            <img src="@/assets/user/1.png" class="img60 mr16">
                            <div class="size28" v-init:address="'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'"></div>
                        </div>
                        <div class="size28 main">
                            <span class="mr5">¥</span>
                            <span v-init="1000"></span>
                        </div>
                    </div>
                    <div class="line mt24 mb24"></div>
                    <div class="size24 opc5">
                        <span class="mr10">数量:</span>
                        <span v-init="1000" class="mr10"></span>
                        <span>{{ assetUSDT }}</span>
                    </div>
                    <div class="size24 opc5 mt16">
                        <span class="mr10">订单限额:</span>
                        <span v-init="1000" class="mr10"></span>
                        <span>CNY - </span>
                        <span v-init="1000" class="mr10"></span>
                        <span>CNY</span>
                    </div>
                    <div class="flex jb ac mt20">
                        <div class="flex ac size22">
                            <div class="typeLine bank"></div>
                            <div class="ml10 mr30">银行卡</div>
                            <div class="typeLine wechat"></div>
                            <div class="ml10 mr30">微信</div>
                            <div class="typeLine alipay"></div>
                            <div class="ml10">支付宝</div>
                        </div>
                        <div class="mainButton btn flex ac size24 main" @click="openBuy(item)">购买 {{ assetUSDT }}</div>
                    </div>
                </div>

            </div>
            <CusEmpty v-if="list?.length==0"></CusEmpty>
        </van-list>
    </van-pull-refresh>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" @change="$event=>pickerCurrent=$event">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.first_name }} {{ item.last_name }}({{ item.country_code }})</span>
        </template>
    </CusPicker>

    <Buy ref="buyRef"></Buy>

    <Sale ref="saleRef"></Sale>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { computed, ref } from 'vue';
import CusPicker from '@/components/CusPicker/index.vue';
import { assetUSDT } from '@/config'
import iconUsdt from '@/assets/common/usdt.png'
import { useLoadList } from '@/hooks/useLoadList';
import { usePullRefresh } from '@/hooks/usePullRefresh';
import CusEmpty from '@/components/CusEmpty/index.vue'
import Buy from './components/Buy.vue';
import Sale from './components/Sale.vue';
import { routerPush } from '@/router/index.ts';

// 列表
const { list, props: listProps, loadList } = useLoadList('/api/notices', 'notices')
const { props } = usePullRefresh(loadList)
// loadList()

// 买入卖出
const type = ref(0)
const onTypeChange = (index:number) => {
    if(type.value==index)return
    type.value = index
}

// 币种
const pickerShow = ref(false)
const pickerCurrent = ref(0)
const pickerList = computed(()=>([
    {name:assetUSDT, icon: iconUsdt, value:'balance_usdt'}
]))

// 买入
const buyRef = ref()
const openBuy = (data:any) => {
    buyRef.value?.open(data)
}

// 卖出
const saleRef = ref()
const openSale = (data:any) => {
    saleRef.value?.open(data)
}
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