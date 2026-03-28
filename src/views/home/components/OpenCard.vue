<template>
    <div class="cardSwiperWrap">
        <swiper
            class="cardSwiper"
            :modules="modules"
            :slides-per-view="'auto'"
            :space-between="space"
            :centered-slides="true"
            :loop="true"
            :autoplay="autoplay"
        >
            <swiper-slide v-for="item in cardSwiperList" :key="item" class="cardSlide">
                <div class="cardBlock">
                    <img :src="item" class="cardImg">
                </div>
            </swiper-slide>
        </swiper>
    </div>

    <div class="gap200"></div>
    <div class="line mt65"></div>

    <div class="flex jb ac size24 mt30">
        <div>卡</div>
        <div class="opc5">
            <span class="mr10">库存</span>
            <span v-init="1000"></span>
        </div>
    </div>

    <div class="flex mt20">
        <div class="price bold">
            <span class="size48" v-init="1000"></span>
            <span class="size28 ml10">{{ assetUSDT }}</span>
        </div>
    </div>

    <div class="flex ac mt30">
        <div class="update mainButton flex jc ac">
            <img src="@/assets/home/3.png" class="img40 mr10">
            <div class="size32 main">升级</div>
        </div>
        <div class="mainBtn flex1 ml20 flex jc ac size32 bold5">立即开卡</div>
    </div>
</template>

<script setup lang="ts">
import { getAdaptPx } from '@/utils';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';
import card0 from '@/assets/card/0.png'
import card1 from '@/assets/card/1.png'
import card2 from '@/assets/card/2.png'
import card3 from '@/assets/card/3.png'
import card4 from '@/assets/card/4.png'
import card5 from '@/assets/card/5.png'
import card6 from '@/assets/card/6.png'
import { assetUSDT } from '@/config';

// 卡
const space = getAdaptPx(30)
const modules = [Autoplay]
const autoplay = {
    delay: 3000,
    disableOnInteraction: true
}

const cardSwiperList = [card0, card1, card2, card3, card4, card5, card6]
</script>

<style lang="scss" scoped>
.line{
    width: 100%;
    height: 1px;
    background-color: #FFFFFF1A;
}
.cardSwiperWrap{
    width: 100vw;
    overflow: hidden;
    position: absolute;
    top: 78px;
    left: -30px;
    z-index: 1;
}
.cardSwiper{
    width: 100vw;
    overflow: visible;
}
.cardSlide{
    width: 308px;
}
.cardBlock{
    width: 308px;
    height: 265px;
    padding-top: 40px;
    .cardImg{
        width: 308px;
        height: 185px;
    }
}
.price{
    display: inline-block;
    background: linear-gradient(281.88deg, #FFF1BF 24.66%, #FFF1BF 37.09%, #FFCD48 39.28%, #FFF1BF 59.99%, #FFCD48 64.38%, #FFF1BF 75.34%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}
.update{
    width: 250px;
    height: 80px;
}
</style>