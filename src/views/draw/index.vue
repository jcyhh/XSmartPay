<template>
    <img src="@/assets/draw/bg.png" class="bg">

    <div class="rule rule1 flex ac animate__animated animate__slideInRight" @click="routerPush('/draw/rule')">
        <img src="@/assets/draw/6.png" class="img30 mr6">
        <div class="size24">{{ $t('规则') }}</div>
    </div>

    <div class="rule rule2 flex ac animate__animated animate__slideInRight" @click="routerPush('/draw/record')">
        <img src="@/assets/draw/7.png" class="img30 mr6">
        <div class="size24">{{ $t('记录') }}</div>
    </div>

    <div class="pl30 pr30 pt50 rel">
        
        <div class="size40 bold6 tc">
            <span>{{ appName }}</span>
            <span class="ml10 main">{{ $t('限时抢卡') }}</span>
        </div>

        <van-swipe class="notice mt20 mb20" :show-indicators="false" :vertical="true" :autoplay="3000">
            <van-swipe-item v-for="item in messages">
                <div class="notice flex ac main size24 br">
                    {{ $t('恭喜') }} "{{ item.user_email }}" {{ $t('抢得') }} “{{ item.product_name }}” {{ $t('喜得10倍收益') }}
                </div>
            </van-swipe-item>
        </van-swipe>

        <Draw></Draw>

        <div class="flex mt50">
            <div class="card flex1">
                <div class="flex">
                    <div class="tag flex ac">
                        <img src="@/assets/common/usdt.png" class="img32 mr6">
                        <div class="size24 bold6">{{ assetUSDT }}</div>
                    </div>
                </div>
                <div class="size40 bold6 main mt30">
                    <CusNumber :amount="stats?.total_amount" sizeClass="size28"></CusNumber>
                </div>
                <div class="size24 opc5 mt10">{{ $t('抢卡总收益') }}</div>
            </div>
            <div class="card flex1 ml20">
                <div class="flex">
                    <div class="tag flex ac">
                        <img src="@/assets/common/usdt.png" class="img32 mr6">
                        <div class="size24 bold6">{{ assetUSDT }}</div>
                    </div>
                </div>
                <div class="size40 bold6 main mt30">
                    <CusNumber :amount="stats?.today_amount" sizeClass="size28"></CusNumber>
                </div>
                <div class="size24 opc5 mt10">{{ $t('今日抢卡收益') }}</div>
            </div>
        </div>

    </div>

    <div class="gap60"></div>
</template>

<script setup lang="ts">
import { apiMessage } from '@/api/home';
import { appName, assetUSDT } from '@/config';
import { onMounted, ref } from 'vue';
import CusNumber from '@/components/CusNumber/index.vue'
import Draw from './components/Draw.vue';
import { routerPush } from '@/router';
import { apiDrawStats } from '@/api/card';

// 通知
const messages = ref()
const loadMessage = async () => {
    const res:any = await apiMessage(2)
    messages.value = res.list
}

const stats = ref()
const loadStats = async () => {
    const res:any = await apiDrawStats()
    stats.value = res
}

onMounted(()=>{
    loadMessage()
    loadStats()
})
</script>

<style lang="scss" scoped>
.bg{
    width: 100vw;
    height: auto;
    position: fixed;
    top: 0;
    left: 0;
}
.notice{
    width: 100%;
    height: 80px;
}
.card{
    border-radius: 30px;
    padding: 30px;
    background: linear-gradient(#FFE5A51F, #FFE5A500);
    border: 1px solid transparent;
    border-bottom: none;
    position: relative;
    &::before{
        content: '';
        position: absolute;
        z-index: -1;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border-radius: 30px;
        background: linear-gradient(#8F8F8F, #8F8F8F00);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: xor;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        padding: 1px;
    }
    .tag{
        height: 48px;
        border-radius: 24px;
        padding: 0 12px;
        background-color: #0000001A;
        border: 1px solid rgba($color: #FFFFFF, $alpha: 0.5);
    }
}
.rule{
    height: 62px;
    border-radius: 31px 0 0 31px;
    padding: 0 30px 0 20px;
    background: #FFFFFF1A;
    border: 1px solid transparent;
    position: fixed;
    z-index: 5;
    right: 0;
    transform-origin: center right;
    &::before{
        content: '';
        position: absolute;
        z-index: -1;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border-radius: 31px 0 0 31px;
        background: linear-gradient(to right, #8F8F8F, #8F8F8F00);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: xor;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        padding: 1px;
    }
}
.rule1{
    bottom: 616px;
}
.rule2{
    bottom: 524px;
}
</style>