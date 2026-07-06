<template>
    <CusNav :title="$t('充值')"></CusNav>
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
                <template v-if="currentCoin">
                    <img :src="currentCoin.logo" class="img48 mr10">
                    <div class="mr10">{{ currentCoin.name }}</div>
                </template>
                <div class="mr10 opc6" v-else>{{ t('请选择币种') }}</div>
                <van-icon name="arrow" class="opc6" />
            </div>
        </div>

        <div class="flex jc mt100">
            <div class="mainCard box flex jc ac">
                <QRCode :value="address" :size="160" :bordered="false" v-if="address" />
                <CusEmpty v-else></CusEmpty>
            </div>
        </div>

        <div class="cell card mb20 mt100">
            <div class="flex jb ac">
                <div class="size28 main">{{ $t('充值地址') }}</div>
            </div>
            <div class="br size24 bold5 lh40 opc6 mt30">{{ address || '--' }}</div>
        </div>

        <div class="mainBtn flex jc ac size28 bold6 mt40" v-copy="address" v-if="address">{{ $t('复制地址') }}</div>

    </div>

    <CusPicker v-model:show="showPicker" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" allow-empty @change="onPickerChange">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.name }}</span>
        </template>
    </CusPicker>

    <CusPicker v-model:show="showPickerClain" :list="pickerClainList" :title="$t('请选择')" :default-index="pickerClainCurrent" allow-empty @change="onChainChange">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.name }}</span>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import { apiRecharge } from '@/api/user';
import CusNav from '@/components/CusNav/index.vue'
import { assetAIX, assetBot, assetNFTC, assetUSDT } from '@/config';
import { computed, onMounted, ref } from 'vue';
import usdtLogo from '@/assets/common/usdt.png'
import botLogo from '@/assets/bot.png'
import aixLogo from '@/assets/common/aix.png'
import CusEmpty from '@/components/CusEmpty/index.vue'
import { t } from '@/locale';
import CusPicker from '@/components/CusPicker/index.vue'

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

const showPicker = ref(false)
const pickerCurrent = ref(-1)
const assetList = [
    {name: assetUSDT, logo:usdtLogo, chain: 'BEP20'},
    {name: assetNFTC, logo:usdtLogo, chain: 'BEP20'},
    {name: assetAIX, logo:aixLogo, chain: 'BEP20'},
    {name: assetBot, logo:botLogo, chain: 'BOT'}
]
const pickerList = computed(()=>currentChain.value ? assetList.filter(item => item.chain === currentChain.value?.name) : [])
const currentCoin = computed(() => pickerCurrent.value >= 0 ? pickerList.value[pickerCurrent.value] : null)
const openPicker = () => {
    if(!currentChain.value)return
    showPicker.value = true
}
const onPickerChange = (index: number) => {
    pickerCurrent.value = index
}

const recharge_address = ref()
const bot_recharge_address = ref()
const address = computed(()=>{
    if(!currentCoin.value || !currentChain.value)return ''
    if(currentCoin.value.chain !== currentChain.value.name)return ''
    return currentCoin.value.chain === 'BOT' ? bot_recharge_address.value : recharge_address.value
})
const loadData = async () => {
    const res:any = await apiRecharge()
    recharge_address.value = res.recharge_address
    bot_recharge_address.value = res.bot_recharge_address
}

onMounted(()=>{
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
.box{
    width: 200PX;
    height: 200PX;
}
</style>
