<template>
    <div class="size26 bold5">{{ $t('汇款目的') }}</div>
    <div class="cell mt20 flex jb ac size28" @click="pickerShow=true">
        <div v-if="currentPicker">{{ currentPicker.name }}</div>
        <div class="opc5" v-else>{{ $t('请选择') }}</div>
        <van-icon name="arrow" color="#FFFFFF80" />
    </div>

    <div class="mt40 size26">
        <div>{{ $t('收款人信息') }}</div>
        <div class="flex jb ac opc5 mt30">
            <div>{{ $t('银行名称') }}</div>
            <div>{{ form.bank_name }}</div>
        </div>
        <div class="flex jb ac opc5 mt30">
            <div>{{ $t('收款人姓名') }}</div>
            <div>{{ form.first_name }} {{ form.last_name }}</div>
        </div>
        <div class="flex jb ac opc5 mt30">
            <div>{{ $t('银行账号') }}</div>
            <div>{{ form.bank_no }}</div>
        </div>
        <div class="mt30">{{ $t('确认订单') }}</div>
        <div class="flex jb ac opc5 mt30">
            <div>{{ $t('汇款金额') }}</div>
            <div><span v-init="form.amount"></span> {{ form.currency_code }}</div>
        </div>
    </div>

    <div class="mt40 size26" v-if="channel && currency">
        <div class="flex jb ac opc5">
            <div>{{ $t('通道费') }}</div>
            <div><span v-init="channel.ChannelFee"></span> USD</div>
        </div>

        <div class="flex jb ac green mt30">
            <div>{{ $t('限时减免') }}</div>
            <div>- <span v-init="channel.ChannelFeeDiscount"></span> USD</div>
        </div>

        <div class="flex jb ac opc5 mt30">
            <div>{{ $t('手续费') }}({{ computedMul(channel.ServiceFeeRate, 100) }}%)</div>
            <div><span v-init="serviceFeeUSD"></span> USD</div>
        </div>

        <div class="flex jb ac green mt30">
            <div>{{ $t('限时减免') }}({{ computedMul(channel.ServiceFeeDiscount, 100) }}%)</div>
            <div>- 0 USD</div>
        </div>

        <div class="flex jb ac opc5 mt30">
            <div>{{ $t('实时汇率') }}</div>
            <div>1 USD = <span v-init="channel.exchangeRate[`USD${currency.CurrencyCode}`]"></span> {{ currency.CurrencyCode }}</div>
        </div>

        <div class="flex jb ac opc5 mt30">
            <div>{{ $t('需要支付') }}</div>
            <div><span v-init="totalPayUSD"></span> USD</div>
        </div>
    </div>

    <div class="flex mt80 size28 bold6">
        <div class="flex1 lineBtn flex jc ac" @click="submitPrev">{{ $t('上一步') }}</div>
        <div class="flex1 mainBtn flex jc ac ml20" @click="submit">{{ $t('确认汇款') }}</div>
    </div>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" @change="$event=pickerCurrent=$event">
        <template v-slot="{ item }">
            <div class="size28 bold5">{{ item.name }}</div>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import CusPicker from '@/components/CusPicker/index.vue';
import { t } from '@/locale';
import { computedMul } from '@/utils';
import { computed, ref } from 'vue';
defineProps(['currency', 'channel', 'form', 'serviceFeeUSD', 'totalPayUSD'])
const emits = defineEmits(['submit', 'prevStep'])

// 选择国家
const pickerCurrent = ref(0)
const pickerShow = ref(false)
const pickerList = computed(()=>([
    { name: t('贷款结算'), value: 'Loan Settlement' },
    { name: t('业务往来'), value: 'Business Transaction' },
    { name: t('服务费用'), value: 'Service Fee' },
    { name: t('采购款项'), value: 'Procurement Payment' },
    { name: t('工程款项'), value: 'Engineering Payment' },
    { name: t('项目款项'), value: 'Project Payment' },
    { name: t('投资款项'), value: 'Investment Payment' },
    { name: t('费用支付'), value: 'Expense Payment' },
    { name: t('资金划拨'), value: 'Fund Transfer' },
    { name: t('借款偿还'), value: 'Loan Repayment' },
    { name: t('其它用途'), value: 'Other Purpose' }
]))
const currentPicker = computed(()=>pickerList.value.length==0&&pickerCurrent.value>=0?null:pickerList.value[pickerCurrent.value])

const submitPrev = () => emits('prevStep')

const submit = () => {
    emits('submit', currentPicker.value?.value)
}
</script>

<style lang="scss" scoped>
.cell{
    background: #FFE5A51F;
    border: 1px solid #FFFFFF1A;
    padding: 0 30px;
    height: 88px;
    border-radius: 14px;
    .line{
        width: 1px;
        height: 44px;
        background-color: #FFFFFF1A;
    }
}
.lineBtn{
    height: 74px;
    border-radius: 37px;
    color: $main-color;
    font-size: 28px;
    border: 1px solid $main-color;
}
</style>