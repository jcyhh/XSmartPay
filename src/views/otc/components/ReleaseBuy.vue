<template>
    <div class="mainCard">
        <div class="inp flex jb ac" @click="pickerShow=true">
            <div class="size28">挂买币种</div>
            <div class="flex ac size28 opc5">
                <img :src="currentPicker?.icon" class="img32 mr10" v-if="currentPicker?.icon">
                <div class="mr10">{{ currentPicker?.name }}</div>
                <van-icon name="arrow" />
            </div>
        </div>
        <div class="size28 mt30">挂买数量</div>
        <div class="inp flex jb ac mt25">
            <input type="number" v-model="num" placeholder="请输入数量" class="flex1 size28">
            <div class="size28">{{ currentPicker?.name }}</div>
        </div>
        <div class="size24 opc5 mt16">
            <span>限量 : </span>
            <span v-init="currentPicker?.min_order_amount"></span>
            <span class="ml5">{{ currentPicker?.name }}</span>
            <span class="ml5 mr5">-</span>
            <template v-if="currentPicker?.max_order_amount">
                <span v-init="currentPicker?.max_order_amount"></span>
                <span class="ml5">{{ currentPicker?.name }}</span>
            </template>
            <span v-else>不限</span>
        </div>
        <div class="size28 mt30">挂买单价</div>
        <div class="inp flex jb ac mt25">
            <input type="number" v-model="price" placeholder="请输入金额" class="flex1 size28">
            <div class="size28">CNY</div>
        </div>
        <div class="size24 opc5 mt16">
            <span>限价 : </span>
            <span v-init="currentPicker?.min_price"></span>
            <span class="ml5">CNY</span>
            <span class="ml5 mr5">-</span>
            <span v-init="currentPicker?.max_price"></span>
            <span class="ml5">CNY</span>
        </div>
        <div class="size28 mt30">订单限额 <span class="size24 opc5">(不填则不限制)</span></div>
        <div class="mt24 flex ac">
            <div class="inp flex flex1">
                <input type="number" v-model="min_num" :placeholder="`最低`" class="flex1 size28">
            </div>
            
            <div class="line"></div>
            <div class="inp flex flex1">
                <input type="number" v-model="max_num" :placeholder="`最高`" class="flex1 size28">
            </div>
        </div>
        <div class="size28 opc5 mt40 mb16">支付方式（可多选）</div>
        <CusPaytype v-model:paytype="paytype" :multiple="true"></CusPaytype>
    </div>

    <div class="mainBtn size28 bold6 flex jc ac mt60" @click="submit">{{ $t('确认发布') }}</div>
    <div class="gap100"></div>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" @change="$event=>pickerCurrent=$event">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.name }}</span>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import CusPicker from '@/components/CusPicker/index.vue';
import { computed, ref } from 'vue';
import CusPaytype from '@/components/CusPaytype/otc.vue'
import { apiCreateOtcOrder } from '@/api/otc';
import { t } from '@/locale';
import { message } from '@/utils/message';
import { routerGo } from '@/router';

interface OtcAssetOption {
    name: string
    icon?: string
    value: string
    price?: number | string
    min_price?: number | string
    max_price?: number | string
    min_order_amount?: number | string
    max_order_amount?: number | string
}

const props = defineProps<{
    pickerList: OtcAssetOption[]
}>()

// 币种
const pickerShow = ref(false)
const pickerCurrent = ref(0)
const currentPicker = computed(() => props.pickerList[pickerCurrent.value])

const paytype = ref<string[]>(['bank'])
const num = ref()
const price = ref()
const min_num = ref()
const max_num = ref()

const getPayTypes = () => paytype.value.map(item => item === 'bank' ? 'bank_card' : item)

const submit = async () => {
    if(!currentPicker.value)return message(t('请选择币种'))
    if(!num.value)return message(t('请输入数量'))
    if(!price.value)return message(t('请输入金额'))
    if(paytype.value.length === 0)return message(t('请选择支付方式'))

    const params:any = {
        ccy: currentPicker.value.value,
        type: 2,
        num: num.value,
        price: price.value,
        pay_types: getPayTypes()
    }

    if(min_num.value) params.min_num = min_num.value
    if(max_num.value) params.max_num = max_num.value

    await apiCreateOtcOrder(params)
    message(t('发布成功'), 'success')
    setTimeout(() => routerGo(), 1200)
}
</script>

<style lang="scss" scoped>
.line{
    width: 20px;
    height: 1px;
    background-color: #D9D9D9;
    margin: 0 25px;
    flex-shrink: 0;
}
</style>