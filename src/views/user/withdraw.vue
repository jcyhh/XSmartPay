<template>
    <CusNav :title="$t('提现')">
        <div class="tr size26" @click="routerPush('/user/withdraw/record')">{{ $t('记录') }}</div>
    </CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="cell card mb20 flex jb ac" @click="showPickerClain=true">
            <div class="size28 main">{{ $t('链') }}</div>
            <div class="flex ac">
                <div class="size28 bold6 mr10" v-if="currentChain">{{ currentChain.name }}</div>
                <div class="size28 mr10 opc6" v-else>{{ t('请选择网络') }}</div>
                <van-icon name="arrow" class="opc6" />
            </div>
        </div>

        <div class="cell card mb20 flex jb ac" @click="openPicker">
            <div class="size28 main">{{ $t('币种') }}</div>
            <div class="size28 bold6 flex ac">
                <template v-if="currentPicker">
                    <img :src="currentPicker.icon" class="img48 mr10">
                    <div class="mr10">{{ currentPicker.name }}</div>
                </template>
                <div class="mr10 opc6" v-else>{{ t('请选择币种') }}</div>
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
                    <span v-init="availableBalance"></span>
                </span>
                <span class="main">{{ currentPicker?.name || '--' }}</span>
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
            <!-- <div class="size24">
                <span class="opc5 mr10">{{ $t('手续费') }}</span>
                <span class="main">{{ fee }}%</span>
            </div> -->
        </div>
        <div class="cell card mb20 flex jb ac mt20 bold6">
            <div v-init="realAmount"></div>
            <div>{{ currentPicker?.name || '--' }}</div>
        </div>
        <div class="main opc8 size24 lh40" v-if="fee>0">
            {{ $t('向 Xsmartpay 系统内充值地址提现仅参与理财') }}<br>
            {{ $t('向 Xsmartpay 系统外地址提现额外扣去') }} {{ fee }}%
        </div>

    </div>

    <div class="safeArea"></div>
    <div class="gap130"></div>
    <div class="bottom">
        <div class="mainBtn size28 bold6 flex jc ac" @click="submit">{{ $t('确认') }}</div>
        <div class="safeArea"></div>
    </div>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" allow-empty @change="onPickerChange">
        <template v-slot="{ item }">
            <div class="flex jc ac">
                <img :src="item.icon" class="img48 mr10">
                <div class="size28 bold5">{{ item.name }}</div>
            </div>
        </template>
    </CusPicker>

    <CusPicker v-model:show="showPickerClain" :list="pickerClainList" :title="$t('请选择')" :default-index="pickerClainCurrent" allow-empty @change="onChainChange">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.name }}</span>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { assetAIX, assetBot, assetNFTC, assetUSDT } from '@/config'
import { computed, onMounted, ref } from 'vue'
import CusPicker from '@/components/CusPicker/index.vue';
import iconUsdt from '@/assets/common/usdt.png'
import iconAix from '@/assets/common/aix.png'
import iconBot from '@/assets/bot.png'
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
    if(currentPicker.value?.value === 'balance_usdt')return config.value?.withdraw_usdt_fee || 0
    else if(currentPicker.value?.value === 'balance_aix')return config.value?.withdraw_aix_fee || 0
    else if(currentPicker.value?.value === 'balance_nftc') return config.value?.withdraw_nftc_fee || 0
    else if(currentPicker.value?.value === 'balance_bot') return config.value?.withdraw_bot_fee || 0
    return 0
})
const loadData = async () => config.value = await apiWithdrawConfig()

const showPickerClain = ref(false)
const pickerClainCurrent = ref(-1)
const pickerClainList = [
    {name:'BEP20'},
    {name:'BOT'}
]
const currentChain = computed(() => pickerClainCurrent.value >= 0 ? pickerClainList[pickerClainCurrent.value] : null)
const onChainChange = (index: number) => {
    if(pickerClainCurrent.value !== index)pickerCurrent.value = -1
    pickerClainCurrent.value = index
}

const pickerCurrent = ref(-1)
const pickerShow = ref(false)
const assetList = [
    {name:assetUSDT, icon: iconUsdt, value:'balance_usdt', chain: 'BEP20'},
    {name:assetAIX, icon: iconAix, value:'balance_aix', chain: 'BEP20'},
    {name:assetNFTC, icon: iconUsdt, value:'balance_nftc', chain: 'BEP20'},
    {name:assetBot, icon: iconBot, value:'balance_bot', chain: 'BOT'}
]
const pickerList = computed(()=>currentChain.value ? assetList.filter(item => item.chain === currentChain.value?.name) : [])
const currentPicker = computed(()=>pickerCurrent.value >= 0 ? pickerList.value[pickerCurrent.value] : null)
const availableBalance = computed(()=>currentPicker.value ? (userInfo.value as any)?.[currentPicker.value.value] : 0)
const openPicker = () => {
    if(!currentChain.value)return
    pickerShow.value = true
}
const onPickerChange = (index: number) => {
    pickerCurrent.value = index
}

const inputAmount = ref()
const pay_password = ref()
const address = ref()
const inputAll = () => {
    if(!currentPicker.value)return message(t('请选择币种'))
    inputAmount.value = Number(availableBalance.value)
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
    if(!currentChain.value)return message(t('请选择网络'))
    if(!currentPicker.value)return message(t('请选择币种'))
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
