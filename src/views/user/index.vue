<template>
    <img src="@/assets/login/bg.png" class="pagebg animate__animated animate__slideInDown">
    <div class="pl30 pr30 pt60 rel">
        
        <div class="flex jb ac">
            <div class="flex ac">
                <img src="@/assets/user/1.png" class="img110 mr24">
                <div v-if="isH5">
                    <div class="size32 bold" v-init:address="userInfo?.address"></div>
                    <div class="flex mt20" v-if="!userInfo?.email">
                        <div class="mainButton flex jc ac bindTag" @click="routerPush('/bindEmail')">{{ $t('绑定邮箱') }}</div>
                    </div>
                </div>
                <div v-else>
                    <div class="size32 bold" v-init:address="userInfo?.email"></div>
                    <div class="flex mt20" v-if="!userInfo?.address">
                        <div class="mainButton flex jc ac bindTag" @click="routerPush('/bindAddress')">{{ $t('绑定钱包') }}</div>
                    </div>
                </div>
            </div>
            <img src="@/assets/user/2.png" class="img56 animate__animated animate__zoomIn" @click="routerPush('/setting')">
        </div>

        <div class="top mt50" @click="routerPush('/cardbag')">
            <div class="flex jb ac">
                <div class="size30 bold5">{{ $t('抢购订单') }}</div>
                <div class="flex ac size24 opc5">
                    <div class="mr5">{{ $t('查看全部') }}</div>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="gap150"></div>
            <div class="bannerBox">
                <Banner></Banner>
            </div>
        </div>

        <div class="cell mt30" @click="show=true" v-if="userInfo?.finance_level">
            <div class="gap10"></div>
            <div class="flex jb ac pl10 pr10">
                <div class="flex ac">
                    <img src="@/assets/user/40.png" class="img30 mr20">
                    <div class="size28">{{ $t('理财档位') }}</div>
                </div>
                <div class="main flex ac">
                    <div class="size28 main mr10">{{ userInfo?.finance_level?.name }}</div>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="gap10"></div>
        </div>

        <div class="mainCard mt30" @click="routerPush('/user/asset')">
            <div class="flex jb ac">
                <div class="size30 bold5 main">{{ $t('资产预览') }}</div>
                <div class="flex ac size24 opc5">
                    <div class="mr5">{{ $t('查看明细') }}</div>
                    <van-icon name="arrow" />
                </div>
            </div>
            <div class="flex mt40">
                <div class="flex1">
                    <div class="size28" v-init="userInfo?.balance_aix"></div>
                    <div class="size24 opc5 mt10">{{ assetAIX }} {{ $t('余额') }}</div>
                </div>
                <div class="flex1 ml30">
                    <div class="size28" v-init="userInfo?.balance_nftc"></div>
                    <div class="size24 opc5 mt10">{{ assetNFTC }} {{ $t('余额') }}</div>
                </div>
                <div class="flex1">
                    <div class="size28" v-init="userInfo?.balance_usdt"></div>
                    <div class="size24 opc5 mt10">{{ assetUSDT }} {{ $t('余额') }}</div>
                </div>
            </div>
            <div class="flex mt30">
                <div class="flex1">
                    <div class="size28" v-init="userInfo?.balance_lottery_aix"></div>
                    <div class="size24 opc5 mt10">{{ $t('抽奖') }} {{ assetAIX }}</div>
                </div>
                <div class="flex1 ml30">
                    <div class="size28" v-init="userInfo?.balance_year"></div>
                    <div class="size24 opc5 mt10">{{ $t('年终奖') }}</div>
                </div>
                <div class="flex1"></div>
            </div>
        </div>

        <div class="mt20 flex jb ac size26 main">
            <div class="item flex col jc ac" @click="routerPush('/user/recharge')">
                <img src="@/assets/user/3.png" class="img40">
                <div class="mt20">{{ $t('充值') }}</div>
            </div>
            <div class="item flex col jc ac ml20 mr20" @click="routerPush('/user/withdraw')">
                <img src="@/assets/user/4.png" class="img40">
                <div class="mt20">{{ $t('提现') }}</div>
            </div>
            <div class="item flex col jc ac" @click="routerPush('/user/transfer')">
                <img src="@/assets/user/5.png" class="img40">
                <div class="mt20">{{ $t('转账') }}</div>
            </div>
        </div>

        <div class="mt40 size34 bold6 main">{{ $t('常用功能') }}</div>

        <div class="cell flex jb ac mt30" @click="routerPush('/community/my')">
            <div class="flex ac">
                <img src="@/assets/user/7.png" class="img64 mr20">
                <div class="size28">{{ $t('我的社区') }}</div>
            </div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>

        <div class="cell flex jb ac mt20" @click="routerPush('/community')">
            <div class="flex ac">
                <img src="@/assets/user/8.png" class="img64 mr20">
                <div class="size28">{{ $t('全网社区') }}</div>
            </div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>

        <div class="cell flex jb ac mt20" @click="routerPush('/news/my')">
            <div class="flex ac">
                <img src="@/assets/user/9.png" class="img64 mr20">
                <div class="size28">{{ $t('我的发布') }}</div>
            </div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>

        <div class="cell flex jb ac mt20" @click="routerPush('/team')">
            <div class="flex ac">
                <img src="@/assets/user/10.png" class="img64 mr20">
                <div class="size28">{{ $t('团队') }}</div>
            </div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>

        <div class="cell flex jb ac mt20" @click="routerPush('/user/order')">
            <div class="flex ac">
                <img src="@/assets/user/11.png" class="img64 mr20">
                <div class="size28">{{ $t('释放订单') }}</div>
            </div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>

        <div class="cell flex jb ac mt20" @click="routerPush('/cardholder')">
            <div class="flex ac">
                <img src="@/assets/user/12.png" class="img64 mr20">
                <div class="size28">{{ $t('持卡人管理') }}</div>
            </div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>

    </div>

    <div class="gap40"></div>

    <Popup v-model:show="show"></Popup>
</template>

<script setup lang="ts">
import { assetAIX, assetNFTC, assetUSDT } from '@/config';
import Banner from './components/Banner.vue';
import { routerPush } from '@/router';
import { useAppStore, useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import Popup from '@/views/home/components/Popup.vue';
import { ref } from 'vue';

const appStore = useAppStore()
const { isH5 } = storeToRefs(appStore)

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
userStore.loadUserInfo()

const show = ref(false)
</script>

<style lang="scss" scoped>
.top{
    border-radius: 30px;
    padding: 30px;
    background: linear-gradient(100.27deg, #D3AC61 7.67%, #FFE7AB 28.43%, #D3AC61 92.33%);
    color: #000000;
    position: relative;
    .bannerBox{
        width: 100vw;
        height: 120px;
        position: absolute;
        bottom: 30px;
        left: -30px;
        z-index: 1;
    }
}
.item{
    flex: 1;
    height: 140px;
    background: linear-gradient(180deg, rgba(255, 229, 165, 0.12) 0%, rgba(255, 229, 165, 0.04) 100%);
    border-radius: 20px;
}
.bindTag{
    font-size: 22px;
    height: 48px;
    padding: 0 20px;
}
</style>