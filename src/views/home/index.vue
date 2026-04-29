<template>
    <img src="@/assets/login/bg.png" class="pagebg animate__animated animate__slideInDown">

    <div class="rel pt30 pl30 pr30">
        
        <div class="flex">
            <div class="card flex1 mr20">
                <div class="flex ac">
                    <img src="@/assets/common/aix.png" class="img52 mr12">
                    <div class="size24 bold6">{{ assetAIX }}</div>
                </div>
                <div class="size40 bold6 main mt30">
                    $<span v-init="stats?.aix_price"></span>
                </div>
                <div class="size24 opc5 mt10">{{ $t('实时币价') }}</div>
            </div>
            <div class="card flex1">
                <div class="flex ac">
                    <img src="@/assets/common/usdt.png" class="img52 mr12">
                    <div class="size24 bold6">{{ assetNFTC }}</div>
                </div>
                <div class="size40 bold6 main mt30">
                    $<span v-init="stats?.nftc_price"></span>
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
</template>

<script setup lang="ts">
import { apiBanner, apiConfig, apiMessage } from '@/api/home';
import { appName, assetAIX, assetNFTC, assetUSDT } from '@/config';
import { onMounted, ref } from 'vue';
import { routerPush } from '@/router';
import { useNotice } from '@/hooks/useNotice';
import Cards from './components/Cards.vue';
import CusNumber from '@/components/CusNumber/index.vue'
import { useUserStore } from '@/store';
import { apiYuebaoStats } from '@/api/yuebao';
import Popup from './components/Popup.vue';

const show = ref(false)

const userStore = useUserStore()
userStore.loadUserInfo()

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
const { noticeList, loadNotice } = useNotice()

onMounted(()=>{
    loadStats()
    loadBanner()
    loadMessage()
    loadNotice()
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
</style>