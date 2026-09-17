<template>
    <CusNav :title="$t('划转')">
        <div class="tr size26" @click="routerPush('/user/crossTransfer/record')">{{ $t('记录') }}</div>
    </CusNav>
    <div class="pl30 pr30 pt30 rel">
        <div class="cell card mb20 flex jb ac" @click="pickerShow=true">
            <div class="size28 main">{{ $t('币种') }}</div>
            <div class="size28 bold6 flex ac">
                <img :src="currentPicker.icon" class="img48 mr10">
                <div class="mr10">{{ currentPicker.name }}</div>
                <div class="opc5"><van-icon name="arrow" /></div>
            </div>
        </div>

        <div class="mt30">
            <div class="size28 bold6">{{ $t('转账账号') }}</div>
            <div class="cell card mb20 flex jb ac mt20">
                <input v-model="to_account" type="text" autocomplete="off" :placeholder="$t('请输入转账邮箱或地址')" class="flex1 size28">
            </div>
        </div>

        <div class="flex jb ac mt30">
            <div class="size28 bold6">{{ $t('转账金额') }}</div>
            <div class="size24">
                <span class="opc5 mr10">{{ $t('可用余额') }}</span>
                <span class="main mr5" v-init="availableBalance"></span>
                <span class="main">{{ currentPicker.name }}</span>
            </div>
        </div>
        <div class="cell card mb20 flex jb ac mt20">
            <input v-model="inputAmount" type="number" :placeholder="$t('请输入转账金额')" class="flex1 size28">
            <div class="bold6" @click="inputAll">{{ $t('全部') }}</div>
        </div>

        <div class="size28 bold6 mt30">{{ $t('支付密码') }}</div>
        <div class="cell card mb20 flex jb ac mt20">
            <input v-model="pay_password" type="password" inputmode="numeric" maxlength="6" autocomplete="one-time-code" :placeholder="$t('请输入支付密码')" class="flex1 size28">
        </div>

        <div class="flex jb ac mt30">
            <div class="size28 bold6">{{ $t('到账金额') }}</div>
            <div class="size24">
                <span class="opc5 mr10">{{ $t('手续费') }}</span>
                <span class="main">{{ currentPicker.fee }}%</span>
            </div>
        </div>
        <div class="cell card mb20 flex jb ac mt20 bold6">
            <div v-init="receiveAmount"></div>
            <div>{{ currentPicker.name }}</div>
        </div>
    </div>

    <div class="safeArea"></div>
    <div class="gap130"></div>
    <div class="bottom">
        <div class="mainBtn size28 bold6 flex jc ac" @click="submit">{{ $t('确认') }}</div>
        <div class="safeArea"></div>
    </div>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" @change="pickerCurrent=$event">
        <template v-slot="{ item }">
            <div class="flex jc ac">
                <img :src="item.icon" class="img48 mr10">
                <div class="size28 bold5">{{ item.name }}</div>
            </div>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import CusNav from '@/components/CusNav/index.vue'
import CusPicker from '@/components/CusPicker/index.vue'
import { assetAIX, assetUSDT } from '@/config'
import iconUsdt from '@/assets/common/usdt.png'
import iconAix from '@/assets/common/aix.png'
import { useUserStore } from '@/store'
import { apiCrossTransfer, apiCrossTransferConfig } from '@/api/user'
import { routerPush } from '@/router'
import { message } from '@/utils/message'
import { t } from '@/locale'
import { computedDiv, computedMul, computedSub } from '@/utils'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const to_account = ref()
const inputAmount = ref()
const pay_password = ref()
const pickerCurrent = ref(0)
const pickerShow = ref(false)
const pickerList = [
    { name: assetUSDT, icon: iconUsdt, value: 'balance_usdt', fee: 0 },
    { name: assetAIX, icon: iconAix, value: 'balance_aix', fee: 0 }
]
const currentPicker = computed(() => pickerList[pickerCurrent.value])
const availableBalance = computed(() => (userInfo.value as any)?.[currentPicker.value.value] || 0)
const receiveAmount = computed(() => {
    const amount = Number(inputAmount.value || 0)
    const fee = Number(currentPicker.value.fee || 0)
    if (!Number.isFinite(amount) || amount <= 0) return '0.00'
    if (!Number.isFinite(fee) || fee <= 0) return `${amount}`
    return `${computedSub(amount, computedDiv(computedMul(amount, fee), 100))}`
})

const inputAll = () => inputAmount.value = Number(availableBalance.value)
const loadData = async () => {
    const res: any = await apiCrossTransferConfig()
    pickerList[0].fee = res.cross_transfer_usdt_fee || 0
    pickerList[1].fee = res.cross_transfer_aix_fee || 0
}
const submit = async () => {
    if (!to_account.value) return message(t('请输入转账账号'))
    if (!inputAmount.value) return message(t('请输入转账金额'))
    if (!pay_password.value) return message(t('请输入支付密码'))
    await apiCrossTransfer({
        ccy: currentPicker.value.value,
        to_account: to_account.value,
        amount: inputAmount.value,
        pay_password: pay_password.value
    })
    message(t('提交成功'), 'success')
    to_account.value = ''
    inputAmount.value = ''
    pay_password.value = ''
}

loadData()

onMounted(() => {
    userStore.loadUserInfo()
})
</script>

<style lang="scss" scoped>
.card {
    border-radius: 20px;
    padding: 30px;
    &::before { border-radius: 20px; }
}
.bottom {
    width: 100vw;
    padding: 20px 30px 30px 30px;
    background-color: #040404;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}
</style>
