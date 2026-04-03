<template>
    <CusNav :title="$t('全球付')">
        <div class="tr size24" @click="routerPush('/pay/record')">{{ $t('汇款记录') }}</div>
    </CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="flex jc mb40">
            <div class="progressBox">
                <CusProgress :progress="progress"></CusProgress>
            </div>
        </div>

        <div class="mb60" v-if="stepCur==0">
            <div class="tc size32 bold6">{{ $t('您要汇款到哪里？') }}</div>
            <div class="tc size24 mt12 opc5">{{ $t('先选择收款国家，再输入金额') }}</div>
        </div>
        <div class="mb60" v-else-if="stepCur==1">
            <div class="tc size32 bold6">{{ $t('收款人是谁？') }}</div>
            <div class="tc size24 mt12">
                <span class="opc5">{{ $t('汇款到') }}</span>
                <span class="main">{{ currency?.NameCn }}</span>
                <span class="opc5"> · {{ $t('收款币种') }}</span>
                <span class="main">{{ currency?.CurrencyCode }}</span>
            </div>
        </div>
        <div class="mb60" v-else>
            <div class="tc size32 bold6">{{ $t('最后一步') }}</div>
            <div class="tc size24 mt12 opc5">{{ $t('选择汇款通道和到账时间') }}</div>
        </div>

        <StepOne @nextStep="changeStepTwo" v-if="stepCur==0"></StepOne>
        <StepTwo @nextStep="changeStepThree" @prevStep="backStepOne" :fields="fields" v-else-if="stepCur==1"></StepTwo>
        <StepThree @submit="submit" @prevStep="backStepTwo" :serviceFeeUSD="serviceFeeUSD" :totalPayUSD="totalPayUSD" :channel="channel" :currency="currency" :form="formData" v-else></StepThree>
    </div>

    <div class="gap30"></div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import CusProgress from '@/components/CusProgress/index.vue'
import StepOne from './components/StepOne.vue';
import StepTwo from './components/StepTwo.vue';
import StepThree from './components/StepThree.vue';
import { computed, ref } from 'vue';
import { apiFields, apiGlobalPay } from '@/api/pay';
import { message } from '@/utils/message';
import { t } from '@/locale';
import { routerPush, routerReplace } from '@/router';

const stepCur = ref(0)

const currency = ref()

const channel = ref()

const fields = ref()

const serviceFeeUSD = ref()
const totalPayUSD = ref()

const formData = ref()

const progress = computed(()=>{
    if(stepCur.value == 0) return 33
    else if(stepCur.value == 1) return 66
    else return 100
})

const changeStepTwo = async (data:any) => {
    currency.value = data.currency
    channel.value = data.channel
    serviceFeeUSD.value = data.serviceFeeUSD
    totalPayUSD.value = data.totalPayUSD
    stepCur.value = 1

    const res:any = await apiFields({
        country_code: currency.value.Code,
        channel_code: channel.value.Code
    })

    fields.value = res.map((item:any)=>{
        if(item.key=='amount')return { ...item,...{value: data.amount} }
        else if(item.key=='channel_code')return { ...item,...{value: channel.value.Code} }
        else if(item.key=='channel_issue_code')return { ...item,...{value: channel.value.IssueCode} }
        else if(item.key=='currency_code')return { ...item,...{value: currency.value.CurrencyCode} }
        else if(item.key=='purpose')return { ...item,...{value: 1} }
        else return item
    })
}

const changeStepThree = (data:any) => {
    if(!data)return
    const msg = data.reduce((obj:any, item:any) => {
        obj[item.key] = item.value
        return obj
    }, {})
    formData.value = msg
    stepCur.value = 2
}

const backStepOne = () => stepCur.value = 0
const backStepTwo = () => stepCur.value = 1

const submit = async (purpose:any) => {
    await apiGlobalPay({
        ...formData.value,
        ...{
            purpose,
            country_code: currency.value.Code
        }
    })
    message(t('提交成功'), 'success')
    setTimeout(() => {
        routerReplace('/pay/record')
    }, 1200);
}
</script>

<style lang="scss" scoped>
.progressBox{
    width: 240px;
    height: 12px;
    border-radius: 6px;
}
</style>