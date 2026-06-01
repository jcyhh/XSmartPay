<template>
    <div class="mainCard">
        <div class="inp flex jb ac" @click="pickerShow=true">
            <div class="size28">挂买币种</div>
            <div class="flex ac size28 opc5">
                <div class="mr10">{{ pickerList[pickerCurrent].name }}</div>
                <van-icon name="arrow" />
            </div>
        </div>
        <div class="size28 mt30">挂买数量</div>
        <div class="inp flex jb ac mt25">
            <input type="number" placeholder="请输入数量" class="flex1 size28">
            <div class="size28">{{ assetUSDT }}</div>
        </div>
        <div class="size24 opc5 mt16">
            <span>限量 : </span>
            <span v-init="1000"></span>
            <span class="ml5">{{ assetUSDT }}</span>
            <span class="ml5 mr5">-</span>
            <span v-init="1000"></span>
            <span class="ml5">{{ assetUSDT }}</span>
        </div>
        <div class="size28 mt30">挂买单价</div>
        <div class="inp flex jb ac mt25">
            <input type="number" placeholder="请输入金额" class="flex1 size28">
            <div class="size28">CNY</div>
        </div>
        <div class="size24 opc5 mt16">
            <span>限价 : </span>
            <span v-init="1000"></span>
            <span class="ml5">CNY</span>
            <span class="ml5 mr5">-</span>
            <span v-init="1000"></span>
            <span class="ml5">CNY</span>
        </div>
        <div class="size28 mt30">订单限额</div>
        <div class="mt24 flex ac">
            <div class="inp flex flex1">
                <input type="number" placeholder="最低" class="flex1 size28">
            </div>
            
            <div class="line"></div>
            <div class="inp flex flex1">
                <input type="number" placeholder="最高" class="flex1 size28">
            </div>
        </div>
        <div class="size28 opc5 mt40 mb16">支付方式（可多选）</div>
        <CusPaytype v-model:paytype="paytype" :multiple="true"></CusPaytype>
    </div>

    <div class="mainBtn size28 bold6 flex jc ac mt60" @click="submit">{{ $t('确认发布') }}</div>
    <div class="gap100"></div>

    <CusPicker v-model:show="pickerShow" :list="pickerList" :title="$t('请选择')" :default-index="pickerCurrent" @change="$event=>pickerCurrent=$event">
        <template v-slot="{ item }">
            <span class="bold5">{{ item.first_name }} {{ item.last_name }}({{ item.country_code }})</span>
        </template>
    </CusPicker>
</template>

<script setup lang="ts">
import CusPicker from '@/components/CusPicker/index.vue';
import { assetUSDT } from '@/config'
import { computed, ref } from 'vue';
import iconUsdt from '@/assets/common/usdt.png'
import CusPaytype from '@/components/CusPaytype/otc.vue'

// 币种
const pickerShow = ref(false)
const pickerCurrent = ref(0)
const pickerList = computed(()=>([
    {name:assetUSDT, icon: iconUsdt, value:'balance_usdt'}
]))

const paytype = ref<string[]>(['bank'])

const submit = () => {

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