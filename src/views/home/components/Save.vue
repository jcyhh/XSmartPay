<template>
    <VanPopup v-model:show="show" style="background: transparent;" position="bottom" overlay-class="cusMask" teleport="#app">
        <div class="popup">
            <div class="content">
                <div class="flex jb ac">
                    <div class="size28 main bold6">{{ $t('存入') }}</div>
                    <van-icon size="20" name="cross" color="#8D9094" @click="close" />
                </div>

                <div class="flex jb ac mt60">
                    <div class="size28 bold5">{{ $t('选择资产') }}</div>
                    <div class="size24">
                        <span class="opc5">{{ $t('可用余额') }}</span>
                        <span class="main mr5 ml10">
                            <span v-if="pickerCurrent==0" v-init="userInfo?.balance_usdt"></span>
                            <span v-else-if="pickerCurrent==1" v-init="userInfo?.balance_aix"></span>
                            <span v-else v-init="userInfo?.balance_nftc"></span>
                        </span>
                        <span class="main">{{ currentPicker.name }}</span>
                    </div>
                </div>

                <div class="inp flex jb ac mt20 size28" @click="pickerShow=true">
                    <div class="flex ac">
                        <img :src="currentPicker.icon" class="img48 mr10">
                        <div class="mr10">{{ currentPicker.name }}</div>
                    </div>
                    <div class="opc5">
                        <van-icon name="arrow" />
                    </div>
                </div>

                <div class="size28 bold5 mt30">{{ $t('存取方式') }}</div>
                <div class="inp flex jb ac mt20 size28" @click="pickerShowPlan=true">
                    <div class="mr10">{{ currentPickerPlan?.name }}</div>
                    <div class="opc5">
                        <van-icon name="arrow" />
                    </div>
                </div>

                <div class="size28 bold5 mt30">{{ $t('存入金额') }}</div>
                <div class="inp flex jb ac mt20 size28">
                    <input type="number" v-model="inputAmount" :placeholder="$t('请输入存入金额')" class="flex1">
                </div>

                <div class="flex mainBtn jc ac size28 bold6 mt80" @click="submit">{{ $t('确认') }}</div>
                <div class="safeArea"></div>
            </div>
        </div>
    </VanPopup>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" @change="$event=>pickerCurrent=$event">
        <template v-slot="{ item }">
            <div class="flex jc ac">
                <img :src="item.icon" class="img48 mr10">
                <div class="size28 bold5">{{ item?.name }}</div>
            </div>
        </template>
    </CusPicker>

    <CusPicker v-model:show="pickerShowPlan" :list="pickerListPlan" :title="$t('请选择')" :default-index="pickerCurrentPlan" @change="$event=>pickerCurrentPlan=$event">
        <template v-slot="{ item }">
            <div class="size28 bold5">{{ item?.name }}</div>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import { assetAIX, assetNFTC, assetUSDT } from '@/config'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import CusPicker from '@/components/CusPicker/index.vue';
import iconUsdt from '@/assets/common/usdt.png'
import iconAix from '@/assets/common/aix.png'
import { apiSave, apiYuebaoPlan } from '@/api/yuebao';
import { message } from '@/utils/message';
import { t } from '@/locale';

const emits = defineEmits(['success'])

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const pickerCurrent = ref(0)
const pickerShow = ref(false)
const pickerList = [
    {name:assetUSDT, icon: iconUsdt, value:'balance_usdt'},
    {name:assetAIX, icon: iconAix, value:'balance_aix'},
    {name:assetNFTC, icon: iconUsdt, value:'balance_nftc'}
]
const currentPicker = computed(()=>pickerList[pickerCurrent.value])

const pickerCurrentPlan = ref(0)
const pickerShowPlan = ref(false)
const pickerListPlan = ref<any[]>([])
const currentPickerPlan = computed(()=>pickerListPlan.value.length>0?pickerListPlan.value[pickerCurrentPlan.value]:null)
const loadPlan = async () => {
    const res:any = await apiYuebaoPlan()
    pickerListPlan.value = res.packages
}

const show = ref(false)
const inputAmount = ref()

const open = () => {
    inputAmount.value = ''
    show.value = true
    userStore.loadUserInfo()
}

const close = () => show.value = false

const submit = async () => {
    if(!inputAmount.value)return message(t('请输入存入金额'))
    await apiSave({
        amount: inputAmount.value,
        package_id: currentPickerPlan.value.id,
        ccy: currentPicker.value.value
    })
    message(t('存入成功'), 'success')
    close()
    emits('success')
}

onMounted(()=>{
    loadPlan()
})

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