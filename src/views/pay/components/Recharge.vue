<template>
    <VanPopup v-model:show="show" style="background: transparent;" position="bottom" overlay-class="cusMask" teleport="#app">
        <div class="popup">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('充值') }}</div>
                    <van-icon size="20" name="cross" color="#8D9094" @click="show=false" />
                </div>

                <div class="flex jb ac mt60">
                    <div class="size28 bold5">{{ $t('选择卡') }}</div>
                </div>

                <div class="inp flex jb ac mt20 size28" @click="pickerShow=true">
                    <div v-if="currentPicker">{{ currentPicker.card_number }}</div>
                    <div class="gray" v-else>{{ $t('请选择卡') }}</div>
                    <div class="gray">
                        <van-icon name="arrow" />
                    </div>
                </div>

                <div class="size28 bold5 mt30">{{ $t('充值金额') }}</div>
                <div class="inp flex jb ac mt20 size28">
                    <input type="number" v-model="inputAmount" :placeholder="$t('请输入充值金额')" class="flex1">
                    <div class="line"></div>
                    <img src="@/assets/common/usd.png" class="img36 ml20">
                    <div class="size20 ml6">{{ assetUSD }}</div>
                </div>

                <div class="size28 bold5 mt30">{{ $t('到账金额') }}</div>
                <div class="inp flex jb ac mt20 size28">
                    <div class="flex1" v-init="receiveAmount"></div>
                    <div class="line"></div>
                    <img src="@/assets/common/usd.png" class="img36 ml20">
                    <div class="size20 ml6">{{ assetUSD }}</div>
                </div>

                <div class="size28 bold5 mt30">{{ $t('支付密码') }}</div>
                <div class="inp flex jb ac mt20 size28">
                    <input type="password" v-model="payPassword" :placeholder="$t('请输入支付密码')" class="flex1">
                </div>

                <div class="size28 bold6 mt30 mb30">{{ $t('支付方式') }}</div>
                <CusPaytype v-model:paytype="paytype" :show-axe="true"></CusPaytype>

                <div class="size28 bold5 mt30">{{ $t('支付金额') }}</div>
                <div class="inp flex jb ac mt20 size28">
                    <div class="flex1" v-init="paymentAmount"></div>
                    <div class="line"></div>
                    <img :src="paymentLogo" class="img36 ml20">
                    <div class="size20 ml6">{{ paymentAsset }}</div>
                </div>

                <div class="mainBtn mt100 flex jc ac size28 main bold6 btn" @click="submit">{{ $t('确认') }}</div>

                <div class="safeArea"></div>
            </div>
        </div>
    </VanPopup>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" @change="$event=>pickerCurrent=$event">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.card_number }}</span>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import { useCard } from '@/hooks/useCardholder';
import { computed, ref } from 'vue';
import CusPicker from '@/components/CusPicker/index.vue';
import { assetAXE, assetUSD, assetUSDT } from '@/config';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { message } from '@/utils/message';
import { t } from '@/locale';
import { apiRecharge } from '@/api/card';
import { apiConfig } from '@/api/home';
import { computedDiv, computedMul, computedSub } from '@/utils';
import CusPaytype from '@/components/CusPaytype/pay.vue'
import axeLogo from '@/assets/common/axe.webp'
import usdtLogo from '@/assets/common/usdt.png'

const emits = defineEmits(['success'])

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const { pickerShow, pickerList, currentPicker, pickerCurrent, loadPickerList } = useCard()

const paytype = ref('balance_usdt')

const show = ref(false)

const inputAmount = ref()
const payPassword = ref()
const config = ref()
const axePrice = computed(() => Number(config.value?.axe_price || 0))
const paymentAsset = computed(() => paytype.value === 'balance_axe' ? assetAXE : assetUSDT)
const paymentLogo = computed(() => paytype.value === 'balance_axe' ? axeLogo : usdtLogo)
const paymentAmount = computed(() => {
    const amount = inputAmount.value || 0
    if (paytype.value !== 'balance_axe') return amount
    return axePrice.value > 0 ? computedDiv(amount, axePrice.value) : 0
})
const receiveAmount = computed(() => {
    const amount = inputAmount.value || 0
    const fee = userInfo.value?.finance_level?.recharge_fee || 0
    return fee > 0 ? computedSub(amount, computedDiv(computedMul(amount, fee), 100)) : amount
})

const open = () => {
    userStore.loadUserInfo()
    loadConfig()
    inputAmount.value = ''
    payPassword.value = ''
    show.value = true
    loadPickerList()
}

const loadConfig = async () => config.value = await apiConfig()

const submit = async () => {
    if(!currentPicker.value)return message(t('请选择卡'))
    if(!inputAmount.value)return message(t('请输入充值金额'))
    if(!payPassword.value)return message(t('请输入支付密码'))
    await apiRecharge({
        amount: inputAmount.value,
        card_id: currentPicker.value.id,
        ccy: paytype.value,
        pay_password: payPassword.value
    })
    userStore.loadUserInfo()
    message(t('充值成功'), 'success')
    show.value = false
    emits('success')
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.inp{
    height: 90px;
    padding: 0 30px;
    background-color: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    border-radius: 14px;
    .line{
        width: 1px;
        height: 44px;
        background-color: #FFFFFF33;
    }
}
</style>
