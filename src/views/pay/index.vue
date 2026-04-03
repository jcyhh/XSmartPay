<template>
    <img src="@/assets/login/bg.png" class="pagebg animate__animated animate__slideInDown">
    
    <Banner></Banner>

    <div class="gap200"></div>
    <div class="gap200"></div>
    <div class="pl30 pr30 mt84 rel">
        
        <div class="flex jc">
            <div class="title size80 bold">{{ $t('全球付') }}</div>
        </div>
        <div class="size24 lh40 tc mt20">
            <div>{{ $t('一卡连通世界，支付随心而行') }}</div>
            <div>{{ $t('全球付让每一笔交易都安全便捷') }}</div>
        </div>
        <div class="search mt80 flex ac" @click="routerPush('/pay/remittance')">
            <img src="@/assets/pay/1.png" class="img32 mr16">
            <div class="gray size28">{{ $t('请输入') }}</div>
        </div>
        <div class="gap20"></div>
        
        <div class="flex jb mt40" v-for="(row, rowIndex) in flagRows" :key="rowIndex" :class="{ mt40: rowIndex > 0 }">
            <div class="tc" v-for="item in row" :key="item.code">
                <img :src="item.flag" class="flag">
                <div class="size20 mt12">{{ item.code }}</div>
            </div>
        </div>

        <div class="flex ac mt80 size28 bold6 main">
            <div class="flex1 mainButton btn flex jc ac" v-scale @click="routerPush('/pay/remittance')">{{ $t('全球付') }}</div>
            <div class="flex1 mainButton btn flex jc ac ml15 mr15" v-scale @click="routerPush('/physical')">{{ $t('实体卡') }}</div>
            <div class="flex1 mainButton btn flex jc ac" v-scale @click="routerPush('/virtual')">{{ $t('虚拟卡') }}</div>
        </div>

    </div>

    <div class="gap60"></div>
</template>

<script setup lang="ts">
import Banner from './components/Banner.vue'
import flag1 from '@/assets/pay/flag1.png'
import flag2 from '@/assets/pay/flag2.png'
import flag3 from '@/assets/pay/flag3.png'
import flag4 from '@/assets/pay/flag4.png'
import flag5 from '@/assets/pay/flag5.png'
import flag6 from '@/assets/pay/flag6.png'
import flag7 from '@/assets/pay/flag7.png'
import flag8 from '@/assets/pay/flag8.png'
import flag9 from '@/assets/pay/flag9.png'
import flag10 from '@/assets/pay/flag10.png'
import flag11 from '@/assets/pay/flag11.png'
import flag12 from '@/assets/pay/flag12.png'
import { routerPush } from '@/router'

const flagRows = [
    [
        { flag: flag1, code: 'CN' },
        { flag: flag2, code: 'US' },
        { flag: flag3, code: 'IN' },
        { flag: flag4, code: 'VN' },
        { flag: flag5, code: 'SG' },
        { flag: flag6, code: 'UK' }
    ],
    [
        { flag: flag7, code: 'TH' },
        { flag: flag8, code: 'UAE' },
        { flag: flag9, code: 'ID' },
        { flag: flag10, code: 'CA' },
        { flag: flag11, code: 'JP' },
        { flag: flag12, code: 'HK' }
    ]
]
</script>

<style lang="scss" scoped>
.title{
    display: inline-block;
    background: linear-gradient(67.12deg, #EEFFF5 9.09%, #EFCD80 29.55%, #EEFFF5 54.09%, #EFCD80 74.54%, #FFFFFF 90.91%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}
.search{
    height: 80px;
    border-radius: 40px;
    background-color: #FFFFFF;
    padding: 0 30px;
}
.flag{
    width: 100px;
    height: 68px;
}
.btn{
    height: 86px;
    border-radius: 43px;
}
</style>