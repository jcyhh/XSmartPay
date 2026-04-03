<template>
    <div class="flex col ac" v-if="pickerList.length==0">
        <CusEmpty></CusEmpty>
        <van-loading />
    </div>
    <div v-else>
        <div class="size26 bold5">{{ $t('收款国家/地区') }}</div>
        <div class="cell mt20 flex jb ac size28" @click="pickerShow=true">
            <div v-if="currentPicker">{{ currentPicker.NameCn }} ({{ currentPicker.CurrencyCode }})</div>
            <div class="opc5" v-else>{{ $t('请选择') }}</div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>

        <div class="mt30 size26 bold5">{{ $t('汇款通道') }}</div>
        <div class="cell mt20 flex jb ac size28" @click="pickerChannelShow=true">
            <div v-if="currentPickerChannel">{{ currentPickerChannel.Name }}</div>
            <div class="opc5" v-else>{{ $t('请选择') }}</div>
            <van-icon name="arrow" color="#FFFFFF80" />
        </div>

        <div class="mt30 size26 bold5">{{ $t('汇款金额') }}</div>
        <div class="cell mt20 flex jb ac size28">
            <input type="number" v-model="inputAmount" placeholder="0.00" class="flex1">
            <div class="line ml26 mr26"></div>
            <div>{{ currentPicker ? currentPicker.CurrencyCode : '--' }}</div>
        </div>

        <div class="mt30" v-if="currentPickerChannel">
            <div class="flex jb ac size26 opc5">
                <div>{{ $t('工作时间') }}</div>
                <div>{{ currentPickerChannel.WorkTimeEn }}</div>
            </div>

            <div class="flex jb ac size26 opc5 mt30">
                <div>{{ $t('通道费') }}</div>
                <div><span v-init="currentPickerChannel.ChannelFee"></span> USD</div>
            </div>

            <div class="flex jb ac size26 green mt30">
                <div>{{ $t('限时减免') }}</div>
                <div>- <span v-init="currentPickerChannel.ChannelFeeDiscount"></span> USD</div>
            </div>

            <div class="flex jb ac size26 opc5 mt30">
                <div>{{ $t('手续费') }}({{ computedMul(currentPickerChannel.ServiceFeeRate, 100) }}%)</div>
                <div><span v-init="serviceFeeUSD"></span> USD</div>
            </div>

            <div class="flex jb ac size26 green mt30">
                <div>{{ $t('限时减免') }}({{ computedMul(currentPickerChannel.ServiceFeeDiscount, 100) }}%)</div>
                <div>- 0 USD</div>
            </div>

            <div class="flex jb ac size26 opc5 mt30">
                <div>{{ $t('实时汇率') }}</div>
                <div>1 USD = <span v-init="currentPickerChannel.exchangeRate[`USD${currentPicker.CurrencyCode}`]"></span> {{ currentPicker.CurrencyCode }}</div>
            </div>

            <div class="flex jb ac size26 opc5 mt30">
                <div>{{ $t('需要支付') }}</div>
                <div><span v-init="totalPayUSD"></span> USD</div>
            </div>
        </div>

        <div class="mainBtn flex jc ac mt80 size28 bold6" @click="submit">{{ $t('下一步') }}</div>
    </div>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" @change="onPickerChange">
        <template v-slot="{ item }">
            <div class="size28 bold5">{{ item.NameCn }} ({{ item.CurrencyCode }})</div>
        </template>
    </CusPicker>

    <CusPicker v-model:show="pickerChannelShow" :list="pickerChannelList" :title="$t('请选择')" :default-index="pickerChannelCurrent" @change="onPickerChannelChange">
        <template v-slot="{ item }">
            <div class="bold5">
                <span class="size28">{{ item.Name }}</span>
                <span class="size26 opc6">({{ item.MinLimit }} ~ {{ item.MaxLimit }} {{ currentPicker.CurrencyCode }})</span>
            </div>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import { apiCurrencys } from '@/api/pay';
import CusEmpty from '@/components/CusEmpty/index.vue'
import { computed, onMounted, ref } from 'vue';
import CusPicker from '@/components/CusPicker/index.vue';
import { computedAdd, computedDiv, computedMul } from '@/utils';
import { message } from '@/utils/message';
import { t } from '@/locale';

const emits = defineEmits(['nextStep'])

// 选择国家
const pickerCurrent = ref(0)
const pickerShow = ref(false)
const pickerList = ref<any[]>([])
const currentPicker = computed(()=>pickerList.value.length==0&&pickerCurrent.value>=0?null:pickerList.value[pickerCurrent.value])
const loadCurrencys = async () => {
    const res:any = await apiCurrencys()
    pickerList.value = res.list
}

// 选择国家的通道
const pickerChannelCurrent = ref(0)
const pickerChannelShow = ref(false)
const pickerChannelList = computed(()=>currentPicker.value ? currentPicker.value.channels : null)
const currentPickerChannel = computed(()=>pickerChannelList.value&&pickerChannelList.value.length>0&&pickerChannelCurrent.value>=0?pickerChannelList.value[pickerChannelCurrent.value]:null)

const onPickerChange = (index:any) => {
    if(pickerCurrent.value == index)return
    pickerCurrent.value = index
    pickerChannelCurrent.value = 0
}
const onPickerChannelChange = (index:any) => {
    if(pickerChannelCurrent.value == index)return
    pickerChannelCurrent.value = index
}


const inputAmount = ref()
// 需要支付
const inputAmountUSD = computed(()=>{
    if(!inputAmount.value) return '0'
    if(!currentPicker.value) return '0'
    if(!currentPickerChannel.value)return '0'
    const rates = currentPickerChannel.value.exchangeRate[`USD${currentPicker.value.CurrencyCode}`] || 0
    return computedDiv(inputAmount.value, rates)
})
const serviceFeeUSD = computed(()=>{
    if(!inputAmount.value) return '0'
    if(!currentPickerChannel.value)return '0'
    return computedMul(inputAmountUSD.value, currentPickerChannel.value.ServiceFeeRate)
})
const totalPayUSD = computed(()=>{
    if(!inputAmount.value) return '0'
    if(!currentPicker.value) return '0'
    if(!currentPickerChannel.value)return '0'

    const channelFee = currentPickerChannel.value.ChannelFee || 0

    return computedAdd(computedAdd(inputAmountUSD.value, serviceFeeUSD.value), channelFee)
})

const submit = () => {
    if(!currentPicker.value) return message(t('请选择国家/地区'))
    if(!currentPickerChannel.value)return message(t('请选择汇款通道'))
    if(!inputAmount.value)return message(t('请输入汇款金额'))
    emits('nextStep', {
        currency: currentPicker.value,
        channel: currentPickerChannel.value,
        amount: inputAmount.value,
        serviceFeeUSD: serviceFeeUSD.value,
        totalPayUSD: totalPayUSD.value
    })
}

onMounted(()=>{
    loadCurrencys()
})
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
</style>