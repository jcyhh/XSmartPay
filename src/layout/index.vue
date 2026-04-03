<template>
    <div class="head flex jb ac">
        <div class="flex ac">
            <img src="@/assets/tabbar/logo.png" class="logo">
            <div class="size24 bold ml10">{{ appName }}</div>
        </div>
        <div class="flex ac">
            <div class="flex ac level mr20 animate__animated animate__zoomIn ani5" v-if="userInfo?.is_council">
                <img src="@/assets/tabbar/level.png" class="img44 mr8">
                <div class="linearTxt size20 bold">{{ $t('理事会') }}</div>
            </div>
            <img src="@/assets/common/lang.png" class="img52" @click="show=true">
        </div>
    </div>
    <div class="gap100"></div>

    <div class="content">
        <RouterView></RouterView>
    </div>

    <div class="gap100"></div>
    <div class="safeArea"></div>
    <div class="tabbar">
        <div class="bar flex ac">

            <div class="flex1 flex col ac" v-for="item in tabbar" @click="routerReplace(item.path)">
                <img :src="currentRoute==item.path ? item.iconAct : item.icon" class="img44">
                <div class="size24 mt4 tc" :class="currentRoute==item.path?'main':''">{{ item.name }}</div>
            </div>
        </div>
        <div class="safeArea"></div>
    </div>

    <CusLang v-model:show="show"></CusLang>
</template>

<script setup lang="ts">
import CusLang from '@/components/CusLang/index.vue';
import { computed, ref } from 'vue';
import { appName } from '@/config';
import { useRoute } from 'vue-router';
import homeIcon from '@/assets/tabbar/home.png'
import homeActIcon from '@/assets/tabbar/homeAct.png'
import payIcon from '@/assets/tabbar/pay.png'
import payActIcon from '@/assets/tabbar/payAct.png'
import cardIcon from '@/assets/tabbar/card.png'
import cardActIcon from '@/assets/tabbar/cardAct.png'
import userIcon from '@/assets/tabbar/user.png'
import userActIcon from '@/assets/tabbar/userAct.png'
import newsIcon from '@/assets/tabbar/news.png'
import newsActIcon from '@/assets/tabbar/newsAct.png'
import { t } from '@/locale';
import { routerReplace } from '@/router';
import { useAppStore, useUserStore } from '@/store';
import { storeToRefs } from 'pinia';

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const appStore = useAppStore()
const { lang } = storeToRefs(appStore)

const tabbarLocaleMap: Record<string, { home: string; pay: string; draw: string; forum: string; mine: string }> = {
    zh: { home: '首页', pay: '支付', draw: '抢卡', forum: '论坛', mine: '我的' },
    hk: { home: '首頁', pay: '支付', draw: '搶卡', forum: '論壇', mine: '我的' },
    en: { home: 'Home', pay: 'Pay', draw: 'Card', forum: 'Forum', mine: 'Me' },
    ko: { home: '홈', pay: '결제', draw: '카드', forum: '포럼', mine: '내정보' },
    ja: { home: 'ホーム', pay: '決済', draw: 'カード', forum: '掲示板', mine: 'マイ' },
    ru: { home: 'Дом', pay: 'Оплата', draw: 'Карта', forum: 'Форум', mine: 'Мой' },
    ma: { home: 'Utama', pay: 'Bayar', draw: 'Kad', forum: 'Forum', mine: 'Saya' },
    id: { home: 'Home', pay: 'Bayar', draw: 'Kartu', forum: 'Forum', mine: 'Saya' },
    vi: { home: 'Home', pay: 'Pay', draw: 'Thẻ', forum: 'Forum', mine: 'Tôi' },
    hi: { home: 'होम', pay: 'पे', draw: 'कार्ड', forum: 'फोरम', mine: 'मेरी' }
}

const tabbarText = computed(() => tabbarLocaleMap[lang.value] || {
    home: t('首页'),
    pay: t('全球付'),
    draw: t('抢卡'),
    forum: t('论坛'),
    mine: t('我的')
})

const tabbar = computed(()=>([
    {
        name: tabbarText.value.home,
        icon: homeIcon,
        iconAct: homeActIcon,
        path: '/home/index'
    },
    {
        name: tabbarText.value.pay,
        icon: payIcon,
        iconAct: payActIcon,
        path: '/pay/index'
    },
    {
        name: tabbarText.value.draw,
        icon: cardIcon,
        iconAct: cardActIcon,
        path: '/draw/index'
    },
    {
        name: tabbarText.value.forum,
        icon: newsIcon,
        iconAct: newsActIcon,
        path: '/news/index'
    },
    {
        name: tabbarText.value.mine,
        icon: userIcon,
        iconAct: userActIcon,
        path: '/user/index'
    }
]))

const show = ref(false)

const route = useRoute()
const currentRoute = computed(()=> route.fullPath)
</script>

<style lang="scss" scoped>
.head {
    width: 100vw;
    height: 100px;
    background-color: #FFFFFF0A;
    z-index: 10;
    padding: 0 30px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    .logo{
        width: 40px;
        height: 30px;
    }

    .level{
        height: 52px;
        border-radius: 26px;
        padding: 0 12px;
        background-color: #F6F6F61A;
        position: relative;
        &::before{
            content: '';
            position: absolute;
            z-index: -1;
            top: -1px;
            left: -1px;
            right: -1px;
            bottom: -1px;
            border-radius: 26px;
            background: linear-gradient(#666666, #F0CC7F);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: xor;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            padding: 1px;
        }
    }
}
.tabbar{
    width: 100vw;
    background: linear-gradient(#000000, #222222);
    position: fixed;
    bottom: 0;
    left: 0;
    border: 1px solid transparent;
    z-index: 10;
    border-radius: 30px 30px 0 0;
    &::before{
        content: '';
        position: absolute;
        z-index: -1;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border-radius: 30px 30px 0 0;
        background: linear-gradient(rgba(255, 255, 255, 0.2), #FFFFFF00);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: xor;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        padding: 1px;
    }
    .bar{
        height: 100px;
    }
}
.tc{
    max-width: 100%;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>