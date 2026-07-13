<template>
    <img src="@/assets/login/bg.png" class="pagebg animate__animated animate__slideInDown" style="position: absolute;">

    <div class="rel pt30 pl30 pr30">
        <div class="topcard">
            <div class="flex ac">
                <div class="mr20 logo">
                    <img src="@/assets/user/1.png" class="logoImg">
                </div>
                <div class="flex1 flex jb ac">
                    <div class="">
                        <div class="size38 bold opc8">
                            <span v-init="stats?.private_equity_amount"></span>
                        </div>
                        <div class="size30 opc5 mt10">{{ $t('总量') }}</div>
                    </div>
                    <div class="tr">
                        <div class="size38 bold opc8">
                            $<span v-init="stats?.aix_price"></span>
                        </div>
                        <div class="size30 opc5 mt10">{{ $t('实时币价') }}</div>
                    </div>
                </div>
            </div>
            <div class="flex jc mt40">
                <div class="size88 bold">
                    <span class="size48">≈$</span><span v-init="stats?.private_equity_price"></span>
                </div>
            </div>
        </div>
        <div class="flex mt30">
            <div class="card card1 flex1 mr20">
                <div class="flex ac">
                    <img src="@/assets/common/usdt.png" class="img32 mr12">
                    <div class="size24 bold6">{{ assetNFTC }}</div>
                </div>
                <div class="size30 bold6 main mt10">
                    $<span v-init="stats?.nftc_price"></span>
                </div>
                <div class="size24 opc5 mt10">{{ $t('实时币价') }}</div>
            </div>
            <div class="card card1 flex1">
                <div class="flex ac">
                    <img src="@/assets/bot.png" class="img32 mr12">
                    <div class="size24 bold6">{{ assetBot }}</div>
                </div>
                <div class="size30 bold6 main mt10">
                    $<span v-init="stats?.bot_price"></span>
                </div>
                <div class="size24 opc5 mt10">{{ $t('实时币价') }}</div>
            </div>
        </div>

        <div class="line mt30"></div>

        <van-swipe class="notice" :show-indicators="false" :vertical="true" :autoplay="3000">
            <van-swipe-item v-for="item in messages">
                <div class="notice flex ac main size26 br">
                    {{ $t('恭喜') }} "{{ item.user_email }}" {{ $t('开通') }} “{{ item.product_name }}” {{ $t('一卡付全球') }}
                </div>
            </van-swipe-item>
        </van-swipe>

        <div class="bannerBox">
            <van-swipe class="bannerSwi" @change="onChange" :show-indicators="false" :autoplay="3000" v-if="banners.length>0">
                <van-swipe-item v-for="item in banners">
                    <img :src="item.img_url" class="bannerImg">
                </van-swipe-item>
            </van-swipe>
            <div class="flex ac dotbox" v-if="banners.length>0">
                <div class="dot mr6" :class="bannerCur==index?'dotAct':''" v-for="(_item,index) in banners"></div>
            </div>
            <div class="bannerGap" v-else></div>
        </div>

        <div class="news mt40 flex jb ac" @click="routerPush('/notice')">
            <img src="@/assets/home/1.png" class="img32">
            <van-swipe class="newsNotice" :show-indicators="false" :vertical="true" :autoplay="3000">
                <van-swipe-item v-for="item in noticeList">
                    <div class="newsNotice line1 size24">
                        <span @click.stop="routerPush(`/notice/${item.id}`)">{{ item.title }}</span>
                    </div>
                </van-swipe-item>
            </van-swipe>
            <img src="@/assets/home/2.png" class="img24">
        </div>

        <!-- <div class="otc mt30 flex col jc" @click="routerPush('/otc')">
            <div class="title size40 bold">{{ $t('OTC 交易') }}</div>
            <div class="size24 opc5 mt10">{{ $t('安全便捷 自由买卖') }}</div>
        </div> -->
    </div>

    <Node></Node>

    <div class="pl30 pr30 mt40 rel">

        <div class="mainCard mt40 rel">
            <div class="size34 bold5 main">{{ appName }} {{ $t('开卡') }}</div>
            <Cards></Cards>
        </div>

        <div class="flex ac mt40">
            <img src="@/assets/home/4.png" class="img48 mr10">
            <div class="main size28 bold6">{{ $t('赚币宝') }}</div>
        </div>

        <div class="card mt30">
            <div class="flex jb ac">
                <div class="tag flex ac">
                    <img src="@/assets/common/usdt.png" class="img32 mr6">
                    <div class="size24 bold6">{{ assetUSDT }}</div>
                </div>
                <div class="flex ac size24 opc5" @click="routerPush('/yueBao')">
                    <div class="mr5">{{ $t('查看明细') }}</div>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="flex ac mt30">
                <div class="flex1">
                    <div class="size40 bold6 main">
                        <CusNumber :amount="yuebao?.total_income" sizeClass="size28"></CusNumber>
                    </div>
                    <div class="size24 opc5 mt10">{{ $t('合计收益') }}</div>
                </div>
                <div class="cardLine mr60 ml60"></div>
                <div class="flex1">
                    <div class="size40 bold6 main">
                        <CusNumber :amount="yuebao?.yesterday_income" sizeClass="size28"></CusNumber>
                    </div>
                    <div class="size24 opc5 mt10">{{ $t('昨日收益') }}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="gap40"></div>

    <Popup v-model:show="show"></Popup>

    <van-popup v-model:show="showNoticePop" style="background-color: transparent !important;" overlay-class="cusMask" teleport="#app">
        <div class="popupCenter mainCard">
            <div class="size28 bold">{{ noticePopInfo.title }}</div>

            <div class="size24 opc6 mt10">{{ noticePopInfo.updated_at }}</div>

            <div class="noticecontent mt30" v-html="noticePopInfo.content"></div>

            <div class="flex ac mt60 font2 size28">
                <div class="mainBtn flex1 flex jc ac" @click="readNotice">{{ $t('知道了') }}</div>
            </div>
        </div>
    </van-popup>
