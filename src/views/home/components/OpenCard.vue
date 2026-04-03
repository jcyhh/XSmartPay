<template>
    <VanPopup v-model:show="show" style="background: transparent;" position="bottom" overlay-class="cusMask" teleport="#app">
        <div class="popup">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('立即开卡') }}</div>
                    <van-icon size="20" name="cross" color="#8D9094" @click="close" />
                </div>

                <div class="mt40 size48 bold" v-init="cardInfo?.price"></div>
                <div class="size24 mt20 opc5">{{ $t('开卡金额') }}({{ assetUSDT }})</div>
                <div class="flex jb ac mt30">
                    <div class="size24">
                        <span class="opc5">{{ $t('可用余额') }}</span>
                        <span class="main ml10" v-init="userInfo?.balance_usdt"></span>
                        <span class="main ml5">{{ assetUSDT }}</span>
                    </div>
                    <div class="flex ac">
                        <div class="size24 opc5">{{ $t('卡币种') }}</div>
                        <div class="tag flex ac ml10">
                            <img src="@/assets/common/usd.png" class="img28 mr10">
                            <div class="size20 bold6">{{ assetUSD }}</div>
                        </div>
                    </div>
                </div>
                <div class="size28 bold5 mt30">{{ $t('持卡人') }}</div>
                <div class="inp flex jb ac mt20 size28" @click="pickerShow=true">
                    <div v-if="currentPicker">{{ currentPicker.first_name }} {{ currentPicker.last_name }}({{ currentPicker.country_code }})</div>
                    <div class="gray" v-else>{{ $t('请选择持卡人') }}</div>
                    <div class="gray">
                        <van-icon name="arrow" />
                    </div>
                </div>

                <div class="size28 bold5 mt30">{{ $t('首充金额') }}</div>
                <div class="inp flex jb ac mt20 size28">
                    <div class="flex1" v-init="1"></div>
                    <div class="line"></div>
                    <img src="@/assets/common/usdt.png" class="img36 ml20">
                    <div class="size20 ml6">{{ assetUSDT }}</div>
                </div>

                <div class="size28 bold5 mt30">{{ $t('到账金额') }}</div>
                <div class="inp flex jb ac mt20 size28">
                    <div class="flex1" v-init="1"></div>
                    <div class="line"></div>
                    <img src="@/assets/common/usd.png" class="img36 ml20">
                    <div class="size20 ml6">{{ assetUSD }}</div>
                </div>

                <div class="mainBtn mt100 flex jc ac size28 main bold6 btn" @click="submit">{{ $t('确认开卡') }}</div>

                <div class="safeArea"></div>
                
            </div>
        </div>
    </VanPopup>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" @change="$event=>pickerCurrent=$event">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.first_name }} {{ item.last_name }}({{ item.country_code }})</span>
        </template>
        <template #empty-action>
            <div class="mainBtn flex jc ac bold5 size30" @click="routerPush('/cardholder/add')">{{ $t('添加持卡人') }}</div>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import { assetUSD, assetUSDT } from '@/config';
import { ref } from 'vue';
import CusPicker from '@/components/CusPicker/index.vue';
import { useCardholder } from '@/hooks/useCardholder';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { message } from '@/utils/message';
import { t } from '@/locale';
import { apiOpenVirtualCard } from '@/api/card';
import { routerPush } from '@/router';

const emits = defineEmits(['success'])

const { pickerShow, pickerList, currentPicker, pickerCurrent, loadPickerList } = useCardholder()

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const show = ref(false)

const cardInfo = ref()

const open = (data:any) => {
    cardInfo.value = data
    show.value = true
    loadPickerList()
}

const close = () => show.value = false

const submit = async () => {
    if(!currentPicker.value)return message(t('请选择持卡人'))
    await apiOpenVirtualCard({
        product_id: cardInfo.value.id,
        cardholder_id: currentPicker.value.cardholder_id
    })
    message(t('开卡成功'), 'success')
    userStore.loadUserInfo()
    show.value = false
    emits('success')
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.btn{
    height: 88px;
    border-radius: 44px;
}
.tag{
    height: 44px;
    border-radius: 22px;
    padding: 0 10px;
    border: 1px solid rgba(255, 255, 255, 0.5);
}
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