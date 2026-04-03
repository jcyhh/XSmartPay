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
                    <div class="size24">
                        <span class="opc5">{{ $t('可用余额') }}</span>
                        <span class="bold5 main ml10" v-init="userInfo?.balance_usdt"></span>
                        <span class="bold5 main ml5">{{ assetUSDT }}</span>
                    </div>
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
                    <img src="@/assets/common/usdt.png" class="img36 ml20">
                    <div class="size20 ml6">{{ assetUSDT }}</div>
                </div>

                <div class="size28 bold5 mt30">{{ $t('到账金额') }}</div>
                <div class="inp flex jb ac mt20 size28">
                    <div class="flex1" v-init="inputAmount"></div>
                    <div class="line"></div>
                    <img src="@/assets/common/usd.png" class="img36 ml20">
                    <div class="size20 ml6">{{ assetUSD }}</div>
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
import { ref } from 'vue';
import CusPicker from '@/components/CusPicker/index.vue';
import { assetUSD, assetUSDT } from '@/config';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { message } from '@/utils/message';
import { t } from '@/locale';
import { apiRecharge } from '@/api/card';

const emits = defineEmits(['success'])

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const { pickerShow, pickerList, currentPicker, pickerCurrent, loadPickerList } = useCard()

const show = ref(false)

const inputAmount = ref()

const open = () => {
    userStore.loadUserInfo()
    inputAmount.value = ''
    show.value = true
    loadPickerList()
}

const submit = async () => {
    if(!currentPicker.value)return message(t('请选择卡'))
    if(!inputAmount.value)return message(t('请输入充值金额'))
    await apiRecharge({
        amount: inputAmount.value,
        card_id: currentPicker.value.id
    })
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