</template>

<script setup lang="ts">
import { apiBanner, apiConfig, apiMessage } from '@/api/home';
import { appName, assetBot, assetNFTC, assetUSDT } from '@/config';
import { onMounted, ref } from 'vue';
import { routerPush } from '@/router';
import { useNotice } from '@/hooks/useNotice';
import Cards from './components/Cards.vue';
import CusNumber from '@/components/CusNumber/index.vue'
import { useUserStore } from '@/store';
import { apiYuebaoStats } from '@/api/yuebao';
import Popup from './components/Popup.vue';
import { storeToRefs } from 'pinia';
import { apiUserInfo } from '@/api/user';
import Node from './components/Node.vue';

const show = ref(false)

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const loadUserInfo = async () => {
    userInfo.value = await apiUserInfo()
    if(!userInfo.value?.finance_level){
        show.value = true
    }
}
loadUserInfo()

// 统计
const stats = ref()
const yuebao = ref()
const loadStats = async () => {
    stats.value = await apiConfig()
    yuebao.value = await apiYuebaoStats()
}

// 轮博图
const banners = ref<any[]>([])
const bannerCur = ref(0)
const loadBanner = async () => {
    const res:any = await apiBanner()
    banners.value = res.banners
}
const onChange = (e:number) => bannerCur.value = e

// 通知
const messages = ref()
const loadMessage = async () => {
    const res:any = await apiMessage(1)
    messages.value = res.list
}

// 公告
const { noticeList, loadNotice, loadNoticePop, showNoticePop, readNotice, noticePopInfo } = useNotice()

onMounted(()=>{
    loadStats()
    loadBanner()
    loadMessage()
    loadNotice()
    loadNoticePop()
})
</script>

<style lang="scss" scoped>
.line{
    width: 100%;
    height: 1px;
    background-color: #D9D9D933;
}
.notice{
    width: 100%;
    height: 100px;
}
.noticecontent{
    max-height: 60vh;
    width: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar{
        display: none;
    }
}
.bannerBox{
    width: 100%;
    height: 320px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 23.03%, #EFCD80 47.93%, rgba(255, 255, 255, 0.1) 76.97%);
    border-radius: 20px;
    overflow: hidden;
    padding: 1px 0 0 1px;
    position: relative;
    .bannerGap{
        width: 686px;
        height: 316px;
        border-radius: 20px;
        background-color: #000000;
    }
    .bannerSwi{
        width: 686px;
        height: 316px;
        border-radius: 20px;
        overflow: hidden;
        .bannerImg{
            width: 686px;
            height: 316px;
            border-radius: 20px;
            object-fit: cover;
        }
    }
    .dotbox{
        position: absolute;
        bottom: 20px;
        left: 40px;
        z-index: 1;
        .dot{
            width: 6px;
            height: 6px;
            border-radius: 3px;
            transition: all 0.3s;
        }
        .dotDef{
            width: 6px;
            background-color: #FFFFFF1A;
        }
        .dotAct{
            width: 30px;
            background-color: $main-color;
        }
    }
}
@property --border-angle {
    syntax: '<angle>';
    inherits: false;
    initial-value: 0deg;
}

