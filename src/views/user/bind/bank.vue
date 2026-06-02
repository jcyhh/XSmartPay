<template>
    <CusNav :title="$t('银行卡')"></CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="cell flex ac">
            <input type="text" v-model="real_name" :placeholder="$t('持卡人姓名')" class="flex1 size28">
        </div>

        <div class="cell flex ac mt20">
            <input type="text" v-model="account" :placeholder="$t('卡号')" class="flex1 size28">
        </div>

        <div class="cell flex ac mt20">
            <input type="text" v-model="bank_name" :placeholder="$t('银行名称')" class="flex1 size28">
        </div>

        <div class="cell flex ac mt20">
            <input type="text" v-model="branch_name" :placeholder="$t('开户行')" class="flex1 size28">
        </div>

        <div class="mainBtn mt60 flex jc ac size28 bold5" @click="submit">{{ $t('确认') }}</div>

    </div>
</template>

<script setup lang="ts">
import CusNav from '@/components/CusNav/index.vue'
import { apiOtcPaymentDetail, apiSaveOtcPayment } from '@/api/otc';
import { t } from '@/locale';
import { routerGo } from '@/router';
import { message } from '@/utils/message';
import { onMounted, ref } from 'vue';

interface BankPayment {
    id?: number | null
    real_name?: string | null
    account?: string | null
    bank_name?: string | null
    branch_name?: string | null
}

const real_name = ref()
const account = ref()
const bank_name = ref()
const branch_name = ref()

const loadDetail = async () => {
    const res = await apiOtcPaymentDetail({ type: 'bank_card' }) as unknown as BankPayment
    if (!res?.id) return

    real_name.value = res.real_name || ''
    account.value = res.account || ''
    bank_name.value = res.bank_name || ''
    branch_name.value = res.branch_name || ''
}

const submit = async () => {
    if(!real_name.value)return message(t('请输入持卡人姓名'))
    if(!account.value)return message(t('请输入卡号'))
    if(!bank_name.value)return message(t('请输入银行名称'))
    if(!branch_name.value)return message(t('请输入开户行'))

    await apiSaveOtcPayment({
        type: 'bank_card',
        real_name: real_name.value,
        account: account.value,
        bank_name: bank_name.value,
        branch_name: branch_name.value
    })

    message(t('保存成功'), 'success')
    setTimeout(() => routerGo(), 1200)
}

onMounted(() => {
    loadDetail()
})
</script>

<style lang="scss" scoped>
.cell{
    background: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    padding: 0 30px;
    height: 88px;
    border-radius: 14px;
}
</style>