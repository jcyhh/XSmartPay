<template>
    <CusNav :title="$t('提现')">
        <div class="tr size26" @click="routerPush('/user/withdraw/record')">{{ $t('记录') }}</div>
    </CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="cell card mb20 flex jb ac" @click="pickerShow=true">
            <div class="size28 main">{{ $t('币种') }}</div>
            <div class="size28 bold6 flex ac">
                <img :src="currentPicker.icon" class="img48 mr10">
                <div class="mr10">{{ currentPicker.name }}</div>
                <div class="opc5">
                    <van-icon name="arrow" />
                </div>
            </div>
        </div>

        <div class="mt30">
            <div class="size28 bold6">{{ $t('提现地址') }}</div>
            <div class="cell card mb20 flex jb ac mt20">
                <input type="text" v-model="address" :placeholder="$t('请输入提现地址')" class="flex1 size28">
            </div>
        </div>

        <div class="flex jb ac mt30">
            <div class="size28 bold6">{{ $t('提现金额') }}</div>
            <div class="size24">
                <span class="opc5 mr10">{{ $t('可用余额') }}</span>
                <span class="main mr5">
                    <span v-if="pickerCurrent==0" v-init="userInfo?.balance_usdt"></span>
                    <span v-else-if="pickerCurrent==1" v-init="userInfo?.balance_aix"></span>
                    <span v-else v-init="userInfo?.balance_nftc"></span>
                </span>
                <span class="main">{{ currentPicker.name }}</span>
            </div>
        </div>
        <div class="cell card mb20 flex jb ac mt20">
            <input type="number" v-model="inputAmount" :placeholder="$t('请输入提现金额')" class="flex1 size28">
            <div class="bold6" @click="inputAll">{{ $t('全部') }}</div>
        </div>

        <div class="size28 bold6 mt30">{{ $t('支付密码') }}</div>
        <div class="cell card mb20 flex jb ac mt20">
            <input type="password" v-model="pay_password" :placeholder="$t('请输入支付密码')" class="flex1 size28">
        </div>

        <div class="flex jb ac mt30">
            <div class="size28 bold6">{{ $t('到账金额') }}</div>
            <div class="size24">
                <span class="opc5 mr10">{{ $t('手续费') }}</span>
                <span class="main">{{ fee }}%</span>
            </div>
        </div>
        <div class="cell card mb20 flex jb ac mt20 bold6">
            <div v-init="realAmount"></div>
            <div>{{ currentPicker.name }}</div>
        </div>

    </div>

    <div class="safeArea"></div>
    <div class="gap130"></div>
    <div class="bottom">
        <div class="mainBtn size28 bold6 flex jc ac" @click="submit">{{ $t('确认') }}</div>
        <div class="safeArea"></div>
    </div>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" @change="$event=>pickerCurrent=$event">
        <template v-slot="{ item }">
            <div class="flex jc ac">
                <img :src="item.icon" class="img48 mr10">
                <div class="size28 bold5">{{ item.name }}</div>
            </div>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { assetAIX, assetNFTC, assetUSDT } from '@/config'
import { computed, onMounted, ref } from 'vue'
import CusPicker from '@/components/CusPicker/index.vue';
import iconUsdt from '@/assets/common/usdt.png'
import iconAix from '@/assets/common/aix.png'
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { apiWithdraw, apiWithdrawConfig } from '@/api/user';
import { message } from '@/utils/message';
import { t } from '@/locale';
import { routerPush, routerReplace } from '@/router';
import { computedDiv, computedMul, computedSub } from '@/utils';

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const config = ref()
const fee = computed(()=>{
    if(pickerCurrent.value==0)return config.value?.withdraw_usdt_fee
    else if(pickerCurrent.value==1)return config.value?.withdraw_aix_fee
    else return config.value?.withdraw_nftc_fee
})
const loadData = async () => config.value = await apiWithdrawConfig()

const pickerCurrent = ref(0)
const pickerShow = ref(false)
const pickerList = [
    {name:assetUSDT, icon: iconUsdt, value:'balance_usdt'},
    {name:assetAIX, icon: iconAix, value:'balance_aix'},
    {name:assetNFTC, icon: iconUsdt, value:'balance_nftc'}
]
const currentPicker = computed(()=>pickerList[pickerCurrent.value])

const inputAmount = ref()
const pay_password = ref()
const address = ref()
const inputAll = () => {
    if(pickerCurrent.value==0){
        const amount = userInfo.value?.balance_usdt
        inputAmount.value = Number(amount)
    }else if(pickerCurrent.value==1){
        const amount = userInfo.value?.balance_aix
        inputAmount.value = Number(amount)
    }else{
        const amount = userInfo.value?.balance_nftc
        inputAmount.value = Number(amount)
    }
}

const realAmount = computed(()=>{
    if(inputAmount.value && fee.value){
        const amt = inputAmount.value
        const feeRate = computedDiv(fee.value, 100)
        const totalFee = computedMul(feeRate, amt)
        const result = computedSub(amt, totalFee)
        return result
    }else{
        return 0
    }
})

const submit = async () => {
    if(!address.value)return message(t('请输入提现地址'))
    if(!inputAmount.value)return message(t('请输入提现金额'))
    if(!pay_password.value)return message(t('请输入支付密码'))
    await apiWithdraw({
        address: address.value,
        amount: inputAmount.value,
        ccy: currentPicker.value.value,
        pay_password: pay_password.value
    })
    message(t('提交成功'), 'success')
    setTimeout(() => {
        routerReplace('/user/withdraw/record')
    }, 1200);
}

onMounted(()=>{
    userStore.loadUserInfo()
    loadData()
})
</script>

<style lang="scss" scoped>
.card{
    border-radius: 20px;
    padding: 30px;
    &::before{
        border-radius: 20px;
    }
}
.bottom{
    width: 100vw;
    padding: 20px 30px 30px 30px;
    background-color: #040404;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}
</style>