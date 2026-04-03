<template>
    <CusNav :title="$t('绑定实体卡')"></CusNav>
    <div class="pl30 pr30 pt30 rel">
        
        <div class="size28 bold6">{{ $t('持卡人') }}</div>
        <div class="cell card mt20 flex jb ac" @click="pickerShow=true">
            <div v-if="currentPicker">{{ currentPicker.first_name }} {{ currentPicker.last_name }} ({{ currentPicker.country_code }})</div>
            <div class="gray" v-else>{{ $t('请选择持卡人') }}</div>
            <div class="gray">
                <van-icon name="arrow" />
            </div>
        </div>

        <div class="mt30">
            <div class="size28 bold6">{{ $t('卡号') }}</div>
            <div class="cell card mb20 flex jb ac mt20">
                <input type="text" v-model="card_number" :placeholder="$t('请输入卡号')" class="flex1 size28">
            </div>
        </div>

    </div>

    <div class="safeArea"></div>
    <div class="gap130"></div>
    <div class="bottom">
        <div class="mainBtn size28 bold6 flex jc ac" @click="submit">{{ $t('确认') }}</div>
        <div class="safeArea"></div>
    </div>

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
import { apiCardBind } from '@/api/card';
import CusNav from '@/components/CusNav/index.vue'
import CusPicker from '@/components/CusPicker/index.vue';
import { useCardholder } from '@/hooks/useCardholder';
import { t } from '@/locale';
import { routerGo, routerPush } from '@/router';
import { message } from '@/utils/message';
import { onMounted, ref } from 'vue';

const { pickerShow, pickerList, currentPicker, pickerCurrent, loadPickerList } = useCardholder()

const card_number = ref()

const submit = async () => {
    if(!currentPicker.value)return message(t('请选择持卡人'))
    if(!card_number.value)return message(t('请输入卡号'))
    await apiCardBind({
        cardholder_id: currentPicker.value?.cardholder_id,
        card_number: card_number.value
    })
    message(t('绑定成功'), 'success')
    setTimeout(() => {
        routerGo()
    }, 1200);
}

onMounted(()=>{
    loadPickerList()
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
.bottom{
    width: 100vw;
    padding: 20px 30px 30px 30px;
    background-color: #040404;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
}
</style>