@keyframes borderGradientAngle {
    to {
        --border-angle: 360deg;
    }
}
.topcard{
    position: relative;
    overflow: hidden;
    isolation: isolate;
    padding: 30px 30px 50px 30px;
    background: linear-gradient(100.27deg, #D3AC61 7.67%, #FFE7AB 28.43%, #D3AC61 92.33%);
    border-radius: 20px;
    color: #000000;
    // &::before{
    //     content: '';
    //     position: absolute;
    //     inset: 0;
    //     z-index: 0;
    //     pointer-events: none;
    //     padding: 2px;
    //     border-radius: inherit;
    //     background:
    //         conic-gradient(from var(--border-angle), transparent 0deg, transparent 38deg, rgba(255, 255, 255, 0.1) 52deg, #EFCD80 72deg, #FFE5A5 92deg, #EFCD80 112deg, rgba(255, 255, 255, 0.1) 132deg, transparent 150deg, transparent 360deg),
    //         linear-gradient(52.79deg, rgba(255, 255, 255, 0.1) 21.58%, rgba(239, 205, 128, 0.45) 47.81%, rgba(255, 255, 255, 0.1) 78.42%);
    //     animation: borderGradientAngle 4.8s linear infinite;
    //     mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    //     mask-composite: exclude;
    //     -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    //     -webkit-mask-composite: xor;
    // }
    // > *{
    //     position: relative;
    //     z-index: 1;
    // }
    .logo{
        width: 88px;
        height: 88px;
        flex: 0 0 88px;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.18);
        .logoImg{
            position: relative;
            z-index: 0;
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        &::before{
            content: '';
            position: absolute;
            inset: 0;
            z-index: 1;
            pointer-events: none;
            border-radius: inherit;
            background:
                radial-gradient(circle at 30% 16%, rgba(255, 255, 255, 0.45) 0 13%, rgba(255, 255, 255, 0.18) 24%, transparent 44%),
                linear-gradient(145deg, rgba(255, 255, 255, 0.16) 0%, transparent 46%);
            mix-blend-mode: screen;
            opacity: 0.42;
        }
        &::after{
            content: '';
            position: absolute;
            z-index: 2;
            top: -28%;
            bottom: -28%;
            left: -85%;
            width: 76%;
            pointer-events: none;
            background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 14%, rgba(255, 255, 255, 0.62) 50%, rgba(255, 229, 165, 0.22) 66%, transparent 100%);
            transform: rotate(22deg);
            filter: blur(1px);
            opacity: 0;
            animation: logoShine 5s ease-in-out infinite;
        }
    }
}

@keyframes logoShine {
    0%, 34% {
        left: -85%;
        opacity: 0;
    }
    45% {
        opacity: 0.72;
    }
    66% {
        left: 118%;
        opacity: 0.48;
    }
    67%, 100% {
        left: 118%;
        opacity: 0;
    }
}
.news{
    height: 72px;
    border-radius: 36px;
    padding: 0 24px;
    background: linear-gradient(#FFFFFF66, #00000000 50%);
    box-shadow: 0px 4px 10px 0px #00000099 inset, 0px -4px 10px 0px #FFFFFF40 inset;
    backdrop-filter: blur(10px);
    border: 1px solid transparent;
    position: relative;
    &::before{
        content: '';
        position: absolute;
        z-index: -1;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border-radius: 36px;
        background: linear-gradient(#8F8F8F, #000000);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: xor;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        padding: 1px;
    }

    .newsNotice{
        width: 550px;
        height: 50px;
        line-height: 50px;
    }
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
    .cardLine{
        width: 1px;
        height: 80px;
        background-color: #FFFFFF33;
    }
}
.card1{
    padding: 15px;
    border-radius: 20px;
    &::before{
        border-radius: 20px;
    }
}
.otc{
    height: 190px;
    background-image: url("@/assets/user/41.png");
    background-size: 100% 100%;
    padding-left: 210px;
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    .title{
        display: inline-block;
        background: linear-gradient(281.88deg, #FFF1BF 24.66%, #FFF1BF 37.09%, #FFCD48 39.28%, #FFF1BF 59.99%, #FFCD48 64.38%, #FFF1BF 75.34%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
    }
    &::after{
        content: '';
        position: absolute;
        top: -35%;
        left: -35%;
        width: 26%;
        height: 170%;
        pointer-events: none;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 241, 191, 0.5), rgba(255, 255, 255, 0));
        transform: rotate(18deg);
        filter: blur(2px);
        animation: otcShine 4s linear infinite;
    }
}

@keyframes otcShine {
    0% {
        left: -35%;
        opacity: 0;
    }
    10% {
        opacity: 0.9;
    }
    34% {
        left: 115%;
        opacity: 0.8;
    }
    35%, 100% {
        left: 115%;
        opacity: 0;
    }
}
</style>
